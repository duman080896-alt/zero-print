// Мета-теги страниц. Используются и сервером (server/static.ts подставляет их в HTML),
// и клиентом (client/src/hooks/useSEO.ts при переходах внутри SPA), поэтому
// после загрузки JS title, description и canonical остаются теми же, что отдал сервер.

import { SITE_URL, MIN_RUN_LABEL } from "./site";
import { findCategoryBySlug } from "../client/src/data/catalogCategories";

export type PageMeta = { title: string; description: string; canonical: string; matched: boolean };

type Meta = { title: string; description: string };

const CATEGORY_META: Record<string, Meta> = {
  futbolki: { title: "Футболки с логотипом на заказ в Алматы | ZERO PRINT", description: "Брендированные футболки оптом. DTF печать, вышивка. Тираж от 10 шт. Доставка по Казахстану." },
  ruchki: { title: "Брендированные ручки оптом в Алматы | ZERO PRINT", description: "Ручки с логотипом компании. Корпоративные сувениры оптом. Доставка по Казахстану." },
  termosy: { title: "Термосы с логотипом на заказ | ZERO PRINT Алматы", description: "Брендированные термосы и кружки оптом. Нанесение логотипа, гравировка. Доставка по КЗ." },
  zonty: { title: "Зонты с логотипом оптом в Алматы | ZERO PRINT", description: "Брендированные зонты для корпоративных подарков. Печать логотипа. Доставка по Казахстану." },
  sumki: { title: "Сумки с логотипом на заказ | ZERO PRINT Алматы", description: "Брендированные сумки, шоперы, рюкзаки с вашим логотипом. Оптом. Доставка по КЗ." },
  elektronika: { title: "Брендированная электроника оптом | ZERO PRINT", description: "Power bank, наушники, USB-хабы с логотипом компании. Корпоративные подарки. Казахстан." },
  odezhda: { title: "Корпоративная одежда с логотипом | ZERO PRINT Алматы", description: "Худи, поло, жилеты, куртки с вышивкой или печатью логотипа. Пошив на заказ. Казахстан." },
  ofisnye: { title: "Офисные сувениры с логотипом оптом | ZERO PRINT", description: "Блокноты, папки, ежедневники с логотипом. Корпоративные сувениры для офиса. Алматы." },
  aksessuary: { title: "Брендированные аксессуары на заказ | ZERO PRINT", description: "Кепки, шапки, браслеты с логотипом. Корпоративный мерч оптом. Доставка по Казахстану." },
  "delovye-podarki": { title: "Деловые подарки с логотипом оптом | ZERO PRINT Алматы", description: "Корпоративные подарки партнёрам и сотрудникам. Брендирование. Доставка по Казахстану." },
  upakovka: { title: "Брендированная упаковка на заказ | ZERO PRINT Алматы", description: "Фирменные пакеты, коробки, упаковка с логотипом. Полиграфия оптом. Казахстан." },
};

const PAGE_META: Record<string, Meta> = {
  "/": { title: "Корпоративный мерч и печать на одежде в Алматы | ZERO PRINT", description: "Корпоративный мерч на заказ по всему Казахстану. DTF печать, вышивка, пошив одежды. Доставка в Алматы, Астану, Шымкент. ☎ +7 771 624 64 61" },
  "/uslugi/vyshivka": { title: "Вышивка логотипа на одежде в Алматы — от 10 шт | ZERO PRINT", description: "Машинная и 3D вышивка логотипа на поло, худи, кепках, спецодежде. От 10 штук, срок от 3 дней. Не выцветает, выдерживает 100+ стирок. Доставка по Казахстану. Цена от 350 ₸." },
  "/uslugi/pechat": { title: "DTF печать на одежде в Алматы | ZERO PRINT", description: "DTF и термопечать на футболках, худи, кепках. Полноцветная печать от 10 шт. Алматы." },
  "/uslugi/poshiv": { title: "Пошив корпоративной одежды на заказ в Алматы | ZERO PRINT", description: "Пошив форменной и корпоративной одежды. Собственное производство. Алматы." },
  "/uslugi/brendirovanie": { title: "Брендирование одежды и сувениров в Алматы | ZERO PRINT", description: "Нанесение логотипа на одежду, ручки, термосы, сумки. Полный цикл брендирования." },
  "/poligrafiya": { title: "Полиграфия на заказ в Алматы | ZERO PRINT", description: "Визитки, листовки, баннеры, брошюры. Полиграфические услуги в Алматы." },
  "/portfolio": { title: "Портфолио работ ZERO PRINT — примеры мерча и печати", description: "Примеры нашего корпоративного мерча: футболки, кепки, термосы с логотипами компаний Казахстана." },
  "/about": { title: "О компании ZERO PRINT — корпоративный мерч Алматы", description: "ZERO PRINT — производство корпоративного мерча и брендированной продукции в Алматы." },
  "/kontakty": { title: "Контакты ZERO PRINT — Алматы, телефон, адрес, WhatsApp", description: "Адрес: ул. Радостовца 152/6, офис 104, Алматы. Телефон: +7 771 624 64 61." },
  "/uslugi/horeca": { title: "Форма и мерч для ресторанов и HoReCa в Алматы | ZERO PRINT", description: "Фартуки, поло, кепки с логотипом для ресторанов, кафе, отелей. Вышивка и печать. Алматы." },
  "/uslugi/stroitelstvo": { title: "Спецодежда с логотипом для строителей в Алматы | ZERO PRINT", description: "Жилеты, куртки, комбинезоны с вышивкой логотипа. Спецодежда для стройкомпаний. Казахстан." },
  "/uslugi/shkoly": { title: "Школьная форма с логотипом в Казахстане | ZERO PRINT", description: "Пошив школьной формы с эмблемой школы. Вышивка, печать. Доставка по Казахстану." },
  "/uslugi/it-ofis": { title: "Корпоративный мерч для IT и офиса в Алматы | ZERO PRINT", description: "Худи, футболки, мерч для IT-команд и офисов. DTF печать, вышивка. От 10 шт. Алматы." },
  "/uslugi/proizvodstvo": { title: "Спецодежда для производства с логотипом в Алматы | ZERO PRINT", description: "Брендированная спецодежда для заводов и производств. Вышивка. Доставка по Казахстану." },
};

