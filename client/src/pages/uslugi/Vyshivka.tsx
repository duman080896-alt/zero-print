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
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      {/* ── HEAD META (if using react-helmet) ─────────────────────────── */}
      {/* <Helmet>
        <title>Вышивка логотипа на одежде в Алматы | ZERO PRINT</title>
        <meta name="description" content="Вышивка логотипа на корпоративной одежде в Алматы. От 100 шт." />
        <link rel="canonical" href="https://zeroprint.kz/uslugi/vyshivka" />
      </Helmet> */}

      <div className="font-sans text-black bg-white overflow-x-hidden">
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <header
          className={`sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}
        >
          <a
            href="https://zeroprint.kz"
            className="font-black text-xl tracking-widest no-underline text-black"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            ZERO
            <span className="bg-black text-white px-1.5 py-0.5 rounded-sm">
              PRINT
            </span>
          </a>
          <div className="flex items-center gap-4">
            <a
              href="tel:+77716246461"
              className="text-black font-semibold text-sm hover:text-blue-700 transition-colors hidden sm:block"
            >
              +7 771 624 64 61
            </a>
            <a
              href="https://wa.me/77716246461"
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-5 py-2 rounded-lg transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </header>

        {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-blue-700 to-[#1E3A5F] px-8 py-2.5 text-sm text-white/70">
          <a
            href="https://zeroprint.kz"
            className="text-white/65 hover:text-white no-underline"
          >
            Главная
          </a>
          {" / "}
          <a
            href="https://zeroprint.kz/uslugi"
            className="text-white/65 hover:text-white no-underline"
          >
            Услуги
          </a>
          {" / "}
          <span className="text-white font-semibold">Вышивка на одежде</span>
        </div>

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-[#1E3A5F] text-white px-8 py-20 text-center">
          {/* animated dot grid */}
          <div className="absolute inset-0 pointer-events-none hero-dots" />
          {/* floating shapes */}
          <div
            className="hero-shape absolute w-[340px] h-[340px] -top-20 -left-20"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="hero-shape absolute w-[220px] h-[220px] -bottom-16 right-[10%]"
            style={{ animationDelay: "-3s" }}
          />
          <div
            className="hero-shape absolute w-[160px] h-[160px] top-[30%] -right-10"
            style={{ animationDelay: "-5s" }}
          />

          <div className="relative z-10">
            <span className="hero-tag inline-block bg-orange-500 text-white text-xs font-bold px-5 py-2 rounded-full mb-7 tracking-wide">
              Производство в Алматы · Казахстан
            </span>

            <h1
              className="hero-h1 text-4xl sm:text-5xl lg:text-6xl font-black max-w-3xl mx-auto mb-5 leading-tight"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Вышивка <span className="text-orange-400">логотипа</span>
              <br />
              на одежде в Алматы, Казахстан
            </h1>

            <p className="hero-sub text-lg sm:text-xl text-white/70 max-w-lg mx-auto mb-4">
              От 1 штуки — без минимального тиража. Срок от 3 рабочих дней, цена
              фиксируется до старта. Работаем по всему Казахстану.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-5 py-2.5 mb-7">
              <span
                className="text-orange-400 font-black text-xl"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                от 500 ₸
              </span>
              <span className="text-white/60 text-sm">
                за изделие · тираж от 50 шт
              </span>
            </div>

            {/* checkpoints */}
            <div className="hero-checks inline-flex flex-col items-start gap-3 bg-white/[0.09] border border-white/20 rounded-xl px-8 py-5 mb-10 text-left">
              {[
                "От 1 штуки — шеврон, нашивка, вышивка на кепке или халате без ограничений по тиражу",
                "Срок от 3 дней — для срочных заказов корпоративной и рабочей формы",
                "Оцифровка логотипа бесплатно — при заказе от 50 изделий",
                "Документы для бухгалтерии — договор, счёт-фактура, НДС",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 text-base">
                  <span className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      viewBox="0 0 12 10"
                      className="w-3 h-3 stroke-white fill-none"
                      strokeWidth="2.5"
                    >
                      <polyline points="1,5 4,9 11,1" />
                    </svg>
                  </span>
                  {text}
                </div>
              ))}
            </div>

            {/* stats */}
            <div
              ref={statsRef}
              className="hero-stats flex justify-center gap-14 flex-wrap mb-11"
            >
              {[
                {
                  value: c500 >= 500 ? "500+" : c500,
                  label: "компаний-клиентов",
                },
                {
                  value:
                    c5m >= 5000000
                      ? "5M+"
                      : c5m >= 1000000
                        ? `${Math.round(c5m / 1000000)}M`
                        : c5m >= 1000
                          ? `${Math.round(c5m / 1000)}K`
                          : c5m,
                  label: "изделий выполнено",
                },
                { value: c5 >= 5 ? "5" : c5, label: "лет на рынке Казахстана" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <span
                    className="block text-4xl font-black"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {value}
                  </span>
                  <span className="text-sm text-white/60">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="hero-cta flex gap-4 justify-center flex-wrap">
              <a
                href="#form"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-9 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_6px_24px_rgba(249,115,22,0.45)] hover:shadow-[0_10px_32px_rgba(249,115,22,0.55)]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Получить расчёт за 30 минут
              </a>
              <a
                href={wa("Здравствуйте! Хочу заказать вышивку логотипа.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_6px_24px_rgba(37,211,102,0.35)]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <WaIcon /> WhatsApp
              </a>
            </div>

            <div className="hero-gift gift-pulse inline-block mt-5 border border-orange-400/50 text-orange-200 text-xs font-semibold px-5 py-2 rounded-full">
              🎁 Бесплатный образец при заказе от 200 шт
            </div>
          </div>
        </section>

        {/* ── PHOTO STRIP ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 h-48 sm:h-64 overflow-hidden">
          {[
            { img: "/photos/5467823195986529896.jpg", label: "Поло" },
            { img: "/photos/5467823195986529869.jpg", label: "Свитшоты" },
            { img: "/photos/5274080859101273290.jpg", label: "Кепки" },
            { img: "/photos/5467823195986529947.jpg", label: "Спецодежда" },
          ].map(({ img, label }) => (
            <div key={label} className="relative overflow-hidden group">
              <img
                src={img}
                alt={label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3D]/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-white text-xs font-bold uppercase tracking-widest z-10">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── TRUST BAR ──────────────────────────────────────────────── */}
        <div className="bg-gray-50 border-t-[3px] border-orange-500 px-8 py-4 flex justify-center gap-10 flex-wrap">
          {[
            { icon: <ShieldIcon />, text: "Собственное производство" },
            { icon: <BoxIcon />, text: "Заказ от 1 шт" },
            { icon: <TruckIcon />, text: "Доставка по Казахстану" },
            { icon: <ClockIcon />, text: "Срок: от 7 дней" },
            { icon: <CheckCircleIcon />, text: "Контроль качества" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2.5 text-sm font-medium text-gray-500"
            >
              <span className="text-orange-500 w-5 h-5 flex-shrink-0">
                {icon}
              </span>
              {text}
            </div>
          ))}
        </div>

        {/* ── FOR WHOM ───────────────────────────────────────────────── */}
        <div className="py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="reveal mb-10 text-center">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                Для кого
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Кому подходит вышивка
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
              {[
                {
                  icon: "🍽️",
                  title: "Рестораны и HoReCa",
                  text: "Кепки, фартуки, рубашки с логотипом — единый стиль для персонала зала и кухни.",
                },
                {
                  icon: "🏗️",
                  title: "Строительство и производство",
                  text: "Нашивки и шевроны на спецодежду: жилеты, куртки, комбинезоны. Держатся годами.",
                },
                {
                  icon: "💼",
                  title: "Офис и корпоративный сектор",
                  text: "Брендированные поло, бомберы, рубашки для команды, выставок и мероприятий.",
                },
                {
                  icon: "⚽",
                  title: "Спорт и фитнес",
                  text: "Клубная форма, командные комплекты, одежда для тренеров — с лого на груди или рукаве.",
                },
              ].map(({ icon, title, text }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-100 rounded-xl p-7 transition-all duration-300 hover:border-orange-500 hover:shadow-[0_8px_32px_rgba(249,115,22,0.12)] hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl mb-4">
                    {icon}
                  </div>
                  <h3
                    className="font-bold text-base mb-2"
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

        {/* ── PRICING ────────────────────────────────────────────────── */}
        <div className="bg-[#0F1F3D] py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center reveal mb-12">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                Стоимость
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black text-white mb-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Ориентировочные цены на вышивку
              </h2>
              <p className="text-white/60 text-base">
                Прозрачное ценообразование — без скрытых комиссий
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger">
              {PRICING.map((p) => (
                <div
                  key={p.type}
                  className={`relative rounded-2xl p-9 border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    p.hot
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-orange-500"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wide px-4 py-1 rounded-full whitespace-nowrap">
                      {p.badge}
                    </span>
                  )}
                  <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-3">
                    {p.type}
                  </p>
                  <p
                    className="text-white font-black text-4xl leading-none mb-1.5"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {p.price}
                  </p>
                  <p className="text-white/40 text-xs mb-6">{p.unit}</p>
                  <ul className="flex flex-col gap-2.5 mb-7">
                    {p.items.map((item) => (
                      <li
                        key={item}
                        className="text-white/80 text-sm flex gap-2.5 items-start"
                      >
                        <span className="text-green-400 font-bold mt-0.5">
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
                    className="block text-center py-3 rounded-lg font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white transition-colors no-underline"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {p.cta.label}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-white/25 mt-6">
              * Точная стоимость зависит от сложности логотипа, количества
              цветов и вида изделия. Цены в тенге без НДС.
            </p>
          </div>
        </div>

        {/* ── WHY EMBROIDERY ─────────────────────────────────────────── */}
        <div className="bg-gray-50 py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="reveal mb-12">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                Почему вышивка
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black mb-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Вышивка — это инвестиция
                <br />в репутацию бренда
              </h2>
              <p className="text-gray-500 text-lg max-w-lg">
                В отличие от печати, вышивка сохраняет вид на весь срок службы
                изделия
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger mb-12">
              {[
                {
                  icon: "⏳",
                  title: "Служит весь срок изделия",
                  text: "Вышитый логотип не выцветет и не облезет. Нитки держатся столько же, сколько сама ткань.",
                },
                {
                  icon: "💎",
                  title: "Премиальный внешний вид",
                  text: "Вышивка воспринимается как дорогой брендинг. Идеально для форменной одежды и корпоративных подарков.",
                },
                {
                  icon: "🧺",
                  title: "Выдерживает 100+ стирок",
                  text: "Машинная стирка и химчистка не страшны. Идеально для спецодежды и рабочей формы.",
                },
                {
                  icon: "🎨",
                  title: "Объём и фактура",
                  text: "3D-вышивка создаёт тактильный эффект. Логотип буквально «выступает» над тканью.",
                },
              ].map(({ icon, title, text }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-100 rounded-xl p-8 transition-all duration-300 hover:border-orange-500 hover:shadow-[0_8px_32px_rgba(249,115,22,0.12)] hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-2xl mb-4">
                    {icon}
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

            {/* comparison table */}
            <div className="reveal overflow-x-auto rounded-xl shadow-md">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    {[
                      "Метод нанесения",
                      "Долговечность",
                      "Внешний вид",
                      "Стирки",
                      "Спецодежда",
                    ].map((h) => (
                      <th
                        key={h}
                        className="bg-black text-white font-bold px-5 py-4 text-left first:rounded-tl-xl last:rounded-tr-xl"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="cmp-highlight bg-orange-50">
                    <td className="px-5 py-3.5 border-b border-gray-100 font-bold text-orange-500">
                      Вышивка (ZERO PRINT)
                    </td>
                    <td className="px-5 py-3.5 border-b border-gray-100 font-bold text-green-600">
                      ★★★★★
                    </td>
                    <td className="px-5 py-3.5 border-b border-gray-100 font-bold text-green-600">
                      ★★★★★
                    </td>
                    <td className="px-5 py-3.5 border-b border-gray-100 font-bold text-green-600">
                      100+
                    </td>
                    <td className="px-5 py-3.5 border-b border-gray-100 font-bold text-green-600">
                      ✔
                    </td>
                  </tr>
                  {[
                    ["ДТФ-печать", "★★★☆☆", "★★★★☆", "40–60", "—"],
                    ["Шелкография", "★★★☆☆", "★★★☆☆", "30–50", "—"],
                    ["Термопечать", "★★☆☆☆", "★★★☆☆", "20–30", "—"],
                  ].map(([method, ...rest], i) => (
                    <tr
                      key={method}
                      className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-5 py-3.5 border-b border-gray-100">
                        {method}
                      </td>
                      {rest.map((cell) => (
                        <td
                          key={cell}
                          className="px-5 py-3.5 border-b border-gray-100 text-gray-400"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── TYPES ──────────────────────────────────────────────────── */}
        <div className="py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="reveal mb-10">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                Виды вышивки
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Выберите технику под ваш бренд
              </h2>
              <p className="text-gray-500 text-lg">
                Поможем подобрать нужный вид — бесплатно
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 stagger">
              {TYPES.map(({ num, name, desc, img }) => (
                <div
                  key={name}
                  className="relative overflow-hidden rounded-2xl min-h-[240px] flex flex-col justify-end p-6 cursor-default group transition-transform duration-300 hover:scale-[1.02]"
                >
                  <img
                    src={img}
                    alt={name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3D]/90 via-[#0F1F3D]/30 to-transparent" />
                  <span
                    className="absolute top-4 right-4 font-black text-4xl text-orange-500/30 z-10"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {num}
                  </span>
                  <div className="relative z-10">
                    <p
                      className="font-bold text-white text-base mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {name}
                    </p>
                    <p className="text-white/65 text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PORTFOLIO ──────────────────────────────────────────────── */}
        <div className="bg-gray-50 py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="reveal mb-10">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                Наши работы
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Вышивка для корпоративных клиентов
              </h2>
              <p className="text-gray-500 text-lg">
                Реализованные проекты для компаний Казахстана
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {PORTFOLIO.map(({ cat, title, meta, img }) => (
                <div
                  key={title}
                  className="relative overflow-hidden rounded-xl min-h-[220px] flex flex-col justify-end p-5 cursor-default group"
                >
                  <img
                    src={img}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-all duration-300 group-hover:from-[#1E3A5F]/90" />
                  <span className="absolute top-3.5 right-0 z-10 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wide px-3.5 py-1 rounded-l-sm">
                    Реализовано
                  </span>
                  <div className="relative z-10">
                    <p className="text-[11px] font-semibold text-white/55 uppercase tracking-wide mb-1">
                      {cat}
                    </p>
                    <p
                      className="font-bold text-white text-base mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {title}
                    </p>
                    <p className="text-white/55 text-xs">{meta}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-9 reveal">
              <p className="text-gray-500 text-sm mb-2">
                Хотите увидеть реальные фото наших работ?
              </p>
              <a
                href={wa("Здравствуйте! Пришлите портфолио вышивки.")}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 font-bold text-base no-underline hover:underline"
              >
                Написать нам — пришлём фото →
              </a>
            </div>
          </div>
        </div>

        {/* ── SOCIAL PROOF ───────────────────────────────────────────── */}
        <div className="bg-[#0F1F3D] py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <h3
              className="text-xl font-bold text-white text-center mb-9 reveal"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Нам доверяют компании Казахстана
            </h3>
            <div className="flex justify-center gap-3.5 flex-wrap mb-11 stagger">
              {[
                ["⛽", "Нефть и газ"],
                ["💻", "IT"],
                ["🏦", "Банки"],
                ["🏗️", "Строительство"],
                ["🏥", "Медицина"],
              ].map(([icon, name]) => (
                <div
                  key={name}
                  className="bg-white/[0.06] border border-white/10 text-white/75 rounded-xl px-6 py-4 text-sm font-medium text-center min-w-[120px] transition-all hover:bg-orange-500/10 hover:border-orange-500/50 hover:-translate-y-0.5 cursor-default"
                >
                  <span className="text-2xl block mb-1.5">{icon}</span>
                  {name}
                </div>
              ))}
            </div>
            <div className="max-w-xl mx-auto bg-white/[0.04] border border-white/10 border-l-[3px] border-l-orange-500 rounded-xl px-9 py-8 reveal">
              <div className="text-yellow-400 text-xl mb-3.5">★★★★★</div>
              <p className="text-white/85 text-base leading-relaxed italic mb-4">
                «Заказывали поло для всего офиса — 450 штук. Качество вышивки
                отличное, всё в срок. Уже третий раз работаем с ZERO PRINT —
                рекомендуем как надёжного партнёра для корпоративного мерча.»
              </p>
              <p className="text-white/45 text-sm">
                <strong className="text-white/75">Айгерим С.</strong>,
                руководитель HR-отдела, нефтяная компания, Алматы
              </p>
            </div>
          </div>
        </div>

        {/* ── PRODUCTS ───────────────────────────────────────────────── */}
        <div className="py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="reveal mb-10">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                На чём вышиваем
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Вышивка на любом изделии
              </h2>
              <p className="text-gray-500 text-lg">
                Работаем с вашим материалом или шьём с нуля
              </p>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3.5 stagger">
              {PRODUCTS.map(({ label, img }) => (
                <div
                  key={label}
                  className="relative overflow-hidden rounded-xl min-h-[140px] flex flex-col items-center justify-end pb-3.5 group transition-transform duration-200 hover:scale-105 cursor-default"
                >
                  <img
                    src={img}
                    alt={label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3D]/90 via-[#0F1F3D]/30 to-transparent" />
                  <span className="relative z-10 text-white text-xs font-bold text-center">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STEPS ──────────────────────────────────────────────────── */}
        <div className="bg-gray-50 py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="reveal mb-12">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                Как работаем
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                4 шага от заявки до готового мерча
              </h2>
              <p className="text-gray-500 text-lg">
                Простой процесс — без лишней бюрократии
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 stagger">
              {[
                {
                  n: "1",
                  title: "Заявка",
                  text: "Заполните форму или напишите в WhatsApp. Менеджер свяжется за 30 минут.",
                },
                {
                  n: "2",
                  title: "Макет",
                  text: "Оцифруем логотип, подберём цвета нитей. Пришлём макет на утверждение.",
                },
                {
                  n: "3",
                  title: "Производство",
                  text: "Запускаем тираж с контролем качества. Срок: от 7 рабочих дней.",
                },
                {
                  n: "4",
                  title: "Доставка",
                  text: "Доставляем по Алматы или отправляем транспортной компанией по Казахстану.",
                },
              ].map(({ n, title, text }) => (
                <div
                  key={n}
                  className="px-7 py-8 border-r border-gray-100 last:border-0"
                >
                  <div
                    className="w-13 h-13 rounded-full bg-gradient-to-br from-blue-700 to-[#1E3A5F] text-white font-black text-xl flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(29,78,216,0.35)]"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      width: 52,
                      height: 52,
                    }}
                  >
                    {n}
                  </div>
                  <h3
                    className="font-bold text-base mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <div className="py-20 px-8">
          <div className="max-w-3xl mx-auto">
            <div className="reveal mb-8">
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-500 mb-2">
                Частые вопросы
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Всё, что нужно знать про вышивку
              </h2>
            </div>
            <div className="flex flex-col gap-0.5 reveal">
              {FAQS.map(({ q, a }, i) => (
                <div
                  key={i}
                  className={`border rounded-lg overflow-hidden transition-colors duration-200 ${openFaq === i ? "border-orange-500" : "border-gray-100 hover:border-orange-300"}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full bg-white hover:bg-gray-50 px-6 py-5 text-left font-bold text-base flex justify-between items-center transition-colors cursor-pointer border-0 outline-none"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {q}
                    <span
                      className={`text-orange-500 text-2xl ml-4 flex-shrink-0 faq-icon ${openFaq === i ? "open" : ""}`}
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
        <section
          id="form"
          className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-[#1E3A5F] text-white py-20 px-8 text-center"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          <h2
            className="relative text-3xl sm:text-4xl font-black mb-3 reveal"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Рассчитайте стоимость за 30 минут
          </h2>
          <p className="relative text-white/60 text-lg mb-11 reveal">
            Менеджер свяжется и назовёт точную цену за 30 минут
          </p>

          <div className="relative grid grid-cols-1 md:grid-cols-[260px_1fr] max-w-2xl mx-auto reveal">
            {/* trust sidebar */}
            <div className="hidden md:block bg-white/[0.07] border border-white/10 rounded-tl-2xl rounded-bl-2xl p-8 text-left">
              <span className="inline-block bg-green-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-md mb-5">
                ⚡ Ответим за 30 минут
              </span>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&q=80"
                    alt="Менеджер"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">Дина</p>
                  <p className="text-white/45 text-xs">
                    Менеджер по корпоративным заказам
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Бесплатный макет вышивки",
                  "Договор и счёт-фактура с НДС",
                  "Пробный образец от 200 шт",
                  "Доставка по всему Казахстану",
                  "Работаем с юрлицами и ИП",
                ].map((item) => (
                  <li key={item} className="text-white/75 text-xs flex gap-2">
                    <span className="text-green-400 font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* form card */}
            <div className="bg-white rounded-2xl md:rounded-tl-none md:rounded-bl-none p-8 text-left">
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-orange-700 mb-5">
                🎁 Бесплатный макет вышивки при заказе
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      placeholder="Иван Иванов"
                      required
                      className="px-4 py-3 border border-gray-100 rounded-lg text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500">
                      Телефон / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="+7 771 000 00 00"
                      required
                      className="px-4 py-3 border border-gray-100 rounded-lg text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500">
                      Вид изделия
                    </label>
                    <select className="px-4 py-3 border border-gray-100 rounded-lg text-sm outline-none focus:border-orange-500 transition-all">
                      <option value="">Выберите...</option>
                      {[
                        "Поло",
                        "Худи / Свитшот",
                        "Куртка",
                        "Спецодежда",
                        "Кепка",
                        "Сумка / Рюкзак",
                        "Другое",
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500">
                      Количество (шт)
                    </label>
                    <select className="px-4 py-3 border border-gray-100 rounded-lg text-sm outline-none focus:border-orange-500 transition-all">
                      {["1–49", "50–199", "200–499", "500–1000", "1000+"].map(
                        (v) => (
                          <option key={v}>{v}</option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-4">
                  <label className="text-xs font-semibold text-gray-500">
                    Комментарий
                  </label>
                  <textarea
                    placeholder="Вид вышивки, размер логотипа, сроки..."
                    rows={3}
                    className="px-4 py-3 border border-gray-100 rounded-lg text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all resize-y"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-lg transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(249,115,22,0.4)] cursor-pointer border-0"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Получить расчёт стоимости →
                </button>
                <p className="text-center text-xs text-gray-400 mt-2.5">
                  Работаем с юрлицами и ИП. Договор, НДС. Не спамим.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <footer className="bg-[#0F1F3D] text-gray-400 py-9 px-8 text-center text-sm">
          <p>© 2026 ZERO PRINT — Корпоративный мерч и вышивка в Алматы</p>
          <p className="mt-2">
            ул. Радостовца 152/6, офис 104, Алматы &nbsp;|&nbsp;{" "}
            <a
              href="tel:+77716246461"
              className="text-gray-400 hover:text-white transition-colors no-underline"
            >
              +7 771 624 64 61
            </a>{" "}
            &nbsp;|&nbsp;{" "}
            <a
              href="mailto:zeroprint.kz@gmail.com"
              className="text-gray-400 hover:text-white transition-colors no-underline"
            >
              zeroprint.kz@gmail.com
            </a>
          </p>
          <p className="mt-2">
            <a
              href="https://zeroprint.kz"
              className="text-gray-400 hover:text-white transition-colors no-underline"
            >
              ← Вернуться на сайт
            </a>
          </p>
        </footer>

        {/* ── FLOATING WHATSAPP ───────────────────────────────────────── */}
        <a
          href={wa("Здравствуйте! Хочу заказать вышивку.")}
          target="_blank"
          rel="noreferrer"
          title="WhatsApp"
          className="wa-float fixed bottom-7 right-7 z-50 w-[62px] h-[62px] bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <WaIcon size={30} color="white" />
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
