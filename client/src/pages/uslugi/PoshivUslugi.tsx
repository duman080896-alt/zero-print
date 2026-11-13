/**
 * PoshivUslugi.tsx — продающая страница услуги пошива
 * Route: /uslugi/poshiv
 *
 * Hero: команда в униформах (вырезанное фото) на фоне гигантского слова «ПОШИВ».
 * Цены «от» подтверждены владельцем. Факты компании — из @shared/site.
 */

import { useState, useEffect } from "react";
import "./PoshivUslugi.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { COMPANY, SITE_URL, BUSINESS_ID } from "@shared/site";

const wa = (msg: string) =>
  `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`;

// ─── Появление секций при прокрутке ─────────────────────────────────────────
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
    document.querySelectorAll(".reveal, .stagger").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── Что шьём: фото из каталога (фон вырезан), цены «от» подтверждены ───────
interface Item {
  id: string;
  name: string;
  price?: number;
  img: string;
  w: number;
  h: number;
}

const ITEMS: Item[] = [
  { id: "futbolki", name: "Футболки", price: 2500, img: "futbolki-3", w: 657, h: 738 },
  { id: "polo", name: "Поло", price: 2500, img: "polo-0", w: 625, h: 750 },
  { id: "longslivy", name: "Лонгсливы", img: "longslivy-0", w: 605, h: 750 },
  { id: "svitshoty", name: "Свитшоты", price: 5000, img: "svitshoty-1", w: 639, h: 750 },
  { id: "hudi", name: "Худи", price: 5000, img: "hudi-0", w: 597, h: 750 },
  { id: "shtany", name: "Штаны и шорты", img: "shtany-2", w: 279, h: 750 },
  { id: "bombery", name: "Бомберы", price: 7000, img: "bombery-0", w: 585, h: 750 },
  { id: "softshell", name: "Софтшелл и ветровки", price: 7000, img: "softshell-1", w: 583, h: 750 },
  { id: "uteplennye", name: "Утеплённые куртки", price: 7000, img: "uteplennye-2", w: 622, h: 728 },
  { id: "zhilety", name: "Жилеты", price: 7000, img: "zhilety-2", w: 419, h: 749 },
  { id: "flis", name: "Флисовые кофты", price: 3500, img: "flis-0", w: 624, h: 749 },
  { id: "signalnye-zhilety", name: "Сигнальные жилеты", price: 6000, img: "signalnye-zhilety-0", w: 518, h: 750 },
  { id: "rabochie-bryuki", name: "Брюки и комбинезоны", price: 6000, img: "rabochie-bryuki-0", w: 299, h: 750 },
  { id: "rubashki", name: "Форменные рубашки", img: "rubashki-1", w: 496, h: 738 },
  { id: "fartuki", name: "Фартуки", img: "fartuki-2", w: 241, h: 750 },
  { id: "khalaty", name: "Медицинские халаты", price: 4000, img: "khalaty-1", w: 560, h: 747 },
];

const fmtPrice = (p?: number) =>
  p ? `от ${p.toLocaleString("ru-RU").replace(/ /g, " ")} ₸/шт` : "Цена по ТЗ";

// ─── Ткани ──────────────────────────────────────────────────────────────────
const FABRICS = [
  { file: "kulirka", name: "Кулирная гладь", use: "футболки, лонгсливы" },
  { file: "french-terry", name: "Френч терри", use: "футболки, худи" },
  { file: "pike", name: "Пике", use: "поло" },
  { file: "futer-3", name: "Футер 3-х нитка", use: "худи, свитшоты, штаны" },
  { file: "futer-nachyos", name: "Футер с начёсом", use: "тёплые худи и свитшоты" },
  { file: "velvet", name: "Вельвет", use: "рубашки, кепки" },
  { file: "plashevka", name: "Плащевые ткани", use: "ветровки, бомберы, дождевики" },
  { file: "flis", name: "Флис", use: "кофты, жилеты, подклад" },
  { file: "sherpa", name: "Шерпа", use: "утеплённые куртки" },
  { file: "tyvek", name: "Тайвек", use: "дождевики, сумки" },
];

