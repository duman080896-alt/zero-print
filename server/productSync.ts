import { parse } from "csv-parse/sync";
import { log } from "./index";
import { db } from "./db";
import { productCache } from "../shared/schema";
import { eq } from "drizzle-orm";

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

const CACHE_KEY = "products_v1";

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

function roundPrice(price: number): number {
  return Math.round(price);
}

export async function syncProducts(): Promise<number> {
  if (!API_KEY) {
    log("OASIS_API_KEY not set, skipping sync", "sync");
    return 0;
  }
  log(`Starting product sync from Oasis API... (key: ${API_KEY.substring(0, 4)}...${API_KEY.substring(API_KEY.length - 4)})`, "sync");

  const url = `https://api.oasiscatalog.com/v4/products?key=${API_KEY}&currency=kzt&format=csv&no_vat=1&moscow=1&category=${CATEGORY_IDS}`;
  log(`Fetching: ${url.replace(API_KEY, "***")}`, "sync");

  const response = await fetch(url);
  log(`API response status: ${response.status} ${response.statusText}`, "sync");
  log(`API response headers: content-type=${response.headers.get("content-type")}, content-length=${response.headers.get("content-length")}`, "sync");

  if (!response.ok) {
    const body = await response.text();
    log(`API error body: ${body.substring(0, 500)}`, "sync");
    throw new Error(`API request failed: ${response.status} - ${body.substring(0, 200)}`);
  }

  const csvText = await response.text();
  log(`Downloaded response: ${csvText.length} chars (${(csvText.length / 1024 / 1024).toFixed(2)}MB)`, "sync");
  log(`First 300 chars: ${csvText.substring(0, 300)}`, "sync");

  if (csvText.length < 100) {
    log(`Response too short, likely an error. Full body: ${csvText}`, "sync");
    throw new Error(`API returned insufficient data (${csvText.length} chars)`);
  }

  const records: RawProduct[] = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  log(`Parsed ${records.length} raw products`, "sync");

  if (records.length === 0) {
    log("No records parsed from CSV, aborting sync", "sync");
    throw new Error("CSV parsed but produced 0 records");
  }

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

  log(`Saving ${products.length} products to PostgreSQL...`, "sync");
  await db.delete(productCache).where(eq(productCache.id, CACHE_KEY));
  await db.insert(productCache).values({
    id: CACHE_KEY,
    data: products as any,
    syncedAt: new Date(),
  });
  log(`Saved ${products.length} products to PostgreSQL successfully`, "sync");

  cachedProducts = products;
  cacheTime = Date.now();

  return products.length;
}

let cachedProducts: Product[] | null = null;
let cacheTime = 0;
let loadPromise: Promise<Product[]> | null = null;

async function loadFromDb(): Promise<Product[]> {
  try {
    const rows = await db.select().from(productCache).where(eq(productCache.id, CACHE_KEY));
    if (rows.length > 0 && rows[0].data) {
      cachedProducts = rows[0].data as Product[];
      cacheTime = Date.now();
      log(`Loaded ${cachedProducts.length} products from PostgreSQL`, "sync");
      return cachedProducts;
    }
  } catch (e) {
    log(`Error reading products from DB: ${e}`, "sync");
  }
  return [];
}

export async function ensureProductsLoaded(): Promise<void> {
  if (cachedProducts && cachedProducts.length > 0) return;
  if (!loadPromise) {
    loadPromise = loadFromDb().finally(() => { loadPromise = null; });
  }
  await loadPromise;
}

export function getProducts(): Product[] {
  if (!cachedProducts || cachedProducts.length === 0) {
    loadFromDb();
  }
  return cachedProducts || [];
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id || p.variants.some(v => v.id === id));
}
