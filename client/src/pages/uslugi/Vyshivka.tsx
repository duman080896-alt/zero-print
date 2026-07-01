/**
 * Vyshivka.tsx — Landing page: embroidery service
 * Route: /uslugi/vyshivka
 *
 * Setup (run once in Replit terminal):
 *   npm install -D tailwindcss @tailwindcss/vite
 *   # add to vite.config.ts: import tailwindcss from '@tailwindcss/vite' → plugins:[tailwindcss()]
 *   # add to src/index.css first line: @import "tailwindcss";
 *
 * In tailwind.config.js add:
 *   theme: { extend: { fontFamily: { display: ['Montserrat','sans-serif'] } } }
 *
 * Then add this page as a route in App.tsx:
 *   import Vyshivka from './pages/Vyshivka'
 *   <Route path="/uslugi/vyshivka" element={<Vyshivka />} />
 */

import { useState, useEffect, useRef } from "react";
import "./Vyshivka.css";
import Navbar from "@/components/Navbar";

const PHONE = "77716246461";
const wa = (msg: string) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

// ─── Scroll reveal hook ─────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".reveal, .stagger")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── Animated counter hook ──────────────────────────────────────────────────
function useCounter(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return value;
}

// ─── FAQ item data ──────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Можно заказать 1–2 штуки?",
    a: "Да. Минимальный заказ — 1 изделие. Это удобно для образца, замены или небольшой партии. Цена на малый тираж — от 1 500 ₸ за штуку.",
  },
  {
    q: "Сколько стоит оцифровка логотипа?",
    a: "При заказе от 50 изделий — бесплатно. При заказе до 50 штук — от 5 000 ₸ в зависимости от сложности. Готовый файл остаётся у вас навсегда.",
  },
  {
    q: "Как долго делается заказ?",
    a: "Стандартный срок — 5–7 рабочих дней. Срочный заказ — от 3 дней. Сроки согласовываем до старта и прописываем в договоре.",
  },
  {
    q: "Вы работаете с нашей готовой одеждой?",
    a: "Да, можем нанести вышивку на вашу готовую одежду — привезите к нам. Либо пошьём с нуля и сразу нанесём вышивку.",
  },
  {
    q: "Можно заказать вышивку на спецодежде?",
    a: "Да, это одно из ключевых направлений. Вышивка — лучший выбор для спецодежды: выдерживает интенсивные стирки и сложные условия.",
  },
  {
    q: "Есть договор и документы для бухгалтерии?",
    a: "Да, работаем официально. Договор, счёт, акт выполненных работ, счёт-фактура с НДС. Работаем с юрлицами и ИП.",
  },
  {
    q: "Можно заказать пробный образец?",
    a: "Да, при заказе от 200 штук — 1 пробное изделие бесплатно. Утверждаете качество и только потом запускаем тираж.",
  },
];

// ─── Pricing card data ──────────────────────────────────────────────────────
const PRICING = [
  {
    type: "1–49 штук",
    price: "от 1 500 ₸",
    unit: "за изделие · без минимального тиража",
    hot: false,
    items: [
      "Образцы, шевроны, малые партии",
      "Плоская и 3D-вышивка",
      "Оцифровка логотипа от 5 000 ₸",
      "Срок: 5–7 рабочих дней",
    ],
    cta: { label: "Заказать расчёт", href: "#form" },
  },
  {
    type: "50–499 штук",
    price: "от 500 ₸",
    unit: "за изделие · средний тираж",
    hot: true,
    badge: "Популярный",
    items: [
      "Бесплатная оцифровка логотипа",
      "Пробный образец от 200 шт",
      "Плоская и 3D-вышивка",
      "Срок: 5–10 рабочих дней",
    ],
    cta: { label: "Заказать расчёт", href: "#form" },
  },
  {
    type: "500+ штук",
    price: "от 350 ₸",
    unit: "за изделие · скидка до 30%",
    hot: false,
    items: [
      "Персональный менеджер",
      "Приоритетное производство",
      "Полный пакет документов (НДС)",
      "Доставка по всему Казахстану",
    ],
    cta: {
      label: "Обсудить в WhatsApp",
      href: wa("Здравствуйте! Хочу обсудить крупный тираж вышивки."),
      external: true,
    },
  },
];

