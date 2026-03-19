import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";

const WHATSAPP = "77716246461";
const PHONE = "+77001584039";

export interface NicheConfig {
  slug: string;
  niche: string;
  h1: string;
  subtitle: string;
  heroBg: string;
  heroPattern: string;
  heroImage?: string;
  seo: { title: string; description: string; keywords: string };
  benefits: { icon: string; title: string; desc: string }[];
  cases: { company: string; clothing: string; qty: string; result: string; emoji: string; image?: string }[];
  productCategory: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function RevealSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface Product { id: string; name: string; image?: string; price?: number; brand?: string; }

export default function NicheLanding({ config }: { config: NicheConfig }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [heroVisible, setHeroVisible] = useState(false);

  useSEO(config.seo.title, config.seo.description, config.seo.keywords);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch(`/api/products?category=${config.productCategory}&limit=6`)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.products || []);
        setProducts(items.slice(0, 6));
      })
      .catch(() => {});
  }, [config.productCategory]);

  const wa = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

  const steps = [
    { icon: "📝", title: "Заявка", desc: "Отправьте запрос через WhatsApp или форму на сайте — ответим в течение 30 минут" },
    { icon: "📐", title: "Замеры и дизайн", desc: "Согласовываем размерную сетку, цвета и нанесение вашего логотипа" },
    { icon: "🏭", title: "Производство", desc: "Шьём и наносим логотип на собственном оборудовании в Алматы" },
    { icon: "🚚", title: "Доставка", desc: "Доставка по всему Казахстану транспортными компаниями или курьером" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex items-center text-white overflow-hidden"
        style={{ background: config.heroBg }}
        data-testid="section-hero"
      >
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: config.heroPattern }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.35))" }} />

        {/* Desktop: image pinned absolutely to right side, full section height */}
        {config.heroImage && (
          <div
            className="hidden lg:flex absolute right-0 top-0 bottom-0 items-end justify-end pointer-events-none z-10"
            style={{ width: "48%", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateX(32px)", transition: "all 0.9s ease 0.1s" }}
          >
            <img
              src={config.heroImage}
              alt={config.h1}
              style={{ height: "100%", width: "auto", objectFit: "contain", objectPosition: "right bottom", filter: "drop-shadow(-10px 0 40px rgba(0,0,0,0.4))" }}
            />
          </div>
        )}

        <div className={`container relative z-10 mx-auto px-4 py-24 ${config.heroImage ? "max-w-6xl" : "max-w-4xl"}`}>
          {config.heroImage ? (
            /* ── Two-column hero: text left (desktop), stacked (mobile) ── */
            <div>
              {/* Text block — on desktop occupies left half only */}
              <div className="lg:w-1/2">
                <nav className="text-sm text-blue-200 mb-8 flex gap-2 items-center flex-wrap">
                  <Link href="/" className="hover:text-white transition-colors">Главная</Link>
                  <span className="opacity-40">/</span>
                  <span>Услуги</span>
                  <span className="opacity-40">/</span>
                  <span className="text-white">{config.niche}</span>
                </nav>
                <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(28px)", transition: "all 0.7s ease" }}>
                  <span className="inline-block bg-[#E8500A] text-white text-sm font-bold px-5 py-2 rounded-full mb-6 tracking-wide">
                    Корпоративная одежда • {config.niche}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight mb-6" data-testid="hero-h1">
                    {config.h1}
                  </h1>
                  <p className="text-xl text-blue-100 mb-10 leading-relaxed" data-testid="hero-subtitle">
                    {config.subtitle}
                  </p>
                </div>
                <div
                  className="flex flex-col sm:flex-row gap-4"
                  style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(20px)", transition: "all 0.8s ease 0.2s" }}
                >
                  <a
                    href={wa(`Здравствуйте! Хочу получить КП на корпоративную одежду для ${config.niche}.`)}
                    target="_blank" rel="noopener noreferrer"
                    data-testid="button-hero-whatsapp"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1db954] text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-green-900/30"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    Получить КП в WhatsApp
                  </a>
                  <a href="#cases" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 hover:border-white/70 font-semibold px-8 py-4 rounded-xl text-base transition-all">
                    Смотреть кейсы ↓
                  </a>
                </div>
                <div className="mt-10 flex flex-wrap gap-6" style={{ opacity: heroVisible ? 1 : 0, transition: "all 0.8s ease 0.4s" }}>
                  {["500+ компаний", "7 лет на рынке", "Доставка по Казахстану", "Оплата по безналу"].map((b) => (
                    <span key={b} className="text-sm text-blue-200 flex items-center gap-1.5">
                      <span className="text-[#25D366]">✓</span> {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile: image inline below text */}
              <div
                className="lg:hidden mt-10 flex justify-center"
                style={{ opacity: heroVisible ? 1 : 0, transition: "all 0.9s ease 0.1s" }}
              >
                <img
                  src={config.heroImage}
                  alt={config.h1}
                  className="max-h-[320px] w-auto object-contain"
                  style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))" }}
                />
              </div>
            </div>
          ) : (
            /* ── Single-column hero (default) ── */
            <>
              <nav className="text-sm text-blue-200 mb-8 flex gap-2 items-center flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">Главная</Link>
                <span className="opacity-40">/</span>
                <span>Услуги</span>
                <span className="opacity-40">/</span>
                <span className="text-white">{config.niche}</span>
              </nav>
              <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(28px)", transition: "all 0.7s ease" }}>
                <span className="inline-block bg-[#E8500A] text-white text-sm font-bold px-5 py-2 rounded-full mb-6 tracking-wide">
                  Корпоративная одежда • {config.niche}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "inherit" }} data-testid="hero-h1">
                  {config.h1}
                </h1>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed" data-testid="hero-subtitle">
                  {config.subtitle}
                </p>
              </div>
              <div
                className="flex flex-col sm:flex-row gap-4"
                style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(20px)", transition: "all 0.8s ease 0.2s" }}
              >
                <a
                  href={wa(`Здравствуйте! Хочу получить КП на корпоративную одежду для ${config.niche}.`)}
                  target="_blank" rel="noopener noreferrer"
                  data-testid="button-hero-whatsapp"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1db954] text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-green-900/30"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  Получить КП в WhatsApp
                </a>
                <a href="#cases" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 hover:border-white/70 font-semibold px-8 py-4 rounded-xl text-base transition-all">
                  Смотреть кейсы ↓
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-6" style={{ opacity: heroVisible ? 1 : 0, transition: "all 0.8s ease 0.4s" }}>
                {["500+ компаний", "7 лет на рынке", "Доставка по всему Казахстану", "Оплата по безналу"].map((b) => (
                  <span key={b} className="text-sm text-blue-200 flex items-center gap-1.5">
                    <span className="text-[#25D366]">✓</span> {b}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── ПОЧЕМУ МЫ ────────────────────────────────────── */}
      <section className="py-20 bg-white" data-testid="section-benefits">
        <div className="container mx-auto px-4 max-w-6xl">
          <RevealSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-3">Почему выбирают нас</h2>
              <p className="text-gray-500 text-lg">Более 500 компаний Казахстана уже работают с ZERO PRINT</p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.benefits.map((b, i) => (
              <RevealSection key={i} delay={i * 80}>
                <div
                  data-testid={`card-benefit-${i}`}
                  className="bg-[#f8f9fb] rounded-2xl p-6 text-center hover:shadow-md transition-shadow group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{b.icon}</div>
                  <h3 className="font-bold text-[#0a1628] mb-2 text-base">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── КЕЙСЫ ────────────────────────────────────────── */}
      <section id="cases" className="py-20" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fff 100%)" }} data-testid="section-cases">
        <div className="container mx-auto px-4 max-w-6xl">
          <RevealSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-3">Наши работы</h2>
              <p className="text-gray-500 text-lg">Реальные заказы от компаний в сфере {config.niche}</p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.cases.map((c, i) => (
              <RevealSection key={i} delay={i * 100}>
                <div
                  data-testid={`card-case-${i}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-default border border-gray-100 group overflow-hidden"
                >
                  {c.image ? (
                    <div className="relative overflow-hidden" style={{ height: "220px" }}>
                      <img
                        src={c.image}
                        alt={c.company}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <h3 className="font-bold text-white text-lg drop-shadow">{c.company}</h3>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 pb-0">
                      <div className="text-5xl mb-5 group-hover:scale-110 transition-transform inline-block">{c.emoji}</div>
                      <h3 className="font-bold text-[#0a1628] text-lg mb-1">{c.company}</h3>
                    </div>
                  )}
                  <div className="p-6" style={c.image ? { paddingTop: "16px" } : { paddingTop: "0" }}>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-[#E8500A]/10 text-[#E8500A] font-semibold px-2.5 py-1 rounded-full">{c.clothing}</span>
                      <span className="text-xs bg-[#0a1628]/10 text-[#0a1628] font-semibold px-2.5 py-1 rounded-full">{c.qty}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      <span className="text-[#25D366] font-bold">Результат: </span>{c.result}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ПОПУЛЯРНЫЕ ТОВАРЫ ────────────────────────────── */}
      {products.length > 0 && (
        <section className="py-20 bg-white" data-testid="section-products">
          <div className="container mx-auto px-4 max-w-6xl">
            <RevealSection>
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-3">Популярные позиции</h2>
                <p className="text-gray-500 text-lg">Одежда из нашего каталога — уже с нанесением вашего логотипа</p>
              </div>
            </RevealSection>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.map((p, i) => (
                <RevealSection key={p.id} delay={i * 60}>
                  <Link href={`/catalog/product/${p.id}`} data-testid={`card-product-${p.id}`}>
                    <div className="bg-[#f8f9fb] rounded-xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-pointer">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-32 object-contain p-2 group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center text-4xl">👕</div>
                      )}
                      <div className="p-3">
                        <p className="text-xs text-[#0a1628] font-medium line-clamp-2 leading-snug">{p.name}</p>
                        {p.brand && <p className="text-[10px] text-gray-400 mt-1">{p.brand}</p>}
                      </div>
                    </div>
                  </Link>
                </RevealSection>
              ))}
            </div>
            <RevealSection delay={200}>
              <div className="text-center mt-10">
                <Link href={`/catalog?category=${config.productCategory}`} className="inline-flex items-center gap-2 border-2 border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all" data-testid="link-view-all-products">
                  Смотреть весь каталог →
                </Link>
              </div>
            </RevealSection>
          </div>
        </section>
      )}

      {/* ─── КАК МЫ РАБОТАЕМ ──────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a3050 100%)" }} data-testid="section-steps">
        <div className="container mx-auto px-4 max-w-6xl">
          <RevealSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Как мы работаем</h2>
              <p className="text-blue-200 text-lg">От заявки до готовой одежды — 4 простых шага</p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((s, i) => (
              <RevealSection key={i} delay={i * 100}>
                <div className="relative" data-testid={`card-step-${i}`}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#E8500A] text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-2xl">{s.icon}</span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                    <p className="text-blue-200 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-3 text-[#E8500A] text-xl z-10">→</div>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <section className="py-20 bg-white" data-testid="section-faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <RevealSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-3">Частые вопросы</h2>
              <p className="text-gray-500">Отвечаем на главные вопросы наших клиентов</p>
            </div>
          </RevealSection>
          <div className="space-y-3">
            {config.faq.map((item, i) => (
              <RevealSection key={i} delay={i * 60}>
                <div
                  className="border border-gray-200 rounded-xl overflow-hidden"
                  data-testid={`faq-item-${i}`}
                >
                  <button
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    data-testid={`button-faq-${i}`}
                  >
                    <span className="font-semibold text-[#0a1628] text-base">{item.q}</span>
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center text-lg font-bold transition-transform"
                      style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4" data-testid={`faq-answer-${i}`}>
                      {item.a}
                    </div>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section
        className="py-20 text-white text-center"
        style={{ background: "linear-gradient(135deg, #E8500A 0%, #c73d06 100%)" }}
        data-testid="section-cta"
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{config.ctaTitle}</h2>
            <p className="text-orange-100 text-lg mb-10">{config.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={wa(`Здравствуйте! Хочу заказать корпоративную одежду для ${config.niche}. Прошу рассчитать стоимость.`)}
                target="_blank" rel="noopener noreferrer"
                data-testid="button-cta-whatsapp"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1db954] text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Написать в WhatsApp
              </a>
              <a
                href={`tel:${PHONE}`}
                data-testid="button-cta-phone"
                className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold px-8 py-4 rounded-xl text-base transition-all"
              >
                📞 Позвонить {PHONE}
              </a>
            </div>
            <p className="mt-8 text-orange-200 text-sm">г. Алматы, ул. Радостовца 152/6, офис 104</p>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
