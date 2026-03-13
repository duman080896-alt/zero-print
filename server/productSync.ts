import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { log } from "./index";

const API_KEY = process.env.OASIS_API_KEY || "";
const CATEGORY_IDS = "3257,3180,3095,3140,3167,3225,3089,5316,2953,3238,3021,3058,5272,2892,3275,4047,3208,5312,3070,2931,3543,4197,3517";
const MARKUP_RULES = [
  { maxPrice: 500,      markup: 2.00 },
  { maxPrice: 1500,     markup: 1.60 },
  { maxPrice: 3000,     markup: 1.50 },
  { maxPrice: 6000,     markup: 1.40 },
  { maxPrice: 12000,    markup: 1.30 },
  { maxPrice: Infinity, markup: 1.25 },
];

function applyMarkup(rawPrice: number): number {
  const rule = MARKUP_RULES.find(r => rawPrice < r.maxPrice);
  return roundPrice(rawPrice * (rule?.markup ?? 1.25));
}
const DATA_FILE = path.join(process.cwd(), "data", "products.json");

export interface ProductVariant {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  oldPrice: number;
  article: string;
  images: string[];
  stock: number;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  fullName: string;
  brand: string;
  price: number;
  oldPrice: number;
  categories: number[];
  primaryCategory: number;
  images: string[];
  description: string;
  rating: number;
  colors: string[];
  sizes: string[];
  variants: ProductVariant[];
  stock: number;
  article: string;
  brandingMethods: string[];
  isNew: boolean;
  isHit: boolean;
  isSale: boolean;
}

interface RawProduct {
  id: string;
  name: string;
  full_name: string;
  brand: string;
  article: string;
  price: string;
  old_price: string;
  categories: string;
  images: string;
  description: string;
  attributes: string;
  included_branding: string;
  discount_price: string;
  full_categories: string;
  rating: string;
  total_stock: string;
  outlets: string;
}

function parseAttributes(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!attrStr) return attrs;
  const parts = attrStr.split(";");
  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx > 0) {
      const key = part.substring(0, colonIdx).trim();
      const val = part.substring(colonIdx + 1).trim();
      if (key && val) {
        if (attrs[key] && attrs[key] !== val) {
          attrs[key] = attrs[key] + ", " + val;
        } else {
          attrs[key] = val;
        }
      }
    }
  }
  return attrs;
}

function extractBrandingFromAttrs(attrStr: string): string[] {
  if (!attrStr) return [];
  const methods: string[] = [];
  const parts = attrStr.split(";");
  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx > 0) {
      const key = part.substring(0, colonIdx).trim();
      if (key === "Метод нанесения") {
        const val = part.substring(colonIdx + 1).trim();
        if (val && !methods.includes(val)) methods.push(val);
      }
    }
  }
  return methods;
}

function extractColor(name: string, attributes: Record<string, string>): string {
  const colorAttr = attributes["Цвет товара"] || attributes["Цвета товара"] || "";
  if (colorAttr) return colorAttr.split(",")[0].trim();
  const match = name.match(/,\s*(.+)$/);
  if (match) return match[1].trim();
  return "";
}

function extractSize(attributes: Record<string, string>): string {
  return attributes["Размер"] || attributes["Размер одежды"] || "";
}

function getBaseName(name: string): string {
  return name.replace(/,\s*[^,]+$/, "").trim();
}

