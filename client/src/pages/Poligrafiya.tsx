import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { ChevronDown } from "lucide-react";

const WHATSAPP_NUMBER = "77716246461";
const BASE_URL = "https://zero-promo--duman080896.replit.app";

const printTypes = [
  { emoji: "📇", name: "Визитки", price: "от 5 000 ₸", unit: "за 100 шт", desc: "Матовые, глянцевые, Soft Touch" },
  { emoji: "📄", name: "Листовки и флаеры", price: "от 8 000 ₸", unit: "за 100 шт", desc: "А6, А5, А4. Любой тираж" },
  { emoji: "🖼️", name: "Баннеры и Roll-up", price: "от 3 000 ₸", unit: "за м²", desc: "Баннерная ткань, ПВХ, Roll-up стенд" },
  { emoji: "📗", name: "Буклеты и брошюры", price: "от 15 000 ₸", unit: "за 50 шт", desc: "2-складной, евро, А4" },
  { emoji: "📅", name: "Календари", price: "от 500 ₸", unit: "за шт", desc: "Настенные, карманные, квартальные" },
  { emoji: "🏷️", name: "Наклейки и стикеры", price: "от 3 000 ₸", unit: "за 100 шт", desc: "Контурная резка, УФ лак" },
  { emoji: "📁", name: "Папки и конверты", price: "от 20 000 ₸", unit: "за 50 шт", desc: "С логотипом компании" },
  { emoji: "📦", name: "Упаковка и пакеты", price: "от 1 000 ₸", unit: "за шт", desc: "Крафт, брендированные" },
];

const pricingData = [
  { emoji: "📇", product: "Визитки", min: "от 100 шт", term: "1-2 дня", price: "5 000 ₸" },
  { emoji: "📄", product: "Листовки А5", min: "от 100 шт", term: "1-3 дня", price: "8 000 ₸" },
  { emoji: "📄", product: "Листовки А4", min: "от 100 шт", term: "1-3 дня", price: "12 000 ₸" },
  { emoji: "🖼️", product: "Баннер ПВХ", min: "от 1 м²", term: "1-2 дня", price: "3 000 ₸/м²" },
  { emoji: "🖼️", product: "Roll-up стенд", min: "от 1 шт", term: "1-2 дня", price: "15 000 ₸" },
  { emoji: "📗", product: "Буклеты", min: "от 50 шт", term: "3-5 дней", price: "15 000 ₸" },
  { emoji: "📅", product: "Календари", min: "от 50 шт", term: "5-7 дней", price: "500 ₸/шт" },
  { emoji: "🏷️", product: "Наклейки", min: "от 100 шт", term: "2-3 дня", price: "3 000 ₸" },
  { emoji: "📦", product: "Пакеты", min: "от 100 шт", term: "5-7 дней", price: "1 000 ₸/шт" },
];

const circulationOptions = ["100", "250", "500", "1000", "2000"];
const productOptions = [
  "Визитки", "Листовки А6", "Листовки А5", "Листовки А4",
  "Баннер ПВХ", "Roll-up стенд", "Буклет", "Брошюра",
  "Корпоративный календарь", "Наклейки", "Папки",
  "Пакеты с логотипом", "Другое",
];