// ─── Types data ─────────────────────────────────────────────────────────────
const TYPES = [
  {
    num: "01",
    name: "Плоская вышивка",
    desc: "Классика. Чёткие линии, насыщенные цвета. Для любого логотипа и ткани.",
    img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop&q=80",
  },
  {
    num: "02",
    name: "3D-вышивка",
    desc: "Объёмный логотип над тканью. Эффектно на кепках и поло.",
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop&q=80",
  },
  {
    num: "03",
    name: "Машинная вышивка",
    desc: "Для крупных изображений — спины курток, больших эмблем.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",
  },
  {
    num: "04",
    name: "Вышивка-аппликация",
    desc: "Комбинация вышивки с накладными элементами. Яркий «университетский» стиль.",
    img: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&h=300&fit=crop&q=80",
  },
  {
    num: "05",
    name: "Вышивка в цвет",
    desc: "«Невидимый» брендинг в тон ткани. Лаконично для премиального мерча.",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&q=80",
  },
];

// ─── Portfolio data ─────────────────────────────────────────────────────────
const PORTFOLIO = [
  {
    cat: "Нефть и газ",
    title: "LUKOIL — поло с орнаментом",
    meta: "500 шт · Плоская вышивка",
    img: "/photos/5467823195986529896.jpg",
  },
  {
    cat: "Ритейл / Дистрибуция",
    title: "PRIMA Distribution — корпоративные поло",
    meta: "1 000 шт · Плоская вышивка",
    img: "/photos/5467823195986529861.jpg",
  },
  {
    cat: "Ритейл / Дистрибуция",
    title: "PRIMA Distribution — бомберы",
    meta: "300 шт · Плоская вышивка",
    img: "/photos/5467823195986529864.jpg",
  },
  {
    cat: "HoReCa / Рестораны",
    title: "Doner На Абая — поло персонала",
    meta: "200 шт · 3D-вышивка",
    img: "/photos/5467823195986529871.jpg",
  },
  {
    cat: "Государственный сектор",
    title: "AMANAT — жилеты с логотипом",
    meta: "400 шт · Плоская вышивка",
    img: "/photos/5467823195986529883.jpg",
  },
  {
    cat: "Строительство / Недвижимость",
    title: "DIA Properties — спецодежда",
    meta: "800 шт · Плоская вышивка",
    img: "/photos/5467823195986529947.jpg",
  },
];

// ─── Products data ──────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    label: "Поло",
    img: "https://images.unsplash.com/photo-1562572159-4efd90232e4c?w=300&h=200&fit=crop&q=70",
  },
  {
    label: "Худи",
    img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&h=200&fit=crop&q=70",
  },
  {
    label: "Куртки",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=200&fit=crop&q=70",
  },
  {
    label: "Спецодежда",
    img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=300&h=200&fit=crop&q=70",
  },
  {
    label: "Кепки",
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=200&fit=crop&q=70",
  },
  {
    label: "Свитшоты",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop&q=70",
  },
  {
    label: "Сумки",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop&q=70",
  },
  {
    label: "Аксессуары",
    img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop&q=70",
  },
];

