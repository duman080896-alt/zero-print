import { useSearch } from "wouter";
import { Link } from "wouter";
import { CheckCircle, Shield, Truck, Clock, Award, Sparkles, Palette, Scissors, Package, Printer, Gift, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrustedLogos from "@/components/shared/TrustedLogos";
import SmartLeadForm from "@/components/shared/SmartLeadForm";
import { useSEO } from "@/hooks/useSEO";

const WHATSAPP_URL = "https://wa.me/77716246461";

interface LandingData {
  slug: string;
  h1: string;
  subtitle: string;
  trigger: string;
  products: Array<{ name: string; desc: string; icon: typeof Sparkles }>;
  productTypes: string[];
  advantages: string[];
  seoTitle: string;
  seoDesc: string;
  seoKeys: string;
}

const LANDINGS: Record<string, LandingData> = {
  vyshivka: {
    slug: "vyshivka",
    h1: "Профессиональное нанесение логотипов: Вышивка и Принт на одежде оптом в Казахстане",
    subtitle: "От 20 единиц. Своё производство в Алматы. Доставка по всему РК. Работаем с НДС.",
    trigger: "Гарантия 50+ стирок без потери качества. Бесплатная визуализация вашего логотипа на изделии за 30 минут.",
    products: [
      { name: "Худи и свитшоты", desc: "Вышивка и принт на худи корпоративного стиля", icon: Package },
      { name: "Кепки и шапки", desc: "Брендирование головных уборов любой сложности", icon: Award },
      { name: "Жилетки", desc: "Нанесение логотипа на утепленные и рабочие жилеты", icon: Shield },
      { name: "Полотенца и халаты", desc: "Вышивка на текстиле для отелей и спа", icon: Sparkles },
      { name: "Пледы и флис", desc: "Персонализация пледов и флисовых изделий", icon: Palette },
      { name: "Униформа", desc: "Комплексное брендирование рабочей одежды", icon: Scissors },
    ],
    productTypes: ["Худи и свитшоты", "Кепки и шапки", "Жилетки", "Полотенца и халаты", "Пледы и флис", "Униформа"],
    advantages: [
      "Своё производство в Алматы",
      "Гарантия 50+ стирок",
      "Бесплатная визуализация за 30 минут",
      "Работаем с НДС",
      "Доставка по всему Казахстану",
      "От 20 единиц",
    ],
    seoTitle: "Вышивка и принт на одежде оптом в Казахстане | ZERO PRINT",
    seoDesc: "Профессиональное нанесение логотипов вышивкой и принтом. Худи, кепки, жилетки, халаты. Своё производство в Алматы. От 20 шт. ZERO PRINT.",
    seoKeys: "вышивка на одежде Алматы, принт на худи оптом, нанесение логотипа Казахстан, вышивка на кепках",
  },
  poshiv: {
    slug: "poshiv",
    h1: "Пошив корпоративной одежды и спецформы на заказ для вашего бизнеса",
    subtitle: "Полный цикл: от лекал до готовой партии. Индивидуальный дизайн, подбор тканей под ваш бюджет.",
    trigger: "Собственный швейный цех. Контроль качества на каждом этапе. Шьём точно в срок по договору.",
    products: [
      { name: "Спецодежда", desc: "Рабочая форма для промышленных предприятий", icon: Shield },
      { name: "Жилетки", desc: "Утепленные и корпоративные жилеты любого кроя", icon: Package },
      { name: "Халаты", desc: "Медицинские, гостиничные и домашние халаты", icon: Sparkles },
      { name: "Текстиль", desc: "Салфетницы, скатерти и декоративный текстиль", icon: Palette },
      { name: "Корпоративный мерч", desc: "Брендированная одежда для мероприятий и команд", icon: Award },
      { name: "Форменная одежда", desc: "Единая форма для персонала под ваш бренд", icon: Scissors },
    ],
    productTypes: ["Спецодежда", "Жилетки", "Халаты", "Текстиль", "Корпоративный мерч", "Форменная одежда"],
    advantages: [
      "Собственный швейный цех",
      "Контроль качества на каждом этапе",
      "Шьём точно в срок по договору",
      "Подбор тканей под бюджет",
      "Индивидуальные лекала",
      "Доставка по всему Казахстану",
    ],
    seoTitle: "Пошив корпоративной одежды на заказ в Казахстане | ZERO PRINT",
    seoDesc: "Пошив спецодежды, жилеток, халатов и корпоративного мерча. Собственный цех в Алматы. Полный цикл от лекал до доставки. ZERO PRINT.",
    seoKeys: "пошив спецодежды Алматы, пошив корпоративной одежды Казахстан, швейный цех на заказ",
  },
  suvenir: {
    slug: "suvenir",
    h1: "Сувенирная продукция с вашим логотипом под ключ",
    subtitle: "Подарки для клиентов и партнёров, которые не выбросят. Широкий ассортимент от ручек до премиум-боксов.",
    trigger: "Подбор подборки сувениров под ваш бюджет за 1 час. Нанесение любой сложности.",
    products: [
      { name: "Ручки и канцелярия", desc: "Брендированные ручки, блокноты, карандаши", icon: BookOpen },
      { name: "Термосы и кружки", desc: "Термокружки, бутылки и термосы с логотипом", icon: Package },
      { name: "Подарочные наборы", desc: "Премиум-боксы для партнёров и клиентов", icon: Gift },
      { name: "USB и электроника", desc: "Флешки, повербанки, наушники с брендом", icon: Sparkles },
      { name: "Текстиль", desc: "Пледы, полотенца, сумки с нанесением", icon: Palette },
      { name: "Эко-сувениры", desc: "Экологичные подарки из переработанных материалов", icon: Award },
    ],
    productTypes: ["Ручки и канцелярия", "Термосы и кружки", "Подарочные наборы", "USB и электроника", "Текстиль", "Эко-сувениры"],
    advantages: [
      "Подбор под бюджет за 1 час",
      "Более 5 000 товаров в каталоге",
      "Нанесение любой сложности",
      "Работаем с НДС",
      "Доставка по всему Казахстану",
      "Премиум-упаковка",
    ],
    seoTitle: "Сувенирная продукция с логотипом на заказ | ZERO PRINT",
    seoDesc: "Корпоративные сувениры с нанесением логотипа: ручки, термосы, подарочные наборы, электроника. Подбор под бюджет за 1 час. ZERO PRINT.",
    seoKeys: "корпоративные сувениры Алматы, сувениры с логотипом Казахстан, подарки для клиентов оптом",
  },
  poligrafiya: {
    slug: "poligrafiya",
    h1: "Бизнес-полиграфия оптом для крупных компаний и мероприятий",
    subtitle: "Печать каталогов, блокнотов, папок и упаковки с вашим брендом.",
    trigger: "Премиальное качество бумаги и печати. Дизайн-макет в подарок при заказе тиража.",
    products: [
      { name: "Каталоги и брошюры", desc: "Многостраничные издания для презентаций", icon: BookOpen },
      { name: "Блокноты", desc: "Брендированные блокноты для офиса и мероприятий", icon: BookOpen },
      { name: "Папки и конверты", desc: "Корпоративные папки с вашим дизайном", icon: Package },
      { name: "Упаковка", desc: "Фирменная упаковка для продукции и подарков", icon: Gift },
      { name: "Визитки и листовки", desc: "Классическая бизнес-полиграфия любого тиража", icon: Printer },
      { name: "Баннеры и Roll-up", desc: "Рекламные конструкции для выставок и офиса", icon: Award },
    ],
    productTypes: ["Каталоги и брошюры", "Блокноты", "Папки и конверты", "Упаковка", "Визитки и листовки", "Баннеры и Roll-up"],
    advantages: [
      "Премиальное качество печати",
      "Дизайн-макет в подарок",
      "Печать от 50 экземпляров",
      "Работаем с НДС",
      "Доставка по всему Казахстану",
      "Сроки от 1 рабочего дня",
    ],
    seoTitle: "Бизнес-полиграфия оптом в Казахстане | ZERO PRINT",
    seoDesc: "Печать каталогов, блокнотов, папок, визиток и упаковки оптом. Дизайн-макет в подарок. Премиальное качество. ZERO PRINT.",
    seoKeys: "полиграфия оптом Алматы, печать каталогов Казахстан, корпоративная полиграфия",
  },
};

const DEFAULT_LANDING = "vyshivka";

const steps = [
  { num: 1, title: "Заявка", desc: "Заполните форму или напишите в WhatsApp", icon: BookOpen },
  { num: 2, title: "Расчёт", desc: "Подберём решение и рассчитаем стоимость", icon: Sparkles },
  { num: 3, title: "Производство", desc: "Изготовим заказ на своём производстве", icon: Shield },
  { num: 4, title: "Доставка", desc: "Доставим по всему Казахстану точно в срок", icon: Truck },
];

export default function Landing() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const utmTerm = params.get("utm_term") || params.get("type") || DEFAULT_LANDING;
  const data = LANDINGS[utmTerm] || LANDINGS[DEFAULT_LANDING];

  useSEO(data.seoTitle, data.seoDesc, data.seoKeys);

  return (
    <div className="min-h-screen flex flex-col" data-testid="landing-page">
      <Navbar />

      <section className="relative py-20 md:py-28 bg-primary text-white overflow-hidden" data-testid="landing-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
              <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
              Своё производство в Алматы · Работаем с НДС
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold font-heading mb-6 leading-tight" data-testid="landing-h1">
              {data.h1}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              {data.subtitle}
            </p>

            <div className="bg-accent/20 border border-accent/30 rounded-xl px-6 py-4 mb-8 max-w-2xl mx-auto">
              <p className="text-accent font-medium text-sm md:text-base" data-testid="landing-trigger">
                {data.trigger}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${WHATSAPP_URL}?text=Здравствуйте! Интересует ${data.productTypes[0]}. Хочу узнать стоимость.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors"
                data-testid="cta-whatsapp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.717-6.262-1.939l-.438-.304-2.655.89.89-2.655-.304-.438A9.957 9.957 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Рассчитать стоимость
              </a>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors"
                data-testid="cta-catalog"
              >
                Смотреть каталог
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrustedLogos />

      <section className="py-16 bg-white" data-testid="landing-products">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">Что мы предлагаем</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Полный спектр услуг для вашего бизнеса</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {data.products.map((product, i) => {
              const Icon = product.icon;
              return (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all group"
                  data-testid={`product-card-${i}`}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="landing-process">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Как мы работаем</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                    {step.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200" />
                  )}
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="landing-advantages">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Наши преимущества</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {data.advantages.map((adv, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <CheckCircle className="w-6 h-6 text-[#25D366] flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SmartLeadForm
        productTypes={data.productTypes}
        title="Рассчитать стоимость"
        subtitle="Заполните форму и получите расчёт в WhatsApp в течение 30 минут"
      />

      <Footer />
    </div>
  );
}