function extractBrandingMethods(branding: string): string[] {
  if (!branding) return [];
  const methods = new Set<string>();
  const parts = branding.split(";");
  for (const part of parts) {
    const nameMatch = part.match(/name:([^;|]+)/);
    if (nameMatch) {
      const rawName = nameMatch[1].trim();
      const cleanName = rawName.replace(/\s*\(.*?\)\s*/g, "").trim();
      if (cleanName && cleanName.length < 40) methods.add(cleanName);
    } else {
      const match = part.match(/^([^(]+)/);
      if (match) {
        const method = match[1].trim();
        if (method && method.length < 40 && !method.startsWith("id:")) methods.add(method);
      }
    }
  }
  return Array.from(methods);
}

function roundPrice(price: number): number {
  return Math.round(price);
}

export async function syncProducts(): Promise<number> {
  if (!API_KEY) {
    log("OASIS_API_KEY not set, skipping sync", "sync");
    return 0;
  }
  log("Starting product sync from Oasis API...", "sync");

  const url = `https://api.oasiscatalog.com/v4/products?key=${API_KEY}&currency=kzt&format=csv&no_vat=1&moscow=1&category=${CATEGORY_IDS}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const csvText = await response.text();
  log(`Downloaded CSV: ${(csvText.length / 1024 / 1024).toFixed(1)}MB`, "sync");

  const records: RawProduct[] = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  log(`Parsed ${records.length} raw products`, "sync");

  const groups = new Map<string, RawProduct[]>();

  for (const record of records) {
    const baseName = getBaseName(record.name || record.full_name);
    const brand = (record.brand || "").trim();
    const cats = (record.full_categories || record.categories || "").split(";").filter(Boolean);
    const primaryCat = cats[cats.length - 1] || "other";
    const groupKey = `${baseName}|||${brand}|||${primaryCat}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(record);
  }

  log(`Grouped into ${groups.size} products`, "sync");

  const products: Product[] = [];

  for (const [, variants] of groups) {
    const first = variants[0];
    const baseName = getBaseName(first.name || first.full_name);

    const colorsSet = new Set<string>();
    const sizesSet = new Set<string>();
    const allImages: string[] = [];
    let totalStock = 0;
    let minPrice = Infinity;
    let minOldPrice = 0;
    let bestRating = 0;
    const brandingMethodsSet = new Set<string>();

    const productVariants: ProductVariant[] = [];

    for (const v of variants) {
      const attrs = parseAttributes(v.attributes);
      const color = extractColor(v.name, attrs);
      const size = extractSize(attrs);
      const rawPrice = parseFloat(v.price || "0");
      const price = applyMarkup(rawPrice);
      const oldPrice = parseFloat(v.old_price || "0");
      const roundedOldPrice = oldPrice > 0 ? applyMarkup(oldPrice) : 0;
      const images = (v.images || "").split(";").filter(Boolean);
      const stock = parseInt(v.total_stock || "0", 10);
      const rating = parseFloat(v.rating || "0");

      if (color) colorsSet.add(color);
      if (size) sizesSet.add(size);
      if (images.length > 0 && allImages.length < 10) {
        for (const img of images) {
          if (!allImages.includes(img)) allImages.push(img);
          if (allImages.length >= 10) break;
        }
      }
      totalStock += stock;
      if (price < minPrice) {
        minPrice = price;
        minOldPrice = roundedOldPrice;
      }
      if (rating > bestRating) bestRating = rating;

      const attrMethods = extractBrandingFromAttrs(v.attributes);
      attrMethods.forEach(m => brandingMethodsSet.add(m));

      productVariants.push({
        id: v.id,
        name: v.name || v.full_name,
        color,
        size,
        price,
        oldPrice: roundedOldPrice,
        article: v.article || "",
        images,
        stock,
        attributes: attrs,
      });
    }

    const categories = (first.full_categories || first.categories || "")
      .split(";")
      .map(c => parseInt(c, 10))
      .filter(c => !isNaN(c));

    const primaryCategory = categories[categories.length - 1] || 0;

    const isSale = minOldPrice > 0 && minOldPrice > minPrice;

    products.push({
      id: first.id,
      name: baseName,
      fullName: first.full_name || first.name,
      brand: (first.brand || "").trim(),
      price: minPrice === Infinity ? 0 : minPrice,
      oldPrice: minOldPrice,
      categories,
      primaryCategory,
      images: allImages,
      description: first.description || "",
      rating: bestRating,
      colors: Array.from(colorsSet),
      sizes: Array.from(sizesSet),
      variants: productVariants,
      stock: totalStock,
      article: first.article || "",
      brandingMethods: Array.from(brandingMethodsSet),
      isNew: false,
      isHit: bestRating >= 4,
      isSale,
    });
  }

  products.sort((a, b) => b.stock - a.stock);

  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(products));

  log(`Synced ${products.length} grouped products, saved to ${DATA_FILE}`, "sync");
  return products.length;
}

let cachedProducts: Product[] | null = null;
let cacheTime = 0;

export function getProducts(): Product[] {
  const now = Date.now();
  if (cachedProducts && now - cacheTime < 60000) return cachedProducts;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      cachedProducts = JSON.parse(data);
      cacheTime = now;
      return cachedProducts!;
    }
  } catch (e) {
    log(`Error reading products: ${e}`, "sync");
  }
  return [];
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id || p.variants.some(v => v.id === id));
}
