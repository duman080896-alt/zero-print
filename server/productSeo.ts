// Серверная разметка карточки товара: Product + Offer и BreadcrumbList в сыром HTML,
// чтобы поисковик видел цену, наличие и категорию без выполнения JS.
// Значения берутся так же, как их показывает ProductPage: вариант по умолчанию — первый.

import type { Product } from "./productSync";
import { SITE_URL, BUSINESS_ID } from "@shared/site";
import { findCategoryById, findParentCategory } from "../client/src/data/catalogCategories";

function plainText(html: string, max: number): string {
  const text = html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return text.length <= max ? text : text.slice(0, max);
}

function absoluteImage(url: string): string {
  if (url.startsWith("http")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function buildProductJsonLd(p: Product): string {
  const url = `${SITE_URL}/catalog/product/${p.id}`;
  const v = p.variants[0];
  const price = v?.price || p.price;
  const stock = v?.stock ?? p.stock;
  const article = v?.article || p.article;
  const images = (v?.images.length ? v.images : p.images).slice(0, 8).map(absoluteImage);

  const category = findCategoryById(p.primaryCategory);
  const parent = category ? findParentCategory(category.id) : undefined;

  const product: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name: p.name,
  };
  const description = plainText(p.description || "", 5000);
  if (description) product.description = description;
  if (images.length) product.image = images;
  if (article) {
    product.sku = article;
    product.mpn = article;
  }
  if (p.brand) product.brand = { "@type": "Brand", name: p.brand };
  if (v?.color) product.color = v.color;
  if (category) product.category = category.name;
  if (price > 0) {
    product.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "KZT",
      price: String(price),
      availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": BUSINESS_ID },
    };
  }

  // Те же крошки, что видны на странице: Главная → Каталог → [раздел] → [категория] → товар.
  const crumbs: { name: string; item?: string }[] = [
    { name: "Главная", item: SITE_URL },
    { name: "Каталог", item: `${SITE_URL}/catalog` },
  ];
  if (parent) crumbs.push({ name: parent.name, item: `${SITE_URL}/catalog?category=${parent.slug}` });
  if (category) crumbs.push({ name: category.name, item: `${SITE_URL}/catalog?category=${category.slug}` });
  crumbs.push({ name: p.name });
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.item ? { item: c.item } : {}),
    })),
  };

  const graph = { "@context": "https://schema.org", "@graph": [product, breadcrumbs] };
  // `<` экранируем, иначе «</script>» в описании товара оборвёт тег.
  return `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>`;
}

export function productImage(p: Product): string | undefined {
  const img = p.variants[0]?.images[0] || p.images[0];
  return img ? absoluteImage(img) : undefined;
}