const CATALOG_META: Meta = { title: "Каталог корпоративного мерча — цены и фото | ZERO PRINT", description: "Футболки, термосы, ручки, зонты, сумки с логотипом. Брендированная продукция оптом в Алматы. Тираж от 10 шт." };
const PRODUCT_META: Meta = { title: "Корпоративный мерч с логотипом | ZERO PRINT Алматы", description: "Брендированная продукция на заказ в Алматы. Нанесение логотипа, доставка по Казахстану." };
const DEFAULT_META: Meta = { title: "Корпоративный мерч и печать на одежде в Алматы | ZERO PRINT", description: "Печать на футболках, худи, кепках в Алматы. DTF, термопечать, вышивка. От 10 шт. Доставка по Казахстану." };

// /poshiv — дубль /uslugi/poshiv, canonical ведёт на основную страницу.
const CANONICAL_ALIASES: Record<string, string> = { "/poshiv": "/uslugi/poshiv" };

// Для подкатегорий без ручной меты (поло, худи, термосы…) — мета из названия категории.
// Раньше они получали canonical на /catalog и для Google были дублями общего каталога.
function categoryMeta(slug: string): Meta | undefined {
  const cat = slug ? findCategoryBySlug(slug) : undefined;
  if (!cat) return undefined;
  const h1 = cat.h1 || `${cat.name} с логотипом`;
  return {
    title: `${h1} на заказ в Алматы | ZERO PRINT`,
    description: `${h1} оптом: нанесение логотипа, тираж ${MIN_RUN_LABEL}. Доставка по Казахстану.`,
  };
}

export function getMetaForPath(urlPath: string, query: string): PageMeta {
  // /catalog/ и /catalog — одна страница, canonical без конечного слэша.
  const path = urlPath.replace(/\/+$/, "") || "/";

  if (path === "/catalog") {
    const params = new URLSearchParams(query);
    const category = params.get("category") || "";
    // Страницы 2, 3… — свой canonical и номер в title: иначе Google считает их дублями
    // первой и не доходит до товаров на них. Фильтры и сортировка в canonical не входят.
    const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    const pageSuffix = page > 1 ? ` — страница ${page}` : "";
    const withPage = (base: Meta, url: string): PageMeta => ({
      title: page > 1 ? base.title.replace(" | ", `${pageSuffix} | `) : base.title,
      description: base.description,
      canonical: page > 1 ? `${url}${url.includes("?") ? "&" : "?"}page=${page}` : url,
      matched: true,
    });
    const meta = CATEGORY_META[category] ?? categoryMeta(category);
    if (meta) return withPage(meta, `${SITE_URL}/catalog?category=${encodeURIComponent(category)}`);
    return withPage(CATALOG_META, `${SITE_URL}/catalog`);
  }

  const aliased = CANONICAL_ALIASES[path] ?? path;
  const meta = PAGE_META[aliased];
  if (meta) return { ...meta, canonical: aliased === "/" ? SITE_URL : `${SITE_URL}${aliased}`, matched: true };

  // Карточки товаров не в карте: мету строит getProductMeta по данным товара
  // (сервер — в server/static.ts, клиент — в ProductPage).
  if (path.startsWith("/catalog/product/")) return { ...PRODUCT_META, canonical: `${SITE_URL}${path}`, matched: false };

  return { ...DEFAULT_META, canonical: `${SITE_URL}${path}`, matched: false };
}

export type ProductMetaInput = { name: string; brand?: string; price?: number; brandingMethods?: string[] };

function clip(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1).replace(/[\s,.;:–—-]+\S*$/, "") + "…";
}

// Уникальные title и description карточки товара. Раньше у всех 2 000 карточек
// из sitemap были одни и те же, и Google склеивал их как дубли.
export function getProductMeta(p: ProductMetaInput | undefined): Meta {
  if (!p?.name) return PRODUCT_META;
  const name = p.name.replace(/\s+/g, " ").trim();
  const title = `${clip(name, 48)} с логотипом в Алматы | ZERO PRINT`;
  const parts = [`${name}${p.brand ? ` ${p.brand}` : ""} с нанесением логотипа на заказ.`];
  if (p.price && p.price > 0) parts.push(`Цена от ${p.price.toLocaleString("ru-RU")} ₸.`);
  parts.push(`Тираж ${MIN_RUN_LABEL}, доставка по Казахстану.`);
  // Способы нанесения — в конце: если описание длинное, обрезается именно этот хвост.
  const methods = (p.brandingMethods || []).slice(0, 2);
  if (methods.length) parts.push(`Нанесение: ${methods.join(", ")}.`);
  return { title, description: clip(parts.join(" "), 165) };
}
