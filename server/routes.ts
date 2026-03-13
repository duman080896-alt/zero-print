import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import cron from "node-cron";
import { syncProducts, getProducts, getProductById, type Product } from "./productSync";
import { log } from "./index";
import { db } from "./db";
import { clients, orders, wishlist, managers, proposals, subscribers } from "../shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "zeroprint_jwt_2025";

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "zeroprint.kz@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

function sendWelcomeEmail(toEmail: string, clientName: string) {
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#111;padding:28px;text-align:center;">
    <div style="color:white;font-size:26px;font-weight:900;">ZERO PRINT</div>
    <div style="color:#9ca3af;font-size:13px;margin-top:4px;">Брендирование • Полиграфия • Пошив</div>
  </div>
  <div style="padding:36px;background:white;">
    <h2 style="font-size:22px;margin-bottom:12px;">Привет, ${clientName}! 👋</h2>
    <p style="color:#374151;line-height:1.7;margin-bottom:20px;">Вы успешно зарегистрировались на сайте ZERO PRINT. Теперь у вас есть личный кабинет где вы можете:</p>
    <ul style="color:#374151;line-height:2;padding-left:20px;margin-bottom:24px;">
      <li>📋 Просматривать историю заказов</li>
      <li>❤️ Сохранять товары в избранное</li>
      <li>📄 Получать коммерческие предложения</li>
    </ul>
    <a href="https://zeroprint.kz/account" style="display:inline-block;background:#E8500A;color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">Войти в личный кабинет →</a>
  </div>
  <div style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#9ca3af;line-height:1.8;">
    <strong style="color:#111;">ZERO PRINT</strong><br>
    г. Алматы, ул. Радостовца 152/6, офис 104<br>
    WhatsApp: +7 771 624 64 61 • Instagram: @zeroprint.kz
  </div>
</div>`;

  mailTransporter.sendMail({
    from: '"ZERO PRINT" <zeroprint.kz@gmail.com>',
    to: toEmail,
    subject: "Добро пожаловать в ZERO PRINT! 🎉",
    html,
  }).then(() => {
    log(`Welcome email sent to ${toEmail}`, "email");
  }).catch((err: any) => {
    log(`Failed to send welcome email to ${toEmail}: ${err.message}`, "email");
  });
}

function generateId(): string {
  return crypto.randomUUID();
}

function escHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  const s = String(url).trim();
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//')) return s;
  return '';
}

function generateKpHtml(p: any): string {
  const totalPrice = (p.items || []).reduce((s: number, i: any) => s + i.qty * i.price, 0);
  const validUntil = new Date(p.createdAt || new Date());
  validUntil.setDate(validUntil.getDate() + (p.validDays || 30));
  const waText = encodeURIComponent(`Здравствуйте! Ознакомился с КП «${escHtml(p.title)}» и хочу оформить заказ.`);

  const css = `
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,Helvetica,sans-serif;color:#111}
    .page{width:210mm;min-height:297mm;padding:15mm 15mm 20mm 15mm;page-break-after:always;position:relative}
    .page:last-child{page-break-after:avoid}
    .logo-zp{font-size:18px;font-weight:900;letter-spacing:-0.5px}
    .logo-zp span{color:#E8500A}
    .top-bar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8mm;padding-bottom:4mm;border-bottom:2px solid #111}
    .product-name-title{font-size:16px;font-weight:700;color:#111}
    .product-layout{display:flex;gap:12mm;margin-top:6mm}
    .product-images{width:90mm;flex-shrink:0}
    .main-image{width:90mm;height:90mm;object-fit:contain;border:1px solid #e5e7eb;border-radius:4px;display:block}
    .product-details{flex:1}
    .price-table{width:100%;border-collapse:collapse;margin-bottom:6mm;font-size:13px}
    .price-table th{background:#f8fafc;padding:6px 8px;border:1px solid #e5e7eb;font-weight:600;color:#6b7280;font-size:11px}
    .price-table td{padding:8px;border:1px solid #e5e7eb;font-weight:700;font-size:14px}
    .price-table .total-cell{font-size:16px;font-weight:900;color:#111}
    .chars{margin-bottom:5mm}
    .char-row{display:flex;align-items:flex-start;gap:6px;padding:3px 0;font-size:12px;border-bottom:1px solid #f1f5f9}
    .char-dot{width:8px;height:8px;border-radius:50%;background:#2563eb;flex-shrink:0;margin-top:3px}
    .char-label{color:#6b7280;min-width:40mm}
    .char-val{font-weight:600}
    .description{font-size:11px;color:#374151;line-height:1.6;margin-top:4mm;padding-top:4mm;border-top:1px solid #f1f5f9}
    .cover-page{display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:270mm;text-align:center}
    .cover-logo-zp{position:absolute;top:15mm;right:15mm;font-size:20px;font-weight:900}
    .cover-logo-zp span{color:#E8500A}
    .cover-client-logo{max-height:30mm;max-width:80mm;object-fit:contain;margin-bottom:15mm}
    .cover-title{font-size:36px;font-weight:900;margin-bottom:6mm;line-height:1.2}
    .cover-subtitle{font-size:14px;color:#6b7280;margin-bottom:20mm}
    .cover-divider{width:40mm;height:3px;background:#E8500A;margin:0 auto 20mm}
    .cover-info{font-size:13px;color:#374151;line-height:2}
    .summary-table{width:100%;border-collapse:collapse;margin:6mm 0;font-size:12px}
    .summary-table th{background:#111;color:white;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
    .summary-table td{padding:10px;border-bottom:1px solid #f1f5f9}
    .summary-table tr:nth-child(even) td{background:#fafafa}
    .summary-total{background:#111!important;color:white;font-weight:900;font-size:16px}
    .cta-block{background:#111;color:white;border-radius:8px;padding:8mm;text-align:center;margin-top:8mm}
    .cta-title{font-size:20px;font-weight:900;margin-bottom:3mm}
    .cta-sub{font-size:12px;color:#9ca3af;margin-bottom:5mm}
    .wa-btn{display:inline-block;background:#25D366;color:white;padding:10px 24px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;margin:3px}
    .phone-btn{display:inline-block;border:2px solid #444;color:white;padding:10px 24px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;margin:3px}
    .page-footer{position:absolute;bottom:8mm;left:15mm;right:15mm;display:flex;justify-content:space-between;font-size:9px;color:#9ca3af;border-top:1px solid #f1f5f9;padding-top:3mm}
    @media screen{.page{margin:0 auto 20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);background:white}}
  `;

  const coverPage = `
    <div class="page" style="position:relative;">
      <div class="cover-logo-zp">ZERO <span>PRINT</span></div>
      <div class="cover-page">
        ${sanitizeUrl(p.clientLogoUrl) ? `<img src="${sanitizeUrl(p.clientLogoUrl)}" class="cover-client-logo" onerror="this.style.display='none'">` : ''}
        <div class="cover-title">${escHtml(p.title) || 'Коммерческое предложение'}</div>
        <div class="cover-divider"></div>
        ${p.comment ? `<div class="cover-subtitle">${escHtml(p.comment)}</div>` : ''}
        <div class="cover-info">
          ${escHtml(p.managerPhone) || '+7 771 624 64 61'}&nbsp;&nbsp;${escHtml(p.managerName) || 'Менеджер'}<br>
          ${new Date(p.createdAt || new Date()).toLocaleDateString('ru-RU')}
          ${p.clientName ? `<br><br><strong>${escHtml(p.clientName)}</strong>` : ''}
        </div>
      </div>
      <div class="page-footer">
        <span>ZERO PRINT • г. Алматы, ул. Радостовца 152/6, офис 104</span>
        <span>Действует до ${validUntil.toLocaleDateString('ru-RU')}</span>
      </div>
    </div>`;

  const productPages = (p.items || []).map((item: any, idx: number) => {
    const itemTotal = item.qty * item.price;
    const chars: { label: string; val: string }[] = [];
    if (item.color) chars.push({ label: 'Цвет товара', val: escHtml(item.color) });
    if (item.material) chars.push({ label: 'Материал', val: escHtml(item.material) });
    if (item.weight) chars.push({ label: 'Плотность', val: escHtml(item.weight) });
    if (item.size) chars.push({ label: 'Размер', val: escHtml(item.size) });
    if (item.brand) chars.push({ label: 'Бренд', val: escHtml(item.brand) });

    const charRows = chars.slice(0, 6).map(c => `
      <div class="char-row">
        <div class="char-dot"></div>
        <div class="char-label">${c.label}:</div>
        <div class="char-val">${c.val}</div>
      </div>`).join('');

    return `
      <div class="page" style="position:relative;">
        <div class="top-bar">
          <div class="product-name-title">${escHtml(item.name)}</div>
          <div class="logo-zp">ZERO <span>PRINT</span></div>
        </div>
        <div class="product-layout">
          <div class="product-images">
            ${sanitizeUrl(item.image) ?
              `<img src="/api/img?url=${encodeURIComponent(sanitizeUrl(item.image))}" class="main-image" onerror="this.style.background='#f8fafc'">` :
              `<div class="main-image" style="background:#f8fafc;display:flex;align-items:center;justify-content:center;color:#d1d5db;font-size:40px;">📦</div>`}
          </div>
          <div class="product-details">
            <table class="price-table">
              <tr>
                <th>Цена за 1 шт.</th>
                <th>×</th>
                <th>Тираж</th>
                <th>=</th>
                <th>Итоговая стоимость</th>
              </tr>
              <tr>
                <td>${item.price.toLocaleString('ru')} ₸</td>
                <td style="text-align:center;color:#9ca3af;">×</td>
                <td style="text-align:center;">${item.qty} шт.</td>
                <td style="text-align:center;color:#9ca3af;">=</td>
                <td class="total-cell">${itemTotal.toLocaleString('ru')} ₸</td>
              </tr>
            </table>
            ${chars.length > 0 ? `<div class="chars">${charRows}</div>` : ''}
            ${item.description ? `<div class="description">${escHtml(item.description)}</div>` : ''}
          </div>
        </div>
        <div class="page-footer">
          <span>ZERO PRINT • zeroprint.kz@gmail.com</span>
          <span>Стр. ${idx + 2}</span>
        </div>
      </div>`;
  }).join('');

  const summaryRows = (p.items || []).map((item: any, idx: number) => `
    <tr>
      <td style="text-align:center;">${idx + 1}</td>
      <td>${escHtml(item.name)}</td>
      <td style="text-align:center;">${item.qty} шт.</td>
      <td style="text-align:right;">${item.price.toLocaleString('ru')} ₸</td>
      <td style="text-align:right;font-weight:700;">${(item.qty * item.price).toLocaleString('ru')} ₸</td>
    </tr>`).join('');

  const summaryPage = `
    <div class="page" style="position:relative;">
      <div class="top-bar">
        <div class="product-name-title">Итоговая таблица</div>
        <div class="logo-zp">ZERO <span>PRINT</span></div>
      </div>
      <table class="summary-table">
        <thead>
          <tr>
            <th style="width:30px;text-align:center;">№</th>
            <th>Товар</th>
            <th style="width:80px;text-align:center;">Кол-во</th>
            <th style="width:100px;text-align:right;">Цена</th>
            <th style="width:120px;text-align:right;">Итого</th>
          </tr>
        </thead>
        <tbody>
          ${summaryRows}
          <tr>
            <td colspan="4" class="summary-total" style="text-align:right;padding:12px 10px;">ИТОГО:</td>
            <td class="summary-total" style="text-align:right;padding:12px 10px;">${totalPrice.toLocaleString('ru')} ₸</td>
          </tr>
        </tbody>
      </table>
      ${p.branding ? `<div style="margin-top:6mm;padding:4mm;background:#f8fafc;border-radius:4px;font-size:12px;"><strong>Брендирование:</strong> ${escHtml(p.branding)}</div>` : ''}
      <div style="margin-top:4mm;font-size:11px;color:#6b7280;">Срок действия предложения: до ${validUntil.toLocaleDateString('ru-RU')}</div>
      <div class="cta-block">
        <div class="cta-title">Готовы оформить заказ?</div>
        <div class="cta-sub">Свяжитесь с нами — рассчитаем стоимость за 15 минут</div>
        <a href="https://wa.me/77716246461?text=${waText}" class="wa-btn">💬 WhatsApp</a>
        <a href="tel:+77001584039" class="phone-btn">📞 +7 700 158 40 39</a>
      </div>
      <div class="page-footer">
        <span>ZERO PRINT • г. Алматы, ул. Радостовца 152/6, офис 104</span>
        <span>WhatsApp: +7 771 624 64 61</span>
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title || 'Коммерческое предложение'} — ZERO PRINT</title>
  <style>${css}</style>
</head>
<body>
  ${coverPage}
  ${productPages}
  ${summaryPage}
</body>
</html>`;
}

interface AuthRequest extends Request {
  clientId?: string;
  managerId?: string;
}

function requireClientAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Требуется авторизация" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "client") return res.status(403).json({ error: "Нет доступа" });
    req.clientId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Неверный токен" });
  }
}

function requireManagerAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Требуется авторизация" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "manager") return res.status(403).json({ error: "Нет доступа" });
    req.managerId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Неверный токен" });
  }
}

const CATEGORY_MAP: Record<number, { slug: string; name: string; parentId?: number }> = {};
const catalogCats = [
  { id: 3070, slug: "odezhda", name: "Одежда", children: [
    { id: 5369, slug: "futbolki", name: "Футболки" },
    { id: 5378, slug: "polo", name: "Поло" },
    { id: 3076, slug: "hudi", name: "Худи и свитшоты" },
    { id: 3975, slug: "kurtki", name: "Куртки и ветровки" },
    { id: 3074, slug: "kepki", name: "Бейсболки и панамы" },
    { id: 3084, slug: "golovnye-ubory", name: "Головные уборы" },
    { id: 3078, slug: "bryuki", name: "Брюки и шорты" },
    { id: 3077, slug: "zhilety", name: "Жилеты" },
    { id: 4800, slug: "specodezhda", name: "Спецодежда" },
  ]},
  { id: 3058, slug: "ruchki", name: "Пишущие инструменты", children: [
    { id: 3059, slug: "plastikovye-ruchki", name: "Пластиковые ручки" },
    { id: 3060, slug: "metallicheskie-ruchki", name: "Металлические ручки" },
    { id: 3063, slug: "ruchki-stilusy", name: "Ручки-стилусы" },
    { id: 3061, slug: "nabory-ruchek", name: "Наборы ручек" },
    { id: 3069, slug: "karandashi", name: "Карандаши" },
  ]},
  { id: 2953, slug: "posuda", name: "Кухня и посуда", children: [
    { id: 2958, slug: "kruzhki", name: "Кружки и стаканы" },
    { id: 2954, slug: "termosy", name: "Термокружки и термосы" },
    { id: 2961, slug: "butylki", name: "Бутылки для воды" },
    { id: 2962, slug: "kontejnery", name: "Контейнеры для еды" },
  ]},
  { id: 2931, slug: "sumki", name: "Сумки и рюкзаки", children: [
    { id: 2932, slug: "ryukzaki", name: "Рюкзаки" },
    { id: 2936, slug: "shopery", name: "Для шопинга" },
    { id: 2933, slug: "dlya-noutbuka", name: "Для ноутбука" },
    { id: 2937, slug: "dlya-sporta", name: "Для спорта" },
  ]},
  { id: 3089, slug: "zonty", name: "Зонты", children: [
    { id: 3090, slug: "zonty-trosti", name: "Зонты-трости" },
    { id: 3092, slug: "skladnye-zonty", name: "Складные зонты" },
  ]},
  { id: 2892, slug: "elektronika", name: "Электроника", children: [
    { id: 3991, slug: "powerbanki", name: "Power Bank" },
    { id: 2895, slug: "kolonki", name: "Колонки и наушники" },
    { id: 2920, slug: "kompyuternye", name: "Компьютерные аксессуары" },
    { id: 3702, slug: "smart-chasy", name: "Смарт-часы" },
    { id: 3986, slug: "zaryadnye", name: "Зарядные устройства" },
  ]},
  { id: 3021, slug: "ofisnye", name: "Офисные аксессуары", children: [
    { id: 3022, slug: "bloknoty", name: "Блокноты" },
    { id: 3026, slug: "ezhednevniki", name: "Ежедневники" },
    { id: 3030, slug: "papki", name: "Папки" },
    { id: 3051, slug: "kanctovary", name: "Канцтовары" },
  ]},
  { id: 3238, slug: "aksessuary", name: "Личные аксессуары" },
  { id: 3275, slug: "delovye-podarki", name: "Деловые подарки" },
  { id: 5272, slug: "podarochnye-nabory", name: "Подарочные наборы" },
  { id: 3517, slug: "upakovka", name: "Упаковка" },
  { id: 3257, slug: "avto", name: "Автоаксессуары" },
  { id: 3180, slug: "dlya-doma", name: "Для дома" },
  { id: 3095, slug: "dlya-otdyha", name: "Для отдыха" },
  { id: 3167, slug: "dlya-sporta", name: "Для спорта" },
  { id: 4197, slug: "dlya-detej", name: "Для детей" },
  { id: 3543, slug: "sedobnye", name: "Съедобные подарки" },
];

catalogCats.forEach(c => {
  CATEGORY_MAP[c.id] = { slug: c.slug, name: c.name };
  if ('children' in c && c.children) {
    c.children.forEach(ch => {
      CATEGORY_MAP[ch.id] = { slug: ch.slug, name: ch.name, parentId: c.id };
    });
  }
});

function slugToIds(slug: string): number[] {
  const ids: number[] = [];
  for (const [idStr, info] of Object.entries(CATEGORY_MAP)) {
    if (info.slug === slug) {
      const id = parseInt(idStr);
      ids.push(id);
      for (const [childIdStr, childInfo] of Object.entries(CATEGORY_MAP)) {
        if (childInfo.parentId === id) {
          ids.push(parseInt(childIdStr));
        }
      }
    }
  }
  return ids;
}

function productMatchesCategory(product: Product, categoryIds: number[]): boolean {
  return product.categories.some(c => categoryIds.includes(c));
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  syncProducts().catch(err => log(`Initial sync failed: ${err.message}`, "sync"));

  cron.schedule("0 3 * * *", () => {
    syncProducts().catch(err => log(`Cron sync failed: ${err.message}`, "sync"));
  });

  app.get("/api/products/search", (req, res) => {
    try {
      const q = ((req.query.q as string) || "").toLowerCase().trim();
      if (q.length < 2) return res.json([]);

      const products = getProducts();
      const results: Array<{ id: string; name: string; brand: string; price: number; image: string }> = [];

      for (const p of products) {
        if (results.length >= 8) break;
        if (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.article.toLowerCase().includes(q)
        ) {
          results.push({
            id: p.id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            image: p.images[0] || "",
          });
        }
      }

      res.json(results);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/products", (req, res) => {
    try {
      let products = getProducts();
      const { category, brand, search, min_price, max_price, in_stock, sort, page, limit, sale, hit } = req.query;

      if (category) {
        const catIds = slugToIds(category as string);
        if (catIds.length > 0) {
          products = products.filter(p => productMatchesCategory(p, catIds));
        }
      }

      if (brand) {
        const brandFilter = (brand as string).toLowerCase();
        products = products.filter(p => p.brand.toLowerCase() === brandFilter);
      }

      if (search) {
        const q = (search as string).toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.article.toLowerCase().includes(q) ||
          p.fullName.toLowerCase().includes(q)
        );
      }

      if (min_price) {
        const minP = parseInt(min_price as string, 10);
        products = products.filter(p => p.price >= minP);
      }

      if (max_price) {
        const maxP = parseInt(max_price as string, 10);
        products = products.filter(p => p.price <= maxP);
      }

      if (in_stock === "true") {
        products = products.filter(p => p.stock > 0);
      }

      if (sale === "true") {
        products = products.filter(p => p.isSale);
      }

      if (hit === "true") {
        products = products.filter(p => p.isHit);
      }

      const total = products.length;

      if (sort) {
        switch (sort) {
          case "price_asc":
            products.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            products.sort((a, b) => b.price - a.price);
            break;
          case "name":
            products.sort((a, b) => a.name.localeCompare(b.name, "ru"));
            break;
          case "rating":
            products.sort((a, b) => b.rating - a.rating);
            break;
        }
      }

      const pageNum = parseInt((page as string) || "1", 10);
      const pageSize = Math.min(parseInt((limit as string) || "24", 10), 100);
      const startIdx = (pageNum - 1) * pageSize;

      const slim = products.slice(startIdx, startIdx + pageSize).map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        oldPrice: p.oldPrice,
        images: p.images.slice(0, 2),
        colors: p.colors.slice(0, 10),
        sizes: p.sizes,
        stock: p.stock,
        rating: p.rating,
        isNew: p.isNew,
        isHit: p.isHit,
        isSale: p.isSale,
        article: p.article,
        variantCount: p.variants.length,
      }));

      const brands = new Map<string, number>();
      const allFiltered = getProducts();
      let catProducts = allFiltered;
      if (category) {
        const catIds = slugToIds(category as string);
        if (catIds.length > 0) {
          catProducts = catProducts.filter(p => productMatchesCategory(p, catIds));
        }
      }
      catProducts.forEach(p => {
        if (p.brand) {
          brands.set(p.brand, (brands.get(p.brand) || 0) + 1);
        }
      });

      const brandList = Array.from(brands.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(([name, count]) => ({ name, count }));

      res.json({
        products: slim,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / pageSize),
        brands: brandList,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/products/:id", (req, res) => {
    try {
      const product = getProductById(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/products/:id/related", (req, res) => {
    try {
      const product = getProductById(req.params.id);
      if (!product) return res.status(404).json([]);

      const products = getProducts();
      const related = products
        .filter(p => p.id !== product.id && p.categories.some(c => product.categories.includes(c)))
        .slice(0, 4)
        .map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.price,
          oldPrice: p.oldPrice,
          images: p.images.slice(0, 1),
          colors: p.colors.slice(0, 6),
          sizes: p.sizes,
          stock: p.stock,
          isNew: p.isNew,
          isHit: p.isHit,
          isSale: p.isSale,
        }));

      res.json(related);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/sync", async (_req, res) => {
    try {
      const count = await syncProducts();
      res.json({ success: true, count });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/sitemap.xml", (_req, res) => {
    const products = getProducts();
    const baseUrl = "https://zero-promo--duman080896.replit.app";
    const today = new Date().toISOString().split("T")[0];

    const staticPages = [
      { url: "/", priority: "1.0", freq: "weekly" },
      { url: "/catalog", priority: "0.9", freq: "daily" },
      { url: "/poshiv", priority: "0.9", freq: "monthly" },
      { url: "/poligrafiya", priority: "0.9", freq: "monthly" },
      { url: "/uslugi/vyshivka", priority: "0.9", freq: "monthly" },
      { url: "/uslugi/pechat", priority: "0.9", freq: "monthly" },
      { url: "/uslugi/poshiv", priority: "0.9", freq: "monthly" },
      { url: "/uslugi/brendirovanie", priority: "0.9", freq: "monthly" },
      { url: "/portfolio", priority: "0.8", freq: "monthly" },
      { url: "/about", priority: "0.6", freq: "monthly" },
      { url: "/kontakty", priority: "0.7", freq: "monthly" },
      { url: "/cart", priority: "0.5", freq: "monthly" },
      { url: "/catalog?category=futbolki", priority: "0.8", freq: "weekly" },
      { url: "/catalog?category=ruchki", priority: "0.8", freq: "weekly" },
      { url: "/catalog?category=termosy", priority: "0.8", freq: "weekly" },
      { url: "/catalog?category=zonty", priority: "0.8", freq: "weekly" },
      { url: "/catalog?category=sumki", priority: "0.8", freq: "weekly" },
      { url: "/catalog?category=elektronika", priority: "0.8", freq: "weekly" },
      { url: "/catalog?category=odezhda", priority: "0.8", freq: "weekly" },
      { url: "/catalog?category=ofisnye", priority: "0.7", freq: "weekly" },
      { url: "/catalog?category=aksessuary", priority: "0.7", freq: "weekly" },
      { url: "/catalog?category=delovye-podarki", priority: "0.7", freq: "weekly" },
      { url: "/catalog?category=upakovka", priority: "0.7", freq: "weekly" },
    ];

    const productUrls = products.slice(0, 2000).map(p => ({
      url: `/catalog/product/${p.id}`,
      priority: "0.6",
      freq: "weekly",
    }));

    const allUrls = [...staticPages, ...productUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(p => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /data/

Sitemap: https://zero-promo--duman080896.replit.app/sitemap.xml`);
  });

  app.post("/api/client/register", async (req, res) => {
    try {
      const { name, email, phone, company, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ error: "Заполните обязательные поля" });

      const existing = await db.select().from(clients).where(eq(clients.email, email.toLowerCase()));
      if (existing.length > 0) return res.status(400).json({ error: "Пользователь с таким email уже существует" });

      const id = generateId();
      const passwordHash = await bcrypt.hash(password, 10);

      await db.insert(clients).values({
        id,
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        company: company || null,
        passwordHash,
      });

      const token = jwt.sign({ id, role: "client" }, JWT_SECRET, { expiresIn: "30d" });

      sendWelcomeEmail(email.toLowerCase(), name);

      res.json({ token, client: { id, name, email: email.toLowerCase(), phone, company, discount: 0 } });
    } catch (err: any) {
      log(`Client register error: ${err.message}`, "auth");
      res.status(500).json({ error: "Ошибка регистрации" });
    }
  });

  app.post("/api/client/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Введите email и пароль" });

      const rows = await db.select().from(clients).where(eq(clients.email, email.toLowerCase()));
      if (rows.length === 0) return res.status(401).json({ error: "Неверный email или пароль" });

      const client = rows[0];
      const valid = await bcrypt.compare(password, client.passwordHash);
      if (!valid) return res.status(401).json({ error: "Неверный email или пароль" });

      const token = jwt.sign({ id: client.id, role: "client" }, JWT_SECRET, { expiresIn: "30d" });
      res.json({
        token,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          company: client.company,
          discount: client.discount,
        },
      });
    } catch (err: any) {
      log(`Client login error: ${err.message}`, "auth");
      res.status(500).json({ error: "Ошибка входа" });
    }
  });

  app.get("/api/client/me", requireClientAuth as any, async (req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(clients).where(eq(clients.id, req.clientId!));
      if (rows.length === 0) return res.status(404).json({ error: "Клиент не найден" });
      const c = rows[0];
      res.json({ id: c.id, name: c.name, email: c.email, phone: c.phone, company: c.company, discount: c.discount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/client/profile", requireClientAuth as any, async (req: AuthRequest, res) => {
    try {
      const { name, phone, company } = req.body;
      await db.update(clients).set({ name, phone, company }).where(eq(clients.id, req.clientId!));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/client/wishlist", requireClientAuth as any, async (req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(wishlist).where(eq(wishlist.clientId, req.clientId!));
      const productIds = rows.map(r => r.productId);
      const products = productIds.map(pid => {
        const p = getProductById(pid);
        if (!p) return null;
        return { id: p.id, name: p.name, brand: p.brand, price: p.price, image: p.images[0] || "", stock: p.stock };
      }).filter(Boolean);
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/client/wishlist", requireClientAuth as any, async (req: AuthRequest, res) => {
    try {
      const { productId } = req.body;
      if (!productId) return res.status(400).json({ error: "productId required" });
      const existing = await db.select().from(wishlist).where(eq(wishlist.clientId, req.clientId!));
      if (existing.some(w => w.productId === productId)) return res.json({ success: true });
      await db.insert(wishlist).values({ id: generateId(), clientId: req.clientId!, productId });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/client/wishlist/:productId", requireClientAuth as any, async (req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(wishlist).where(eq(wishlist.clientId, req.clientId!));
      const toDelete = rows.find(w => w.productId === req.params.productId);
      if (toDelete) {
        await db.delete(wishlist).where(eq(wishlist.id, toDelete.id));
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { clientId, clientName, clientPhone, company, items, totalPrice, branding, comment } = req.body;
      if (!items || !clientName) return res.status(400).json({ error: "Заполните данные заказа" });
      const id = generateId();
      await db.insert(orders).values({
        id,
        clientId: clientId || null,
        clientName,
        clientPhone: clientPhone || null,
        company: company || null,
        items,
        totalPrice: totalPrice || 0,
        branding: branding || null,
        comment: comment || null,
        status: "new",
      });
      res.json({ id, success: true });
    } catch (err: any) {
      log(`Order create error: ${err.message}`, "orders");
      res.status(500).json({ error: "Ошибка создания заказа" });
    }
  });

  app.get("/api/client/orders", requireClientAuth as any, async (req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(orders).where(eq(orders.clientId, req.clientId!)).orderBy(desc(orders.createdAt));
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/client/proposals", requireClientAuth as any, async (req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(proposals).where(eq(proposals.clientId, req.clientId!)).orderBy(desc(proposals.createdAt));
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/manager/init", async (req, res) => {
    try {
      const { id: customId, email, password, name, phone } = req.body;
      if (!email || !password || !name) return res.status(400).json({ error: "Заполните все поля" });

      const existing = await db.select().from(managers).where(eq(managers.email, email.toLowerCase()));
      if (existing.length > 0) {
        const passwordHash = await bcrypt.hash(password, 10);
        await db.update(managers).set({ name, passwordHash, phone: phone || null }).where(eq(managers.email, email.toLowerCase()));
        return res.json({ success: true, id: existing[0].id, updated: true });
      }

      const id = customId || generateId();
      const passwordHash = await bcrypt.hash(password, 10);
      await db.insert(managers).values({ id, name, email: email.toLowerCase(), passwordHash, phone: phone || null });
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/manager/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Введите email и пароль" });

      const rows = await db.select().from(managers).where(eq(managers.email, email.toLowerCase()));
      if (rows.length === 0) return res.status(401).json({ error: "Неверный email или пароль" });

      const mgr = rows[0];
      const valid = await bcrypt.compare(password, mgr.passwordHash);
      if (!valid) return res.status(401).json({ error: "Неверный email или пароль" });

      const token = jwt.sign({ id: mgr.id, role: "manager" }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, manager: { id: mgr.id, name: mgr.name, email: mgr.email, phone: mgr.phone } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/manager/clients", requireManagerAuth as any, async (_req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(clients).orderBy(desc(clients.createdAt));
      res.json(rows.map(c => ({ id: c.id, name: c.name, email: c.email, phone: c.phone, company: c.company, discount: c.discount, createdAt: c.createdAt })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/manager/orders", requireManagerAuth as any, async (_req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/manager/orders/:id/status", requireManagerAuth as any, async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      await db.update(orders).set({ status, managerId: req.managerId }).where(eq(orders.id, req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/manager/proposals", requireManagerAuth as any, async (req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(proposals).where(eq(proposals.managerId, req.managerId!)).orderBy(desc(proposals.createdAt));
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/manager/proposals", requireManagerAuth as any, async (req: AuthRequest, res) => {
    try {
      const { title, clientId, clientName, clientContact, clientLogoUrl, branding, comment, items, validDays } = req.body;
      const mgrRows = await db.select().from(managers).where(eq(managers.id, req.managerId!));
      const mgr = mgrRows[0];
      const id = generateId();
      await db.insert(proposals).values({
        id,
        managerId: req.managerId!,
        managerName: mgr?.name || "",
        managerPhone: mgr?.phone || "",
        title: title || "Коммерческое предложение",
        clientId: clientId || null,
        clientName: clientName || "",
        clientContact: clientContact || "",
        clientLogoUrl: clientLogoUrl || null,
        branding: branding || null,
        comment: comment || null,
        items: items || [],
        validDays: validDays || 30,
      });
      res.json({ id, success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/manager/proposals/:id", requireManagerAuth as any, async (req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(proposals).where(and(eq(proposals.id, req.params.id), eq(proposals.managerId, req.managerId!)));
      if (rows.length === 0) return res.status(404).json({ error: "КП не найдено" });
      res.json(rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/manager/proposals/:id", requireManagerAuth as any, async (req: AuthRequest, res) => {
    try {
      const { title, clientName, clientContact, clientLogoUrl, branding, comment, items, validDays } = req.body;
      await db.update(proposals).set({
        title, clientName, clientContact, clientLogoUrl, branding, comment, items, validDays,
      }).where(and(eq(proposals.id, req.params.id), eq(proposals.managerId, req.managerId!)));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/manager/proposals/:id", requireManagerAuth as any, async (req: AuthRequest, res) => {
    try {
      await db.delete(proposals).where(and(eq(proposals.id, req.params.id), eq(proposals.managerId, req.managerId!)));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/manager/subscribers", requireManagerAuth as any, async (_req: AuthRequest, res) => {
    try {
      const rows = await db.select().from(subscribers).orderBy(desc(subscribers.subscribedAt));
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/img", async (req, res) => {
    const url = req.query.url as string;
    if (!url) return res.status(400).send('No URL');
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://oasiscatalog.com/',
        }
      });
      if (!response.ok) return res.status(404).send('Image not found');
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(Buffer.from(buffer));
    } catch (e) {
      res.status(500).send('Proxy error');
    }
  });

  app.get("/api/kp/:id", async (req, res) => {
    try {
      await db.update(proposals).set({ views: sql`coalesce(${proposals.views}, 0) + 1` }).where(eq(proposals.id, req.params.id));
      const rows = await db.select().from(proposals).where(eq(proposals.id, req.params.id));
      if (rows.length === 0) return res.status(404).json({ error: "КП не найдено" });
      res.json(rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/kp/:id/html", async (req, res) => {
    try {
      const rows = await db.select().from(proposals).where(eq(proposals.id, req.params.id));
      if (rows.length === 0) return res.status(404).send("КП не найдено");
      const html = generateKpHtml(rows[0]);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (err: any) {
      res.status(500).send("Ошибка");
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email, name } = req.body;
      if (!email) return res.status(400).json({ error: "Введите email" });

      const existing = await db.select().from(subscribers).where(eq(subscribers.email, email.toLowerCase()));
      if (existing.length > 0) return res.json({ success: true, message: "Вы уже подписаны" });

      await db.insert(subscribers).values({ id: generateId(), email: email.toLowerCase(), name: name || null });
      res.json({ success: true, message: "Вы успешно подписались" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return httpServer;
}