// ─── Нанесение логотипа ─────────────────────────────────────────────────────
const BRANDING: { name: string; desc: string; href?: string }[] = [
  { name: "Вышивка", desc: "Держится весь срок службы изделия, выдерживает 100+ стирок", href: "/uslugi/vyshivka" },
  { name: "ДТФ-печать", desc: "Полноцветные макеты любой сложности, фотографическое качество", href: "/uslugi/pechat" },
  { name: "Шелкография", desc: "Выгодна на больших тиражах, плотные насыщенные цвета" },
  { name: "ПВХ-шильды и шевроны", desc: "Объёмный логотип для курток, жилетов и спецодежды" },
  { name: "Светоотражающая печать", desc: "Для сигнальных жилетов и формы дорожных служб" },
  { name: "Жаккардовые лейблы", desc: "Фирменные ярлыки и бирки — как у фабричной одежды" },
];

// ─── Этапы ──────────────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", title: "Заявка", text: `Напишите в WhatsApp или оставьте заявку — отвечаем за ${COMPANY.responseMinutes} минуты.` },
  { n: "02", title: "Расчёт и КП", text: "Уточним ткань, тираж и нанесение, пришлём коммерческое предложение с точной ценой." },
  { n: "03", title: "Производство", text: "Разработаем лекала, отошьём тираж в собственном цеху и нанесём логотип." },
  { n: "04", title: "Доставка", text: "Заберёте в Алматы или отправим транспортной компанией в любой город Казахстана." },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Нужно ли предоставлять лекала и выкройки?",
    a: "Нет. Разрабатываем лекала и технический дизайн бесплатно по вашему ТЗ: достаточно описать изделие или показать пример.",
  },
  {
    q: "Какой минимальный заказ?",
    a: `Шьём от ${COMPANY.minRun} штук. Оптовый тираж — от ${COMPANY.wholesaleRun} штук, на него действует скидка 15%.`,
  },
  {
    q: "Сколько стоит пошив с нанесением логотипа?",
    a: "Пошив и нанесение (вышивка или печать) считаем вместе — цена зависит от ткани, тиража и размера логотипа. Напишите нам, и менеджер пришлёт точный расчёт в коммерческом предложении.",
  },
  {
    q: "Какие ткани используете?",
    a: "Кулирная гладь, пике, футер, френч терри, флис, софтшелл, плащевые и смесовые ткани, шерпа, тайвек и другие. Подберём ткань под ваш бюджет и условия носки или закупим по вашему ТЗ.",
  },
  {
    q: "Шьёте ли зимнюю и летнюю спецодежду?",
    a: "Да, это одно из основных направлений. Летняя спецодежда: рабочие костюмы, халаты, сигнальные жилеты, фартуки. Зимняя: утеплённые куртки, полукомбинезоны, утеплённые жилеты. Комбинезоны любого кроя шьём по вашему ТЗ, со светоотражающими полосами и логотипом компании.",
  },
  {
    q: "Сколько времени занимает пошив?",
    a: "Срок зависит от тиража и сложности изделия — его фиксируем в коммерческом предложении и договоре до старта производства.",
  },
  {
    q: "Можно ли сначала отшить образец?",
    a: "Да. Перед запуском тиража согласовываем образец, чтобы вы проверили посадку, ткань и качество нанесения.",
  },
  {
    q: "Вы работаете с юридическими лицами?",
    a: "Да. Договор, счёт на оплату, счёт-фактура, акт выполненных работ — предоставляем полный пакет закрывающих документов.",
  },
  {
    q: "Доставляете в другие города Казахстана?",
    a: "Да. Производство находится в Алматы, готовые тиражи отправляем транспортными компаниями в Астану, Шымкент, Караганду, Актобе и другие города.",
  },
];