// ───────────────────────────────────────────────────────────────────────────
export default function Vyshivka() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c500 = useCounter(500, statsVisible);
  const c5m = useCounter(5000000, statsVisible);
  const c5 = useCounter(5, statsVisible);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const name = (f.querySelector("input[type=text]") as HTMLInputElement)
      .value;
    const phone = (f.querySelector("input[type=tel]") as HTMLInputElement)
      .value;
    const product = (f.querySelectorAll("select")[0] as HTMLSelectElement)
      .value;
    const qty = (f.querySelectorAll("select")[1] as HTMLSelectElement).value;
    const comment = (f.querySelector("textarea") as HTMLTextAreaElement).value;
    const msg = `Здравствуйте! Хочу заказать вышивку.\nИмя: ${name}\nТелефон: ${phone}\nИзделие: ${product}\nКоличество: ${qty}\nКомментарий: ${comment}`;
    window.open(wa(msg), "_blank");
  };

  return (
    <>
      <div className="font-sans text-[#0F172A] bg-white overflow-x-hidden">
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <Navbar />

        {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
        <div className="bg-gray-50 border-b border-gray-100 px-6 lg:px-12 py-2.5 text-xs text-gray-400 flex items-center gap-1.5">
          <a
            href="/"
            className="hover:text-gray-700 no-underline transition-colors"
          >
            Главная
          </a>
          <span>/</span>
          <a
            href="/uslugi"
            className="hover:text-gray-700 no-underline transition-colors"
          >
            Услуги
          </a>
          <span>/</span>
          <span className="text-gray-700 font-medium">Вышивка на одежде</span>
        </div>

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="bg-[#0F1F3D] text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT */}
            <div>
              <span className="inline-flex items-center gap-2 text-orange-400 text-xs font-bold tracking-[2px] uppercase mb-6">
                <span className="w-8 h-px bg-orange-400"></span>
                Производство в Алматы · Казахстан
              </span>
              <h1
                className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black mb-5 leading-[1.1]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Вышивка
                <br />
                <span className="text-orange-400">логотипа</span> на
                <br />
                одежде в Алматы
              </h1>
              <p className="text-white/60 text-lg mb-6 leading-relaxed">
                От 1 штуки — без минимального тиража.
                <br className="hidden sm:block" />
                Срок от 3 рабочих дней.
              </p>

              <div className="flex items-baseline gap-3 mb-8">
                <span
                  className="text-4xl font-black text-orange-400"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  от 500 ₸
                </span>
                <span className="text-white/40 text-sm">
                  за изделие · тираж от 50 шт
                </span>
              </div>

              <div className="flex gap-3 flex-wrap mb-10">
                <a
                  href="#form"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(249,115,22,0.4)] no-underline text-sm"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Получить расчёт за 30 минут
                </a>
                <a
                  href={wa("Здравствуйте! Хочу заказать вышивку логотипа.")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold px-6 py-4 rounded-xl transition-all no-underline text-sm"
                >
                  <WaIcon size={18} /> WhatsApp
                </a>
              </div>

              <div
                ref={statsRef}
                className="flex gap-8 pt-8 border-t border-white/10"
              >
                {[
                  {
                    value: c500 >= 500 ? "500+" : String(c500),
                    label: "компаний",
                  },
                  {
                    value:
                      c5m >= 5000000
                        ? "5M+"
                        : c5m >= 1000000
                          ? `${Math.round(c5m / 1000000)}M`
                          : String(c5m),
                    label: "изделий",
                  },
                  {
                    value: c5 >= 5 ? "5" : String(c5),
                    label: "лет в Казахстане",
                  },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div
                      className="text-3xl font-black text-white"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — real photo */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                <img
                  src="/photos/5467823195986529896.jpg"
                  alt="Вышивка логотипа LUKOIL на поло"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* floating card */}
              <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl px-6 py-4 shadow-xl">
                <div className="text-xs text-gray-400 mb-1">
                  Реализованный проект
                </div>
                <div className="font-bold text-[#0F1F3D] text-sm">
                  LUKOIL · 500 шт
                </div>
                <div className="text-xs text-orange-500 font-semibold">
                  Плоская вышивка
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STICKY MOBILE CTA ──────────────────────────────────────── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex gap-2 shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">
          <a
            href="#form"
            className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3.5 rounded-xl transition-colors no-underline"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Расчёт за 30 минут
          </a>
          <a
            href={wa("Здравствуйте! Хочу заказать вышивку логотипа.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#0F1F3D] text-white font-bold text-sm px-5 py-3.5 rounded-xl transition-colors no-underline"
          >
            <WaIcon size={18} /> WA
          </a>
        </div>

        {/* ── TRUST BAR ──────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 px-6 lg:px-12 py-4">
          <div className="max-w-7xl mx-auto flex justify-center gap-6 lg:gap-12 flex-wrap">
            {[
              { icon: <ShieldIcon />, text: "Своё производство" },
              { icon: <BoxIcon />, text: "От 1 штуки" },
              { icon: <TruckIcon />, text: "Доставка по Казахстану" },
              { icon: <ClockIcon />, text: "Срок от 3 дней" },
              { icon: <CheckCircleIcon />, text: "Контроль качества" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                <span className="text-orange-500 w-4 h-4 flex-shrink-0">
                  {icon}
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── PORTFOLIO ──────────────────────────────────────────────── */}
        <div id="portfolio" className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 reveal">
              <div>
                <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                  Наши работы
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-black"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Вышивка для корпоративных клиентов
                </h2>
              </div>
              <a
                href={wa("Здравствуйте! Пришлите портфолио вышивки.")}
                target="_blank"
                rel="noreferrer"
                className="text-orange-500 font-bold text-sm no-underline hover:text-orange-600 whitespace-nowrap"
              >
                Все работы →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {PORTFOLIO.map(({ cat, title, meta, img }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]"
                >
                  <img
                    src={img}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Реализовано
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mb-1">
                      {cat}
                    </p>
                    <p
                      className="text-white font-bold text-base leading-snug"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {title}
                    </p>
                    <p className="text-white/50 text-xs mt-1">{meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRICING ────────────────────────────────────────────────── */}
        <div id="pricing" className="bg-gray-50 py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center reveal mb-12">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-3">
                Стоимость
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black mb-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Прозрачные цены
              </h2>
              <p className="text-gray-500">
                Без скрытых комиссий — цена фиксируется до старта
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger">
              {PRICING.map((p) => (
                <div
                  key={p.type}
                  className={`relative bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${p.hot ? "ring-2 ring-orange-500 shadow-[0_8px_40px_rgba(249,115,22,0.2)]" : "shadow-sm hover:shadow-md"}`}
                >
                  {p.badge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wide px-4 py-1 rounded-full whitespace-nowrap">
                      {p.badge}
                    </span>
                  )}
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4">
                    {p.type}
                  </p>
                  <p
                    className="text-[#0F1F3D] font-black text-4xl leading-none mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {p.price}
                  </p>
                  <p className="text-gray-400 text-xs mb-6">{p.unit}</p>
                  <ul className="flex flex-col gap-2.5 mb-7">
                    {p.items.map((item) => (
                      <li
                        key={item}
                        className="text-gray-600 text-sm flex gap-2.5 items-start"
                      >
                        <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">
                          ✓
                        </span>{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.cta.href}
                    target={p.cta.external ? "_blank" : undefined}
                    rel={p.cta.external ? "noreferrer" : undefined}
                    className={`block text-center py-3.5 rounded-xl font-bold text-sm no-underline transition-colors ${p.hot ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-[#0F1F3D]"}`}
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {p.cta.label}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">
              * Точная стоимость зависит от сложности логотипа и количества
              цветов. Цены в тенге без НДС.
            </p>
          </div>
        </div>

        {/* ── WHY EMBROIDERY ─────────────────────────────────────────── */}
        <div className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="reveal">
                <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-4">
                  Почему вышивка
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-black mb-6"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Инвестиция
                  <br />в репутацию бренда
                </h2>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                  В отличие от печати, вышивка держится весь срок службы изделия
                  — не выцветает и не смывается.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { num: "10+", text: "лет служит логотип" },
                    { num: "100+", text: "стирок выдерживает" },
                    { num: "5", text: "видов вышивки" },
                    { num: "3", text: "дня минимальный срок" },
                  ].map(({ num, text }) => (
                    <div key={text} className="bg-gray-50 rounded-xl p-5">
                      <div
                        className="text-2xl font-black text-[#0F1F3D] mb-1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {num}
                      </div>
                      <div className="text-sm text-gray-500">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto reveal rounded-2xl shadow-sm border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0F1F3D] text-white">
                      {["Метод", "Долговечность", "Стирки", "Спецодежда"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-orange-50">
                      <td className="px-5 py-3.5 font-bold text-orange-600 border-b border-orange-100">
                        Вышивка
                      </td>
                      <td className="px-5 py-3.5 font-bold text-green-600 border-b border-orange-100">
                        ★★★★★
                      </td>
                      <td className="px-5 py-3.5 font-bold text-green-600 border-b border-orange-100">
                        100+
                      </td>
                      <td className="px-5 py-3.5 font-bold text-green-600 border-b border-orange-100">
                        ✔
                      </td>
                    </tr>
                    {[
                      ["ДТФ-печать", "★★★☆☆", "40–60", "—"],
                      ["Шелкография", "★★★☆☆", "30–50", "—"],
                      ["Термопечать", "★★☆☆☆", "20–30", "—"],
                    ].map(([m, ...r], i) => (
                      <tr
                        key={m}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      >
                        <td className="px-5 py-3 border-b border-gray-100 text-gray-700">
                          {m}
                        </td>
                        {r.map((c) => (
                          <td
                            key={c}
                            className="px-5 py-3 border-b border-gray-100 text-gray-400"
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOR WHOM ───────────────────────────────────────────────── */}
        <div className="bg-[#0F1F3D] py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="reveal mb-12 text-center">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-400 mb-3">
                Для кого
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Кому подходит вышивка
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
              {[
                {
                  label: "Рестораны и HoReCa",
                  text: "Кепки, фартуки, рубашки с логотипом — единый стиль для всего персонала.",
                  img: "/photos/5418314468015412068.jpg",
                },
                {
                  label: "Строительство",
                  text: "Нашивки и шевроны на спецодежду: жилеты, куртки, комбинезоны. Держатся годами.",
                  img: "/photos/5467823195986529947.jpg",
                },
                {
                  label: "Офис и корпоратив",
                  text: "Поло, бомберы, рубашки для команды, выставок и корпоративных мероприятий.",
                  img: "/photos/5467823195986529883.jpg",
                },
                {
                  label: "Ритейл и сервис",
                  text: "Фирменная форма сотрудников — узнаваемость бренда на каждом шагу.",
                  img: "/photos/5467823195986529861.jpg",
                },
              ].map(({ label, text, img }) => (
                <div
                  key={label}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-default"
                >
                  <img
                    src={img}
                    alt={label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p
                      className="text-white font-bold text-lg mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {label}
                    </p>
                    <p className="text-white/65 text-sm leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SOCIAL PROOF ───────────────────────────────────────────── */}
        <div className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center reveal mb-12">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-3">
                Нам доверяют
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Компании Казахстана
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 stagger">
              {[
                "Нефть и газ",
                "IT-компании",
                "Банки",
                "Строительство",
                "Медицина",
              ].map((name) => (
                <div
                  key={name}
                  className="border border-gray-100 rounded-xl py-5 px-4 text-center text-sm font-medium text-gray-500 hover:border-orange-200 hover:text-orange-500 transition-colors cursor-default"
                >
                  {name}
                </div>
              ))}
            </div>
            <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 reveal border-l-4 border-orange-500">
              <div className="text-orange-400 text-lg mb-4">★★★★★</div>
              <p className="text-gray-700 text-lg leading-relaxed mb-5 italic">
                «Заказывали поло для всего офиса — 450 штук. Качество вышивки
                отличное, всё в срок. Уже третий раз работаем с ZERO PRINT.»
              </p>
              <p className="text-gray-400 text-sm">
                <strong className="text-gray-600">Айгерим С.</strong>,
                HR-директор, нефтяная компания, Алматы
              </p>
            </div>
          </div>
        </div>

        {/* ── STEPS ──────────────────────────────────────────────────── */}
        <div className="bg-gray-50 py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="reveal mb-12">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-3">
                Как работаем
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                4 шага до готового мерча
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
              {[
                {
                  n: "01",
                  title: "Заявка",
                  text: "Заполните форму или напишите в WhatsApp — ответим за 30 минут.",
                },
                {
                  n: "02",
                  title: "Макет",
                  text: "Оцифруем логотип, подберём цвета нитей, пришлём макет.",
                },
                {
                  n: "03",
                  title: "Производство",
                  text: "Запускаем тираж с контролем качества. Срок от 3 дней.",
                },
                {
                  n: "04",
                  title: "Доставка",
                  text: "Доставляем по Алматы или транспортной компанией по Казахстану.",
                },
              ].map(({ n, title, text }) => (
                <div key={n} className="bg-white rounded-2xl p-7 shadow-sm">
                  <div
                    className="text-5xl font-black text-gray-100 mb-4 leading-none"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {n}
                  </div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <div id="faq" className="py-20 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="reveal mb-10">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-3">
                FAQ
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Частые вопросы
              </h2>
            </div>
            <div className="flex flex-col divide-y divide-gray-100 reveal">
              {FAQS.map(({ q, a }, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-5 text-left font-bold text-base flex justify-between items-center gap-4 transition-colors cursor-pointer bg-transparent border-0 outline-none hover:text-orange-500"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {q}
                    <span
                      className={`text-orange-500 text-xl flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`faq-answer text-gray-500 text-base leading-relaxed ${openFaq === i ? "open" : ""}`}
                  >
                    {a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FORM ───────────────────────────────────────────────────── */}
        <section id="form" className="bg-[#0F1F3D] py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-400 mb-4">
                Заявка
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black text-white mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Рассчитайте стоимость за 30 минут
              </h2>
              <p className="text-white/50 text-lg mb-10">
                Менеджер свяжется и назовёт точную цену
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  "Бесплатный макет вышивки при заказе",
                  "Договор, счёт-фактура, НДС",
                  "Пробный образец от 200 шт",
                  "Доставка по всему Казахстану",
                  "Работаем с юрлицами и ИП",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-white/70 text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0">
                      <svg
                        viewBox="0 0 10 8"
                        className="w-2.5 h-2.5 stroke-orange-400 fill-none"
                        strokeWidth="2"
                      >
                        <polyline points="1,4 3.5,7 9,1" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 reveal">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Имя *
                    </label>
                    <input
                      type="text"
                      placeholder="Иван Иванов"
                      required
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      placeholder="+7 771 000 00 00"
                      required
                      className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Изделие
                    </label>
                    <select className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 transition-all text-gray-700">
                      <option value="">Выберите...</option>
                      {[
                        "Поло",
                        "Худи / Свитшот",
                        "Куртка",
                        "Спецодежда",
                        "Кепка",
                        "Сумка",
                        "Другое",
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Количество
                    </label>
                    <select className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 transition-all text-gray-700">
                      {["1–49", "50–199", "200–499", "500–1000", "1000+"].map(
                        (v) => (
                          <option key={v}>{v}</option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Комментарий
                  </label>
                  <textarea
                    placeholder="Вид вышивки, размер логотипа, сроки..."
                    rows={3}
                    className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer border-0 shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Получить расчёт →
                </button>
                <p className="text-center text-xs text-gray-400">
                  Работаем с юрлицами и ИП · Договор и НДС
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <footer className="bg-[#070F1C] text-white/40 py-10 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-4 text-sm">
            <div>
              <div
                className="font-black text-white text-base mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                ZERO
                <span className="bg-white text-[#070F1C] px-1 rounded-sm ml-0.5">
                  PRINT
                </span>
              </div>
              <p>© 2026 Корпоративный мерч и вышивка в Алматы</p>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <a
                href="tel:+77716246461"
                className="text-white/40 hover:text-white transition-colors no-underline"
              >
                +7 771 624 64 61
              </a>
              <a
                href="mailto:zeroprint.kz@gmail.com"
                className="text-white/40 hover:text-white transition-colors no-underline"
              >
                zeroprint.kz@gmail.com
              </a>
              <span>ул. Радостовца 152/6, офис 104, Алматы</span>
            </div>
          </div>
        </footer>

        {/* ── FLOATING WHATSAPP ───────────────────────────────────────── */}
        <a
          href={wa("Здравствуйте! Хочу заказать вышивку.")}
          target="_blank"
          rel="noreferrer"
          title="WhatsApp"
          className="wa-float fixed bottom-7 right-7 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(37,211,102,0.5)] lg:bottom-8 lg:right-8"
        >
          <WaIcon size={26} color="white" />
        </a>
      </div>
    </>
  );
}

// ─── SVG Icon components ─────────────────────────────────────────────────────
function WaIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-full h-full"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-full h-full"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-full h-full"
    >
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-full h-full"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-full h-full"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}
