import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getMetaForPath } from "@shared/seoMeta";
import { isKnownPath, REDIRECTS, PRODUCT_PATH } from "./seo-routes";
import { ensureProductsLoaded, getProducts, getProductById } from "./productSync";
const faqSchemas: Record<string,string> = {"/uslugi/vyshivka":"<script type=\"application/ld+json\">{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"Сколько стоит вышивка логотипа на одежде?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Цена зависит от тиража, сложности логотипа и количества цветов. Ориентировочно: от 1 500 ₸ за изделие при заказе 10–49 шт, от 500 ₸ при тираже 50–499 шт и от 350 ₸ при заказе от 500 шт. Точную стоимость рассчитываем по вашему макету за 30 минут.\"}},{\"@type\":\"Question\",\"name\":\"От какого количества можно заказать вышивку?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"От 10 штук. Оптовый тираж — от 50 штук, большие партии — со скидкой до 30%.\"}},{\"@type\":\"Question\",\"name\":\"Сколько времени занимает изготовление?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Стандартный срок — 5–7 рабочих дней после утверждения макета. Срочный заказ — от 3 рабочих дней.\"}},{\"@type\":\"Question\",\"name\":\"Можно ли сделать вышивку на спецодежде?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Да, это одно из ключевых направлений. Вышивка выдерживает более 100 стирок и сложные условия, поэтому идеальна для спецодежды: жилетов, курток, комбинезонов.\"}},{\"@type\":\"Question\",\"name\":\"Вы делаете вышивку на кепках, футболках и поло?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Да. Вышиваем на кепках, футболках, поло, худи, свитшотах, куртках, рубашках, жилетах и сумках. Можем работать с вашими изделиями или пошить одежду с нуля.\"}},{\"@type\":\"Question\",\"name\":\"Чем вышивка лучше печати?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Вышивка держится весь срок службы изделия — не выцветает и не смывается, тогда как печать выдерживает 20–60 стирок. Выглядит дороже и статуснее.\"}},{\"@type\":\"Question\",\"name\":\"Что такое 3D-вышивка?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Это объёмная вышивка, при которой логотип выступает над тканью. Эффектнее всего смотрится на кепках и поло. Стоит от 550 ₸ за изделие.\"}},{\"@type\":\"Question\",\"name\":\"Сколько стоит оцифровка логотипа?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"При заказе от 50 изделий — бесплатно. При меньшем тираже — от 5 000 ₸. Готовый файл остаётся у вас навсегда.\"}},{\"@type\":\"Question\",\"name\":\"Можно заказать пробный образец перед тиражом?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Да. При заказе от 200 штук делаем одно пробное изделие бесплатно.\"}},{\"@type\":\"Question\",\"name\":\"Вы работаете с юрлицами? Есть договор и НДС?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Да, работаем официально с юрлицами и ИП. Договор, счёт, акт и счёт-фактура с НДС.\"}},{\"@type\":\"Question\",\"name\":\"Доставляете в другие города Казахстана?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"Да. Производство в Алматы, доставляем по всему Казахстану — Астана, Шымкент, Караганда, Актобе и другие города.\"}}]}</script>"};


function isBot(userAgent: string): boolean {
  return /googlebot|yandexbot|yandex|bingbot|duckduckbot|baiduspider|twitterbot|linkedinbot|whatsapp|telegrambot|vkshare|facebot/i.test(userAgent);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }

  app.use((req, res, next) => {
    const acceptsWebP = req.headers.accept?.includes("image/webp");
    if (!acceptsWebP) return next();
    const ext = path.extname(req.path).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) return next();
    const webpPath = path.join(distPath, req.path.replace(/\.(png|jpg|jpeg)$/i, ".webp"));
    if (fs.existsSync(webpPath)) {
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000");
      return res.sendFile(webpPath);
    }
    next();
  });

  app.use(express.static(distPath, {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }));

  const htmlPath = path.resolve(distPath, "index.html");
  const htmlTemplate = fs.readFileSync(htmlPath, "utf-8");

  // Несуществующий товар — 404. Пока каталог не загружен (первые секунды после
  // перезапуска или база недоступна), считаем товар существующим: иначе Google
  // получил бы 404 на настоящие карточки и начал выкидывать их из индекса.
  async function productExists(pathname: string): Promise<boolean> {
    const m = pathname.match(PRODUCT_PATH);
    if (!m) return true;
    try {
      await ensureProductsLoaded();
    } catch {
      return true;
    }
    if (getProducts().length === 0) return true;
    return Boolean(getProductById(m[1]));
  }

  app.use("/{*path}", async (req, res) => {
    const u = new URL(req.originalUrl || "/", "http://local");
    const raw = u.pathname;
    const pathname = raw.length > 1 ? raw.replace(/\/+$/, "") : raw;
    const lower = pathname.toLowerCase();
    const target = REDIRECTS[pathname] || REDIRECTS[lower];
    if (target) return res.redirect(301, target);
    // /Catalog → /catalog. Адреса товаров не трогаем: ID чувствительны к регистру (артикулы вида 655401S).
    if (pathname !== lower && !PRODUCT_PATH.test(pathname) && isKnownPath(lower)) return res.redirect(301, lower + (u.search || ""));
    if (pathname !== raw && isKnownPath(pathname)) return res.redirect(301, pathname + (u.search || ""));
    const known = isKnownPath(pathname) && (await productExists(pathname));
    const meta = getMetaForPath(pathname, u.searchParams.toString());
    const noindex = !known || /^\/(kp|cart|account|manager|landing)/.test(pathname);
    let result = htmlTemplate
      .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
      .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${meta.description}"`)
      .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="${meta.canonical}"`)
      .replace(/<meta property="og:title" content=".*?"/, `<meta property="og:title" content="${meta.title}"`)
      .replace(/<meta property="og:description" content=".*?"/, `<meta property="og:description" content="${meta.description}"`)
      .replace(/<meta property="og:url" content=".*?"/, `<meta property="og:url" content="${meta.canonical}"`);
    if (noindex) result = result.replace("</head>", '<meta name="robots" content="noindex,nofollow" />\n</head>');
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    const __faq = faqSchemas[pathname]; if (__faq) result = result.replace("</head>", __faq + "</head>");
    if (!known) result = result.replace(/<link rel="canonical"[^>]*>/, "");
    res.status(known ? 200 : 404).send(result);
  });
}
