import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { ChevronDown } from "lucide-react";

const WHATSAPP_NUMBER = "77716246461";
const PHONE_NUMBER = "+77001584039";
const BASE_URL = "https://zero-promo--duman080896.replit.app";

export interface ServiceConfig {
  slug: string;
  seo: { title: string; description: string; keywords: string };
  hero: {
    badge: string;
    h1: string;
    subtitle: string;
    benefits: string[];
    heroImage?: string;
  };
  stats: { value: string; label: string }[];
  services: { emoji: string; name: string; price: string; desc?: string; href?: string }[];
  servicesTitle: string;
  servicesSubtitle: string;
  formOptions: string[];
  formServiceName: string;
  faq: { q: string; a: string }[];
  seoText?: string;
  breadcrumbName: string;
  gallery?: { image: string; client: string; tag?: string }[];
}

export default function ServiceLanding({ config }: { config: ServiceConfig }) {
  const [formData, setFormData] = useState({
    whatNeeded: "",
    quantity: "50",
    urgency: "standard",
    name: "",
    phone: "",
  });
  const [customQty, setCustomQty] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useSEO(config.seo.title, config.seo.description, config.seo.keywords);

  const quantityOptions = ["50", "100", "500", "1000"];

  const buildWhatsAppUrl = (text: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = formData.quantity === "other" ? customQty : formData.quantity;
    const urgencyText = formData.urgency === "urgent" ? "Срочно (+30%)" : "Стандарт";
    const msg = `Здравствуйте! Хочу заказать ${config.formServiceName}.\nЧто нужно: ${formData.whatNeeded}\nКоличество: ${qty} шт.\nСрок: ${urgencyText}\nИмя: ${formData.name}\nТел: ${formData.phone}`;
    window.open(buildWhatsAppUrl(msg), "_blank");
  };

  const handleServiceOrder = (serviceName: string) => {
    window.open(
      buildWhatsAppUrl(`Здравствуйте! Интересует: ${serviceName}. Прошу рассчитать стоимость.`),
      "_blank"
    );
  };

  const schemaService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: config.hero.h1,
    description: config.seo.description,
    provider: {
      "@type": "LocalBusiness",
      name: "ZERO PRINT",
      telephone: "+77716246461",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Радостовца 152/6, офис 104",
        addressLocality: "Алматы",
        addressRegion: "Алматы",
        addressCountry: "KZ",
      },
    },
    areaServed: [
      { "@type": "City", name: "Алматы" },
      { "@type": "City", name: "Астана" },
      { "@type": "City", name: "Шымкент" },
      { "@type": "City", name: "Актобе" },
      { "@type": "City", name: "Павлодар" },
      { "@type": "City", name: "Атырау" },
      { "@type": "City", name: "Костанай" },
      { "@type": "City", name: "Актау" },
      { "@type": "City", name: "Уральск" },
      { "@type": "City", name: "Тараз" },
      { "@type": "City", name: "Семей" },
      { "@type": "City", name: "Петропавловск" },
    ],
  };

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: BASE_URL + "/" },
      { "@type": "ListItem", position: 2, name: "Услуги", item: BASE_URL + "/uslugi" },
      { "@type": "ListItem", position: 3, name: config.breadcrumbName, item: BASE_URL + "/uslugi/" + config.slug },
    ],
  };

  const schemaFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map((f) => ({
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

      <section
        className="relative min-h-[90vh] flex items-center text-white overflow-hidden animate-gradient"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1a56db 70%, #0f172a 100%)" }}
        data-testid="section-hero"
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className={config.hero.heroImage ? "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" : "max-w-3xl mx-auto"}>

            <div className={!config.hero.heroImage ? "text-center" : ""}>
              <nav className={`text-sm text-blue-300 mb-8 animate-fadeInUp ${!config.hero.heroImage ? "justify-center flex flex-wrap gap-1" : ""}`} data-testid="breadcrumbs">
                <Link href="/" className="hover:text-white transition-colors">Главная</Link>
                <span className="mx-2 opacity-50">/</span>
                <span className="text-blue-200">Услуги</span>
                <span className="mx-2 opacity-50">/</span>
                <span className="text-white">{config.breadcrumbName}</span>
              </nav>

              <span className="inline-block bg-[#E8500A] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 animate-fadeInUp-delay-1" data-testid="hero-badge">
                {config.hero.badge}
              </span>

              <h1 className={`font-bold font-heading mb-6 leading-tight animate-fadeInUp-delay-1 ${config.hero.heroImage ? "text-4xl md:text-5xl lg:text-[3.2rem]" : "text-4xl md:text-5xl lg:text-6xl"}`} data-testid="hero-h1">
                {config.hero.h1}
              </h1>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed animate-fadeInUp-delay-2" data-testid="hero-subtitle">
                {config.hero.subtitle}
              </p>

              <div className="space-y-3 mb-10 animate-fadeInUp-delay-2">
                {config.hero.benefits.map((b, i) => (
                  <div key={i} className={`flex items-start gap-3 text-base ${!config.hero.heroImage ? "justify-center" : ""}`} data-testid={`hero-benefit-${i}`}>
                    <span className="text-[#25D366] text-lg mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-blue-50">{b}</span>
                  </div>
                ))}
              </div>

              <div className={`flex flex-col sm:flex-row gap-3 animate-fadeInUp-delay-3 ${!config.hero.heroImage ? "justify-center" : ""}`}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Здравствуйте! Хочу получить расчёт стоимости (${config.formServiceName}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-4 rounded-xl text-base font-bold hover:bg-[#20bd5a] transition-all hover:shadow-lg hover:shadow-green-900/30"
                  data-testid="hero-cta-calc"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Получить расчёт
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-white/40 px-7 py-4 rounded-xl text-base font-semibold hover:bg-white/10 hover:border-white/70 transition-all"
                  data-testid="hero-cta-examples"
                >
                  Смотреть примеры
                </a>
              </div>

              <p className="text-blue-300 text-sm flex items-center gap-2 mt-6 animate-fadeInUp-delay-4">
                <span className="text-[#25D366]">✅</span> Уже заказали: 500+ компаний
              </p>
            </div>

            {config.hero.heroImage && (
              <div className="hidden lg:block animate-fadeInUp-delay-2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
                  <img
                    src={config.hero.heroImage}
                    alt={config.hero.h1}
                    className="w-full h-[500px] object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {config.stats.map((s, i) => (
              <div key={i} className="text-center" data-testid={`stat-${i}`}>
                <div className="text-3xl md:text-4xl font-bold text-[#0a1628]">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20" data-testid="section-services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-[#0a1628]">{config.servicesTitle}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{config.servicesSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.services.map((s, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#E8500A] hover:-translate-y-1 transition-all group cursor-pointer"
                data-testid={`service-card-${i}`}
              >
                <div className="text-4xl mb-3">{s.emoji}</div>
                <h3 className="font-bold text-lg mb-1 text-[#0a1628]">{s.name}</h3>
                <p className="text-[#E8500A] font-semibold mb-2">{s.price}</p>
                {s.desc && <p className="text-gray-500 text-sm mb-4">{s.desc}</p>}
                {s.href ? (
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#0a1628] hover:text-[#E8500A] transition-colors opacity-0 group-hover:opacity-100"
                    data-testid={`service-link-${i}`}
                  >
                    Смотреть в каталоге →
                  </Link>
                ) : (
                  <button
                    onClick={() => handleServiceOrder(s.name)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#0a1628] hover:text-[#E8500A] transition-colors opacity-0 group-hover:opacity-100"
                    data-testid={`service-order-${i}`}
                  >
                    Заказать →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a1628] text-white" data-testid="section-process">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">Как мы работаем</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "1️⃣", title: "Заявка", desc: "Пишете в WhatsApp или звоните" },
              { num: "2️⃣", title: "Расчёт и КП", desc: "Отправим цену за 15 минут" },
              { num: "3️⃣", title: "Производство", desc: "Изготавливаем в нашем цеху" },
              { num: "4️⃣", title: "Доставка", desc: "Отправляем по всему Казахстану" },
            ].map((step, i) => (
              <div key={i} className="text-center relative" data-testid={`process-step-${i}`}>
                <div className="text-4xl mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 -right-4 text-gray-600 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-advantages">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-[#0a1628]">Почему ZERO PRINT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏭", title: "Собственное производство", desc: "Свой цех в Алматы — не перекупщики" },
              { icon: "📄", title: "Работаем с юрлицами", desc: "Счёт-фактура, НДС, все закрывающие документы" },
              { icon: "🎨", title: "Дизайн бесплатно", desc: "Разработаем макет на основе вашего логотипа" },
              { icon: "📦", title: "Любой тираж", desc: "Работаем от 1 штуки — без ограничений" },
              { icon: "✅", title: "Гарантия качества", desc: "Переделаем бесплатно, если не устроит" },
              { icon: "🚚", title: "Доставка по Казахстану", desc: "Алматы, Астана, Шымкент и все города" },
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
            <h2 className="text-3xl font-bold font-heading mb-3 text-[#0a1628]">💬 Получите расчёт за 1 минуту</h2>
            <p className="text-gray-500">Бесплатно • Без обязательств</p>
          </div>
          <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-8 shadow-sm border space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Что нужно</label>
              <select
                value={formData.whatNeeded}
                onChange={(e) => setFormData({ ...formData, whatNeeded: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]/20 bg-white"
                data-testid="form-select-what"
              >
                <option value="">Выберите</option>
                {config.formOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Количество</label>
              <div className="flex flex-wrap gap-2">
                {quantityOptions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setFormData({ ...formData, quantity: q })}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      formData.quantity === q
                        ? "bg-[#0a1628] text-white border-[#0a1628]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                    data-testid={`form-qty-${q}`}
                  >
                    {q}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: "other" })}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    formData.quantity === "other"
                      ? "bg-[#0a1628] text-white border-[#0a1628]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                  data-testid="form-qty-other"
                >
                  Другое
                </button>
              </div>
              {formData.quantity === "other" && (
                <input
                  type="number"
                  value={customQty}
                  onChange={(e) => setCustomQty(e.target.value)}
                  placeholder="Укажите количество"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-2 focus:outline-none focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]/20"
                  data-testid="form-qty-custom"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Срок</label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer text-sm transition-colors ${
                  formData.urgency === "standard" ? "bg-[#0a1628] text-white border-[#0a1628]" : "bg-white border-gray-200"
                }`}>
                  <input type="radio" name="urgency" value="standard" checked={formData.urgency === "standard"} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} className="sr-only" />
                  Стандарт
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer text-sm transition-colors ${
                  formData.urgency === "urgent" ? "bg-[#E8500A] text-white border-[#E8500A]" : "bg-white border-gray-200"
                }`}>
                  <input type="radio" name="urgency" value="urgent" checked={formData.urgency === "urgent"} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} className="sr-only" />
                  Срочно
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Ваше имя</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Имя"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]/20"
                data-testid="form-input-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Телефон</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]/20"
                data-testid="form-input-phone"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl text-base font-bold hover:bg-[#20bd5a] transition-colors"
              data-testid="form-submit"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              📱 Получить расчёт в WhatsApp
            </button>
            <p className="text-center text-gray-400 text-sm">Обычно отвечаем за 15 минут</p>
          </form>
        </div>
      </section>

      <section className="py-20" data-testid="section-faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-[#0a1628]">Часто задаваемые вопросы</h2>
          <div className="space-y-3">
            {config.faq.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-[#0a1628] hover:bg-gray-50 transition-colors"
                  data-testid={`faq-toggle-${i}`}
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                    {item.a}
                  </div>
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
            <a
              href={buildWhatsAppUrl(`Здравствуйте! Хочу обсудить заказ (${config.formServiceName}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#20bd5a] transition-colors"
              data-testid="cta-whatsapp"
            >
              📱 Написать в WhatsApp
            </a>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex items-center justify-center gap-2 bg-[#E8500A] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#d14709] transition-colors"
              data-testid="cta-phone"
            >
              📞 Позвонить
            </a>
          </div>
        </div>
      </section>

      {config.gallery && config.gallery.length > 0 && (
        <section className="py-20 bg-white" data-testid="section-gallery">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-heading uppercase tracking-tight text-primary mb-3">
                Наши работы
              </h2>
              <div className="w-12 h-1 bg-accent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {config.gallery.map((item, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-100" data-testid={`gallery-item-${i}`}>
                  <img
                    src={item.image}
                    alt={item.client}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-sm leading-tight">{item.client}</p>
                    {item.tag && <span className="text-white/70 text-xs">{item.tag}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {config.seoText && (
        <section className="py-16 bg-gray-50" data-testid="section-seo-text">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-gray max-w-none text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: config.seoText }} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