// ─── JSON-LD ────────────────────────────────────────────────────────────────
const JSON_LD = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Пошив корпоративной одежды и спецодежды",
    serviceType: "Пошив одежды на заказ",
    url: `${SITE_URL}/uslugi/poshiv`,
    provider: { "@id": BUSINESS_ID },
    areaServed: "Казахстан",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Пошив одежды",
      itemListElement: ITEMS.filter((i) => i.price).map((i) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: `Пошив: ${i.name.toLowerCase()}` },
        price: i.price,
        priceCurrency: "KZT",
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Услуги", item: `${SITE_URL}/uslugi` },
      { "@type": "ListItem", position: 3, name: "Пошив одежды", item: `${SITE_URL}/uslugi/poshiv` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
]);

const heading = { fontFamily: "Montserrat, sans-serif" };

// ─────────────────────────────────────────────────────────────────────────────
export default function PoshivUslugi() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEO(
    "Пошив корпоративной одежды и спецодежды в Алматы | ZERO PRINT",
    "Пошив футболок, худи, поло, курток, жилетов, зимней и летней спецодежды, комбинезонов. Собственный цех в Алматы, от 10 штук, доставка по Казахстану.",
    "пошив одежды на заказ Алматы, пошив корпоративной одежды, швейный цех Алматы, пошив спецодежды Казахстан, пошив зимней спецодежды, пошив комбинезонов, пошив худи на заказ",
  );

  useScrollReveal();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const get = (sel: string) => (f.querySelector(sel) as HTMLInputElement | null)?.value ?? "";
    const msg =
      `Здравствуйте! Хочу заказать пошив.\n` +
      `Изделие: ${get("select[name=product]")}\n` +
      `Количество: ${get("select[name=qty]")}\n` +
      `Имя: ${get("input[name=name]")}\n` +
      `Телефон: ${get("input[name=phone]")}` +
      (get("textarea[name=comment]") ? `\nКомментарий: ${get("textarea[name=comment]")}` : "");
    window.open(wa(msg), "_blank");
  };

  return (
    <div className="poshiv-page font-sans text-[#0F172A] bg-white overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative bg-[#F4F3F1] overflow-hidden">
        {/* Хлебные крошки */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-4 text-xs text-gray-400 flex items-center gap-1.5 relative z-10">
          <a href="/" className="hover:text-gray-700 no-underline transition-colors">Главная</a>
          <span>/</span>
          <a href="/uslugi" className="hover:text-gray-700 no-underline transition-colors">Услуги</a>
          <span>/</span>
          <span className="text-gray-600 font-medium">Пошив одежды</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 lg:pt-12 text-center relative z-10">
          <p className="text-[11px] sm:text-xs font-bold tracking-[3px] uppercase text-[#E8500A] mb-4">
            Собственный швейный цех · Алматы · от {COMPANY.minRun} штук
          </p>
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.08] mb-4"
            style={heading}
          >
            Пошив корпоративной одежды<br className="hidden sm:block" /> и спецодежды
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto mb-7 leading-relaxed">
            Полный цикл под ключ: разработаем лекала, отошьём тираж и нанесём логотип.
            Форма, в которой вашу команду узнают.
          </p>
          <div className="flex gap-3 flex-wrap justify-center mb-2">
            <a
              href="#zayavka"
              className="bg-[#E8500A] hover:bg-[#cf4708] text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(232,80,10,0.35)] no-underline text-sm"
              style={heading}
            >
              Получить расчёт
            </a>
            <a
              href={wa("Здравствуйте! Хочу заказать пошив корпоративной одежды.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-[#0F172A] font-bold px-6 py-4 rounded-xl transition-all no-underline text-sm"
            >
              <WaIcon size={18} color="#25D366" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Команда на фоне слова ПОШИВ */}
        <div className="relative max-w-5xl mx-auto px-4 mt-2 sm:mt-0">
          <span aria-hidden="true" className="poshiv-hero-word">ПОШИВ</span>
          <div className="poshiv-hero-floor" />
          <img
            src="/poshiv/hero-people.webp"
            srcSet="/poshiv/hero-people-700.webp 700w, /poshiv/hero-people.webp 1035w"
            sizes="(max-width: 640px) 94vw, 900px"
            width={1035}
            height={673}
            alt="Команда сотрудников в корпоративной одежде и спецодежде, сшитой в цеху ZERO PRINT"
            className="relative z-10 w-full max-w-[900px] mx-auto block"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {/* Цифры */}
        <div className="relative z-10 bg-[#0F1F3D] text-white">
          <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: `${COMPANY.clientsLabel}`, label: "компаний-клиентов" },
              { value: COMPANY.yearsLabel, label: "на рынке Казахстана" },
              { value: `от ${COMPANY.minRun} шт`, label: `минимальный заказ · опт от ${COMPANY.wholesaleRun}` },
              { value: `${COMPANY.responseMinutes} мин`, label: "скорость ответа" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl sm:text-3xl font-black" style={heading}>{value}</div>
                <div className="text-[11px] sm:text-xs text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ──────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex gap-2 shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">
        <a
          href="#zayavka"
          className="flex-1 text-center bg-[#E8500A] hover:bg-[#cf4708] text-white font-bold text-sm py-3.5 rounded-xl transition-colors no-underline"
          style={heading}
        >
          Получить расчёт
        </a>
        <a
          href={wa("Здравствуйте! Хочу заказать пошив корпоративной одежды.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Написать в WhatsApp"
          className="flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-3.5 rounded-xl no-underline"
        >
          <WaIcon size={20} color="white" />
        </a>
      </div>

      {/* ── ЧТО ШЬЁМ ───────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center reveal mb-10">
            <p className="text-xs font-bold tracking-[2.5px] uppercase text-[#E8500A] mb-3">Что шьём</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={heading}>16 видов изделий — под ваш бренд</h2>
            <p className="text-gray-500">Повседневная одежда, куртки, зимняя и летняя спецодежда. Цвет, ткань и крой — под ваше ТЗ</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ITEMS.map((item) => (
              <a
                key={item.id}
                href={wa(`Здравствуйте! Интересует пошив: ${item.name.toLowerCase()}. Посчитайте, пожалуйста, стоимость.`)}
                target="_blank"
                rel="noreferrer"
                className="group bg-[#F6F5F2] rounded-2xl p-4 sm:p-5 no-underline text-[#0F172A] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-40 sm:h-52 flex items-end justify-center mb-4">
                  <img
                    src={`/poshiv/rail/${item.img}.webp`}
                    width={item.w}
                    height={item.h}
                    alt={`${item.name} — пошив на заказ в ZERO PRINT`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_12px_16px_rgba(15,23,42,0.12)]"
                  />
                </div>
                <div className="font-bold text-sm sm:text-base leading-snug" style={heading}>{item.name}</div>
                <div className={`text-sm mt-1 font-semibold ${item.price ? "text-[#E8500A]" : "text-gray-400"}`}>
                  {fmtPrice(item.price)}
                </div>
                <div className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Рассчитать в WhatsApp →
                </div>
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            * Цена «от» — при оптовом тираже, без нанесения. Точную стоимость под ваш заказ пришлём в КП.
          </p>
        </div>
      </section>

      {/* ── ТКАНИ ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-10">
            <p className="text-xs font-bold tracking-[2.5px] uppercase text-[#E8500A] mb-3">Материалы</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={heading}>Ткани, с которыми работаем</h2>
            <p className="text-gray-500 mt-3">Подберём под изделие и бюджет — или закупим по вашему ТЗ</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger">
            {FABRICS.map(({ file, name, use }) => (
              <div key={file} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <img
                  src={`/poshiv/tkan-${file}.webp`}
                  width={240}
                  height={237}
                  alt={`Ткань ${name}`}
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-sm leading-tight" style={heading}>{name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">{use}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── НАНЕСЕНИЕ ──────────────────────────────────────────────────── */}
      <section className="bg-[#0F1F3D] py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-10 text-center">
            <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-400 mb-3">Брендирование</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={heading}>Нанесём логотип сразу в цеху</h2>
            <p className="text-white/50 mt-3">Пошив и брендирование в одном месте — без лишних подрядчиков</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {BRANDING.map(({ name, desc, href }) => {
              const inner = (
                <>
                  <div className="font-bold text-white text-lg mb-1.5" style={heading}>
                    {name}
                    {href && <span className="text-orange-400 ml-2 text-sm">→</span>}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </>
              );
              const cls = "block bg-white/5 border border-white/10 rounded-2xl p-6 no-underline transition-colors";
              return href ? (
                <a key={name} href={href} className={`${cls} hover:bg-white/10 hover:border-orange-400/40`}>{inner}</a>
              ) : (
                <div key={name} className={cls}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── КАК РАБОТАЕМ ───────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-10">
            <p className="text-xs font-bold tracking-[2.5px] uppercase text-[#E8500A] mb-3">Как работаем</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={heading}>От заявки до готовой формы — 4 шага</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {STEPS.map(({ n, title, text }) => (
              <div key={n} className="bg-gray-50 rounded-2xl p-7">
                <div className="text-5xl font-black text-gray-200 mb-4 leading-none" style={heading}>{n}</div>
                <h3 className="font-bold text-lg mb-2" style={heading}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПОЧЕМУ ZERO PRINT ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-10 text-center">
            <p className="text-xs font-bold tracking-[2.5px] uppercase text-[#E8500A] mb-3">Почему мы</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={heading}>Почему заказывают у ZERO PRINT</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {[
              { title: "Собственное производство", text: "Свой швейный цех в Алматы — контролируем качество и сроки сами, без перекупщиков." },
              { title: "Полный цикл", text: "Лекала, пошив, нанесение логотипа и доставка — один подрядчик вместо трёх." },
              { title: "Дизайн и лекала бесплатно", text: "Разработаем макет и техдизайн на основе вашего логотипа и ТЗ." },
              { title: "Работаем с юрлицами", text: "Договор, счёт-фактура, акт, НДС — полный пакет закрывающих документов." },
              { title: "Гарантия качества", text: "Согласовываем образец до тиража. Если брак по нашей вине — переделаем бесплатно." },
              { title: "Доставка по Казахстану", text: "Алматы, Астана, Шымкент, Караганда и все остальные города — транспортными компаниями." },
            ].map(({ title, text }) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-sm">
                <h3 className="font-bold text-lg mb-2" style={heading}>{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── НАШИ РАБОТЫ ────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 reveal">
            <div>
              <p className="text-xs font-bold tracking-[2.5px] uppercase text-[#E8500A] mb-2">Портфолио</p>
              <h2 className="text-3xl sm:text-4xl font-black" style={heading}>Наши работы</h2>
            </div>
            <a
              href={wa("Здравствуйте! Пришлите, пожалуйста, портфолио пошива.")}
              target="_blank"
              rel="noreferrer"
              className="text-[#E8500A] font-bold text-sm no-underline hover:text-[#cf4708] whitespace-nowrap"
            >
              Запросить полное портфолио →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {[
              { img: "raboty-futbolki", alt: "Футболки с печатью и фирменными лейблами, сшитые в ZERO PRINT" },
              { img: "raboty-hudi", alt: "Корпоративные худи с вышивкой логотипа" },
              { img: "raboty-svitshoty", alt: "Свитшоты с брендированием для команды" },
              { img: "raboty-kurtki", alt: "Лёгкие куртки и ветровки с логотипом компании" },
              { img: "raboty-uteplennye", alt: "Утеплённые куртки для работы на улице" },
              { img: "raboty-longslivy", alt: "Лонгсливы с печатью, пошив на заказ" },
            ].map(({ img, alt }) => (
              <div key={img} className="overflow-hidden rounded-2xl bg-gray-100 group">
                <img
                  src={`/poshiv/${img}.webp`}
                  width={1200}
                  height={610}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-gray-50 py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-8">
            <p className="text-xs font-bold tracking-[2.5px] uppercase text-[#E8500A] mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={heading}>Частые вопросы о пошиве</h2>
          </div>
          <div className="flex flex-col divide-y divide-gray-200 reveal">
            {FAQS.map(({ q, a }, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full py-5 text-left font-bold text-base flex justify-between items-center gap-4 transition-colors cursor-pointer bg-transparent border-0 outline-none hover:text-[#E8500A]"
                  style={heading}
                >
                  {q}
                  <span className={`text-[#E8500A] text-xl flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`poshiv-faq-answer text-gray-500 text-base leading-relaxed ${openFaq === i ? "open" : ""}`}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ФОРМА ──────────────────────────────────────────────────────── */}
      <section id="zayavka" className="bg-[#0F1F3D] py-16 lg:py-20 px-6 lg:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="reveal">
            <p className="text-xs font-bold tracking-[2.5px] uppercase text-orange-400 mb-4">Заявка</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={heading}>
              Рассчитайте стоимость пошива
            </h2>
            <p className="text-white/50 text-lg mb-8">
              Ответим за {COMPANY.responseMinutes} минуты и пришлём КП с точной ценой
            </p>
            <ul className="flex flex-col gap-4">
              {[
                "Лекала и дизайн-макет — бесплатно",
                `Тираж от ${COMPANY.minRun} штук, опт от ${COMPANY.wholesaleRun}`,
                "Образец до запуска тиража",
                "Договор, счёт-фактура, НДС",
                "Доставка по всему Казахстану",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 stroke-orange-400 fill-none" strokeWidth="2"><polyline points="1,4 3.5,7 9,1" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 reveal">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Что шьём</label>
                  <select name="product" className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#E8500A] transition-all text-gray-700">
                    {[...ITEMS.map((i) => i.name), "Комбинезоны", "Другое"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Количество</label>
                  <select name="qty" className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#E8500A] transition-all text-gray-700">
                    {["10–49", "50–199", "200–499", "500–999", "1000+"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Имя *</label>
                  <input name="name" type="text" placeholder="Как к вам обращаться" required className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#E8500A] focus:ring-2 focus:ring-[#E8500A]/10 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Телефон *</label>
                  <input name="phone" type="tel" placeholder="+7 ___ ___ __ __" required className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#E8500A] focus:ring-2 focus:ring-[#E8500A]/10 transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Комментарий</label>
                <textarea name="comment" placeholder="Ткань, цвета, логотип, сроки..." rows={3} className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#E8500A] focus:ring-2 focus:ring-[#E8500A]/10 transition-all resize-none" />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#E8500A] hover:bg-[#cf4708] text-white font-bold text-base rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer border-0 shadow-[0_4px_20px_rgba(232,80,10,0.4)] flex items-center justify-center gap-2"
                style={heading}
              >
                <WaIcon size={18} color="white" /> Получить расчёт в WhatsApp
              </button>
              <p className="text-center text-xs text-gray-400">
                Заявка откроется в WhatsApp — обычно отвечаем за {COMPANY.responseMinutes} минуты
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ── SEO-ТЕКСТ ──────────────────────────────────────────────────── */}
      <section className="py-14 px-6 lg:px-12 pb-28 lg:pb-14">
        <div className="max-w-3xl mx-auto text-sm text-gray-500 leading-relaxed flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[#0F172A]" style={heading}>Пошив корпоративной одежды на заказ в Алматы</h3>
          <p>
            ZERO PRINT — собственный швейный цех в Алматы. Шьём корпоративную одежду любой сложности:
            от футболок и поло до зимней и летней спецодежды, комбинезонов, утеплённых курток и
            медицинских халатов. Минимальный тираж — от {COMPANY.minRun} штук, оптовый — от {COMPANY.wholesaleRun} штук.
          </p>
          <p>
            Предлагаем полный цикл производства: разработка лекал и дизайна, подбор тканей и фурнитуры,
            пошив, нанесение логотипа (вышивка, ДТФ-печать, шелкография) и доставка по всему Казахстану.
            Пошив и брендирование в одном цеху — вы экономите время и получаете единое качество.
          </p>
          <p>
            Работаем с юридическими лицами и ИП по всему Казахстану: договор, счёт-фактура, акт
            выполненных работ и все закрывающие документы для бухгалтерии. Офис и производство —
            Алматы, {COMPANY.address.streetAddress}.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── WhatsApp icon ───────────────────────────────────────────────────────────
function WaIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
