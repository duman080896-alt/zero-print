import express, { type Express } from "express";
import fs from "fs";
import path from "path";

function isBot(userAgent: string): boolean {
  return /googlebot|yandexbot|yandex|bingbot|duckduckbot|baiduspider|twitterbot|linkedinbot|whatsapp|telegrambot|vkshare|facebot/i.test(userAgent);
}

function getMetaForPath(urlPath: string, query: string): { title: string; description: string; canonical: string } {
  const base = "https://zeroprint.kz";
  const fullPath = query ? `${urlPath}?${query}` : urlPath;
  if (urlPath === "/" || urlPath === "") return { title: "Корпоративный мерч и печать на одежде в Алматы | ZERO PRINT", description: "Корпоративный мерч на заказ по всему Казахстану. DTF печать, вышивка, пошив одежды. Доставка в Алматы, Астану, Шымкент. ☎ +7 771 624 64 61", canonical: base };
  if (urlPath === "/catalog") {
    const cats: Record<string, { title: string; description: string }> = {
      futbolki: { title: "Футболки с логотипом на заказ в Алматы | ZERO PRINT", description: "Брендированные футболки оптом. DTF печать, вышивка. Тираж от 1 шт. Доставка по Казахстану." },
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
    const category = new URLSearchParams(query).get("category") || "";
    const meta = cats[category];
    if (meta) return { ...meta, canonical: `${base}${fullPath}` };
    return { title: "Каталог корпоративного мерча — цены и фото | ZERO PRINT", description: "Футболки, термосы, ручки, зонты, сумки с логотипом. Брендированная продукция оптом в Алматы. Тираж от 1 шт.", canonical: `${base}/catalog` };
  }
  if (urlPath.startsWith("/uslugi/vyshivka")) return { title: "Вышивка логотипа на одежде в Алматы | ZERO PRINT", description: "Машинная вышивка логотипа на футболках, кепках, толстовках. Тираж от 1 шт. Алматы.", canonical: `${base}/uslugi/vyshivka` };
  if (urlPath.startsWith("/uslugi/pechat")) return { title: "DTF печать на одежде в Алматы | ZERO PRINT", description: "DTF и термопечать на футболках, худи, кепках. Полноцветная печать от 1 шт. Алматы.", canonical: `${base}/uslugi/pechat` };
  if (urlPath.startsWith("/uslugi/poshiv") || urlPath === "/poshiv") return { title: "Пошив корпоративной одежды на заказ в Алматы | ZERO PRINT", description: "Пошив форменной и корпоративной одежды. Собственное производство. Алматы.", canonical: `${base}/uslugi/poshiv` };
  if (urlPath.startsWith("/uslugi/brendirovanie")) return { title: "Брендирование одежды и сувениров в Алматы | ZERO PRINT", description: "Нанесение логотипа на одежду, ручки, термосы, сумки. Полный цикл брендирования.", canonical: `${base}/uslugi/brendirovanie` };
  if (urlPath === "/poligrafiya") return { title: "Полиграфия на заказ в Алматы | ZERO PRINT", description: "Визитки, листовки, баннеры, брошюры. Полиграфические услуги в Алматы.", canonical: `${base}/poligrafiya` };
  if (urlPath === "/portfolio") return { title: "Портфолио работ ZERO PRINT — примеры мерча и печати", description: "Примеры нашего корпоративного мерча: футболки, кепки, термосы с логотипами компаний Казахстана.", canonical: `${base}/portfolio` };
  if (urlPath === "/about") return { title: "О компании ZERO PRINT — корпоративный мерч Алматы", description: "ZERO PRINT — производство корпоративного мерча и брендированной продукции в Алматы.", canonical: `${base}/about` };
  if (urlPath === "/kontakty") return { title: "Контакты ZERO PRINT — Алматы, телефон, адрес, WhatsApp", description: "Адрес: ул. Радостовца 152/6, офис 104, Алматы. Телефон: +7 771 624 64 61.", canonical: `${base}/kontakty` };
  if (urlPath.startsWith("/catalog/product/")) return { title: "Корпоративный мерч с логотипом | ZERO PRINT Алматы", description: "Брендированная продукция на заказ в Алматы. Нанесение логотипа, доставка по Казахстану.", canonical: `${base}${urlPath}` };
  return { title: "Корпоративный мерч и печать на одежде в Алматы | ZERO PRINT", description: "Печать на футболках, худи, кепках в Алматы. DTF, термопечать, вышивка. От 1 шт. Доставка по Казахстану.", canonical: `${base}${urlPath}` };
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }

  // ✅ WebP: автоматически отдаём WebP когда браузер поддерживает
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

  app.get("/uslugi/vyshivka", (req, res) => { res.sendFile(path.resolve(distPath, "uslugi/vyshivka/index.html")); });
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

  app.use("/{*path}", (req, res) => {
    const userAgent = req.headers["user-agent"] || "";
    const htmlPath = path.resolve(distPath, "index.html");
    if (isBot(userAgent)) {
      const html = fs.readFileSync(htmlPath, "utf-8");
      const meta = getMetaForPath(req.path, req.query ? new URLSearchParams(req.query as any).toString() : "");
      const result = html
        .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
        .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${meta.description}"`)
        .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="${meta.canonical}"`)
        .replace(/<meta property="og:title" content=".*?"/, `<meta property="og:title" content="${meta.title}"`)
        .replace(/<meta property="og:description" content=".*?"/, `<meta property="og:description" content="${meta.description}"`)
        .replace(/<meta property="og:url" content=".*?"/, `<meta property="og:url" content="${meta.canonical}"`);
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(result);
    }
    res.sendFile(htmlPath);
  });
}