export default function Poligrafiya() {
  const [formData, setFormData] = useState({
    productType: "",
    circulation: "500",
    urgency: "standard",
    company: "",
    name: "",
    phone: "",
  });
  const [customCirc, setCustomCirc] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEO(
    "Полиграфия на заказ в Казахстане — печать оптом | ZERO PRINT",
    "Печать визиток, листовок, баннеров, буклетов, календарей оптом в Алматы. Срок от 1 дня. Работаем с юрлицами — счёт-фактура, НДС. Доставка по всему Казахстану. ☎ +7 771 624 64 61",
    "полиграфия Алматы, полиграфия Казахстан, печать визиток Алматы, листовки оптом Казахстан, баннеры на заказ, буклеты печать, календари корпоративные"
  );

  const buildWhatsAppUrl = (text: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  const handleOrderClick = (itemName: string) => {
    window.open(buildWhatsAppUrl(`Здравствуйте! Хочу заказать: ${itemName}. Прошу рассчитать стоимость.`), "_blank");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const circ = formData.circulation === "other" ? customCirc : formData.circulation;
    const urgencyText = formData.urgency === "urgent" ? "Срочно (4-8 часов) +30%" : "Стандарт (1-5 дней)";
    const msg = `Здравствуйте! Нужна полиграфия.\nВид: ${formData.productType}\nТираж: ${circ} шт.\nСрочность: ${urgencyText}\nКомпания: ${formData.company}\nИмя: ${formData.name}\nТел: ${formData.phone}`;
    window.open(buildWhatsAppUrl(msg), "_blank");
  };

  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Полиграфия на заказ",
    alternateName: ["Печать визиток", "Листовки оптом", "Баннеры Алматы"],
    description: "Полный цикл полиграфических услуг: визитки, листовки, буклеты, баннеры, календари, упаковка. Работаем с юридическими лицами по всему Казахстану.",
    provider: {
      "@type": "LocalBusiness",
      name: "ZERO PRINT",
      telephone: "+77716246461",
      email: "zeroprint.kz@gmail.com",
      address: { "@type": "PostalAddress", streetAddress: "ул. Радостовца 152/6, офис 104", addressLocality: "Алматы", addressRegion: "Алматы", addressCountry: "KZ" },
      geo: { "@type": "GeoCoordinates", latitude: 43.2220, longitude: 76.8512 },
      openingHours: "Mo-Fr 09:00-18:00",
      priceRange: "$$",
    },
    areaServed: [
      { "@type": "City", name: "Алматы" }, { "@type": "City", name: "Астана" },
      { "@type": "City", name: "Шымкент" }, { "@type": "City", name: "Актобе" },
      { "@type": "City", name: "Павлодар" }, { "@type": "City", name: "Атырау" },
      { "@type": "City", name: "Костанай" }, { "@type": "City", name: "Актау" },
      { "@type": "City", name: "Уральск" }, { "@type": "City", name: "Тараз" },
      { "@type": "City", name: "Семей" }, { "@type": "City", name: "Петропавловск" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Виды полиграфии",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Печать визиток" }, priceSpecification: { "@type": "UnitPriceSpecification", price: "5000", priceCurrency: "KZT", unitText: "100 шт" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Печать листовок" }, priceSpecification: { "@type": "UnitPriceSpecification", price: "8000", priceCurrency: "KZT", unitText: "100 шт" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Печать баннеров" }, priceSpecification: { "@type": "UnitPriceSpecification", price: "3000", priceCurrency: "KZT", unitText: "м²" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Печать буклетов" }, priceSpecification: { "@type": "UnitPriceSpecification", price: "15000", priceCurrency: "KZT", unitText: "50 шт" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Корпоративные календари" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Наклейки и стикеры" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Упаковка и пакеты с логотипом" } },
      ],
    },
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: BASE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Полиграфия", item: BASE_URL + "/poligrafiya" },
    ],
  };

  const faqItems = [
    { q: "Какой минимальный тираж для печати визиток?", a: "Минимальный тираж — 100 штук. При заказе от 500 шт — скидка 10%, от 1000 шт — скидка 20%." },
    { q: "Сколько стоит печать листовок в Алматы?", a: "Печать листовок А5 от 100 штук — от 8 000 ₸. Цена зависит от тиража, формата и плотности бумаги. Точный расчёт за 15 минут в WhatsApp." },
    { q: "Работаете ли вы с юридическими лицами?", a: "Да, работаем с ИП и ТОО. Предоставляем счёт-фактуру, акт выполненных работ, накладную. Работаем с НДС и без НДС." },
    { q: "Как быстро можно напечатать баннер?", a: "Стандартный срок — 1-2 рабочих дня. Срочная печать за 4-8 часов с доплатой 30%." },
    { q: "Доставляете ли в другие города Казахстана?", a: "Да, доставляем по всему Казахстану: Астана, Шымкент, Актобе, Павлодар, Атырау и другие города через транспортные компании." },
  ];

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />

      <section className="relative min-h-[90vh] flex items-center text-white" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#0a1628]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container relative z-10 mx-auto px-4 py-20">
          <nav className="text-sm text-gray-400 mb-8" data-testid="breadcrumbs">
            <Link href="/" className="hover:text-white">Главная</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Полиграфия</span>
          </nav>

          <span className="inline-block bg-[#E8500A] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6" data-testid="hero-badge">
            Бизнес-полиграфия • Работаем с юрлицами
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 max-w-4xl leading-tight" data-testid="hero-h1">
            Полиграфия на заказ в Казахстане
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl font-normal">
            Визитки, листовки, баннеры, буклеты, календари оптом. Срок от 1 дня. Доставка по всему Казахстану.
          </h2>

          <div className="space-y-3 mb-10">
            {[
              "Работаем с ИП и ТОО — счёт-фактура, НДС, закрывающие документы",
              "Срок от 1 рабочего дня — срочная печать за 4-8 часов",
              "Доставка в Алматы, Астану, Шымкент и все города Казахстана",
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-lg">
                <span className="text-[#25D366] text-xl">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a href="#calculator" className="inline-flex items-center justify-center gap-2 bg-[#E8500A] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#d14709] transition-colors" data-testid="hero-cta-calc">
              📱 Получить расчёт — бесплатно
            </a>
            <a href="#products" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors" data-testid="hero-cta-products">
              Смотреть виды работ ↓
            </a>
          </div>

          <p className="text-gray-400 flex items-center gap-2">
            <span className="text-[#25D366]">✅</span> Уже напечатали для 500+ компаний Казахстана
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "компаний" },
              { value: "7 лет", label: "на рынке" },
              { value: "от 1 дня", label: "срок печати" },
              { value: "12 городов", label: "доставка" },
            ].map((s, i) => (
              <div key={i} className="text-center" data-testid={`stat-${i}`}>
                <div className="text-3xl md:text-4xl font-bold text-[#0a1628]">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-20" data-testid="section-products">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-[#0a1628]">Что мы печатаем</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Полный цикл — от дизайна до готовой продукции</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {printTypes.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#E8500A] hover:-translate-y-1 transition-all group cursor-pointer" data-testid={`card-print-${i}`}>
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-lg mb-1 text-[#0a1628]">{item.name}</h3>
                <p className="text-[#E8500A] font-semibold text-sm mb-1">{item.price}</p>
                <p className="text-gray-400 text-xs mb-2">{item.unit}</p>
                <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                <button
                  onClick={() => handleOrderClick(item.name)}
                  className="w-full bg-[#0a1628] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#152238] transition-colors opacity-0 group-hover:opacity-100"
                  data-testid={`button-order-${i}`}
                >
                  Заказать →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a1628] text-white" data-testid="section-audience">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Работаем с бизнесом любого масштаба</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🏢", title: "Корпорации и холдинги", items: ["Оптовые тиражи", "Годовые договоры", "Персональный менеджер"] },
              { icon: "🏪", title: "Малый бизнес и ИП", items: ["Небольшие тиражи", "От 1 дня", "Без минималки по дизайну"] },
              { icon: "🎪", title: "Event и маркетинг", items: ["Срочная печать", "Выставки и ивенты", "Баннеры, флаги, roll-up"] },
            ].map((card, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6" data-testid={`audience-card-${i}`}>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                <ul className="space-y-2">
                  {card.items.map((item, j) => (
                    <li key={j} className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="text-[#E8500A]">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0f1f3a] text-white" data-testid="section-process">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Как оформить заказ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Заявка", desc: "Пишете в WhatsApp или звоните" },
              { num: "2", title: "Расчёт и КП", desc: "Отправим цену за 15 минут" },
              { num: "3", title: "Согласование", desc: "Утверждаем макет и договор" },
              { num: "4", title: "Печать и доставка", desc: "Печатаем и доставляем в срок" },
            ].map((step, i) => (
              <div key={i} className="text-center relative" data-testid={`process-step-${i}`}>
                <div className="w-16 h-16 bg-[#E8500A] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
                {i < 3 && <div className="hidden lg:block absolute top-8 -right-4 text-gray-600 text-2xl">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-[#0a1628]">Сроки и стоимость</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full" data-testid="table-pricing">
                <thead>
                  <tr className="bg-[#0a1628] text-white">
                    <th className="text-left px-6 py-4 font-semibold text-sm">Продукция</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Тираж</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Срок</th>
                    <th className="text-left px-6 py-4 font-semibold text-sm">Цена от</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map((row, i) => (
                    <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`} data-testid={`row-pricing-${i}`}>
                      <td className="px-6 py-4 text-sm font-medium text-[#0a1628]">{row.emoji} {row.product}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.min}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.term}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#E8500A]">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>* Срочная печать за 4-8 часов — наценка 30%</p>
              <p>* Цены указаны без учёта дизайна. Разработка макета от 5 000 ₸</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" data-testid="section-tech">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-[#0a1628]">Требования к макетам</h2>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-[#0a1628] mb-2 flex items-center gap-2">📐 Форматы файлов</h4>
                  <ul className="text-gray-500 text-sm space-y-1">
                    <li>PDF (предпочтительно)</li>
                    <li>AI, CDR, EPS (векторные)</li>
                    <li>PSD, TIFF (растровые, 300 dpi)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#0a1628] mb-2 flex items-center gap-2">🎨 Цветовая модель</h4>
                  <ul className="text-gray-500 text-sm space-y-1">
                    <li>CMYK для печати</li>
                    <li>Не RGB (цвета изменятся)</li>
                    <li>Pantone — по договорённости</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-[#0a1628] mb-2 flex items-center gap-2">📏 Вылеты и поля</h4>
                  <ul className="text-gray-500 text-sm space-y-1">
                    <li>Вылет 3 мм с каждой стороны</li>
                    <li>Важные элементы — 5 мм от края</li>
                    <li>Текст — не менее 3 мм от реза</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#0a1628] mb-2 flex items-center gap-2">✅ Если нет готового макета</h4>
                  <ul className="text-gray-500 text-sm space-y-1">
                    <li>Разрабатываем с нуля от 5 000 ₸</li>
                    <li>Редактируем ваш макет — бесплатно</li>
                    <li>Шаблоны в PDF — бесплатно</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a
                href={buildWhatsAppUrl("Здравствуйте! Хочу получить шаблон для печати.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#152238] transition-colors"
                data-testid="button-get-template"
              >
                📱 Получить шаблон в WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-advantages">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-[#0a1628]">Почему заказывают у ZERO PRINT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏭", title: "Собственное производство", desc: "Не перекупщики — своё оборудование в Алматы. Контроль качества на каждом этапе." },
              { icon: "📄", title: "Работаем с юрлицами", desc: "ИП и ТОО. Счёт-фактура, акт, накладная. НДС и без НДС. Все закрывающие документы." },
              { icon: "⚡", title: "Срочная печать", desc: "Стандарт: 1-3 дня. Срочно: 4-8 часов. Работаем в выходные по договорённости." },
              { icon: "🎨", title: "Дизайн включён", desc: "Правки в готовый макет — бесплатно. Разработка с нуля — от 5 000 ₸." },
              { icon: "🚚", title: "Доставка по Казахстану", desc: "Алматы — курьером за 1 день. Другие города — транспортными компаниями." },
              { icon: "💰", title: "Гибкие цены", desc: "Скидки от 500 шт. Постоянным клиентам — персональные условия." },
            ].map((adv, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow" data-testid={`advantage-${i}`}>
                <div className="text-3xl mb-3">{adv.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-[#0a1628]">{adv.title}</h3>
                <p className="text-gray-500 text-sm">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="py-20 bg-gray-50" data-testid="section-form">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-3 text-[#0a1628]">Рассчитайте стоимость прямо сейчас</h2>
            <p className="text-gray-500">Бесплатный расчёт • Ответим за 15 минут • Без обязательств</p>
          </div>
          <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-8 shadow-sm border space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Вид полиграфии</label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]/20 bg-white"
                data-testid="form-select-type"
              >
                <option value="">Выберите тип</option>
                {productOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Тираж</label>
              <div className="flex flex-wrap gap-2">
                {circulationOptions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setFormData({ ...formData, circulation: q })}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      formData.circulation === q ? "bg-[#0a1628] text-white border-[#0a1628]" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                    data-testid={`form-circ-${q}`}
                  >
                    {q}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, circulation: "other" })}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    formData.circulation === "other" ? "bg-[#0a1628] text-white border-[#0a1628]" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                  data-testid="form-circ-other"
                >
                  Другое
                </button>
              </div>
              {formData.circulation === "other" && (
                <input
                  type="number"
                  value={customCirc}
                  onChange={(e) => setCustomCirc(e.target.value)}
                  placeholder="Укажите тираж"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-2 focus:outline-none focus:border-[#0a1628]"
                  data-testid="form-circ-custom"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Срочность</label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer text-sm transition-colors ${
                  formData.urgency === "standard" ? "bg-[#0a1628] text-white border-[#0a1628]" : "bg-white border-gray-200"
                }`}>
                  <input type="radio" name="urgency" value="standard" checked={formData.urgency === "standard"} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} className="sr-only" />
                  Стандарт (1-5 дней)
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer text-sm transition-colors ${
                  formData.urgency === "urgent" ? "bg-[#E8500A] text-white border-[#E8500A]" : "bg-white border-gray-200"
                }`}>
                  <input type="radio" name="urgency" value="urgent" checked={formData.urgency === "urgent"} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} className="sr-only" />
                  Срочно +30%
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Ваша компания</label>
              <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Название компании" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628]" data-testid="form-input-company" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Имя</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Ваше имя" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628]" data-testid="form-input-name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Телефон</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required placeholder="+7 (___) ___-__-__" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628]" data-testid="form-input-phone" />
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl text-base font-bold hover:bg-[#20bd5a] transition-colors" data-testid="form-submit">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              📱 Получить расчёт в WhatsApp
            </button>
          </form>
        </div>
      </section>

      <section className="py-20" data-testid="section-faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-[#0a1628]">Часто задаваемые вопросы</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-[#0a1628] hover:bg-gray-50 transition-colors" data-testid={`faq-toggle-${i}`}>
                  <span>{item.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a1628] text-white" data-testid="section-cta-final">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Готовы обсудить ваш заказ?</h2>
          <p className="text-gray-400 text-lg mb-8">Напишите нам — ответим за 15 минут</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={buildWhatsAppUrl("Здравствуйте! Хочу обсудить заказ полиграфии.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#20bd5a] transition-colors" data-testid="cta-whatsapp">
              📱 Написать в WhatsApp
            </a>
            <a href="tel:+77001584039" className="inline-flex items-center justify-center gap-2 bg-[#E8500A] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#d14709] transition-colors" data-testid="cta-phone">
              📞 Позвонить
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-seo-text">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-gray max-w-none text-sm text-gray-600 leading-relaxed">
            <h3>Полиграфия на заказ в Алматы и Казахстане</h3>
            <p>ZERO PRINT — это собственное полиграфическое производство в Алматы, где мы печатаем визитки, листовки, баннеры, буклеты, календари, наклейки, папки и упаковку. Работаем с юридическими лицами по всему Казахстану.</p>
            <p>Наше оборудование позволяет выполнять как цифровую печать малых тиражей от 100 экземпляров, так и офсетную печать больших тиражей от 1000 штук. Широкоформатная печать баннеров и Roll-up стендов — от 1 дня.</p>
            <p>Мы предлагаем полный цикл полиграфических услуг: разработка дизайна макета, допечатная подготовка, печать, постпечатная обработка (ламинация, тиснение, вырубка, фальцовка) и доставка готовой продукции.</p>
            <p>Доставляем заказы по всему Казахстану: Алматы, Астана, Шымкент, Актобе, Павлодар, Атырау, Костанай, Актау, Уральск, Тараз, Семей, Петропавловск. Для постоянных клиентов — персональные скидки и закреплённый менеджер.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
