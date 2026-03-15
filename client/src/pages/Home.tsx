import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Truck, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectCard from "@/components/shared/ProjectCard";
import LeadForm from "@/components/shared/LeadForm";
import TrustedLogos from "@/components/shared/TrustedLogos";
import TrustedBy from "@/components/TrustedBy";
import { useSEO } from "@/hooks/useSEO";

export default function Home() {
  useSEO(
    "ZERO PRINT — Корпоративный мерч и печать в Казахстане",
    "ZERO PRINT — брендирование одежды, корпоративные сувениры, полиграфия и пошив на заказ. Работаем по всему Казахстану. Звоните: +7 771 624 64 61",
    "корпоративный мерч Казахстан, печать на одежде Алматы, брендирование, сувениры с логотипом"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/home-hero.png" 
            alt="Корпоративный мерч" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="container relative z-10 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
            Корпоративный мерч и <br className="hidden md:block" /> печать для бизнеса
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Мы помогаем компаниям создавать брендированную одежду, подарки и печатные материалы.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kontakty">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-8 py-6">
                Узнать стоимость
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 font-bold text-lg px-8 py-6">
                Наше портфолио
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <TrustedBy />

      {/* Каталожная секция услуг */}
      <section className="py-0 bg-white overflow-hidden">
        {/* Заголовок секции */}
        <div className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-end gap-6">
            <h2 className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter text-primary leading-none">
              Наши<br />услуги
            </h2>
            <div className="pb-2 hidden md:block">
              <div className="w-16 h-1 bg-accent mb-2" />
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                Комплексные брендинговые решения для корпоративного бизнеса
              </p>
            </div>
          </div>
        </div>

        {/* Разворот 1: Брендирование — фото слева */}
        <Link href="/uslugi/brendirovanie" className="block group">
          <div className="flex flex-col md:flex-row h-auto md:h-80">
            <div className="relative w-full md:w-[45%] h-64 md:h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1637904731042-2ef367b8c00c?w=900&auto=format&fit=crop"
                alt="Брендирование"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-white/50 text-sm font-bold uppercase tracking-widest block mb-1">01</span>
                <span className="text-white text-3xl md:text-4xl font-black uppercase leading-none tracking-tight">
                  Бренди-<br/>рование
                </span>
              </div>
            </div>
            <div className="w-full md:w-[55%] bg-gray-50 group-hover:bg-white transition-colors duration-300 flex flex-col justify-center px-8 md:px-14 py-10 md:py-0 border-b border-gray-100">
              <h3 className="text-2xl md:text-3xl font-black font-heading uppercase tracking-tight text-primary mb-4">
                Брендирование сувенирной продукции
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg">
                Более 5000 товаров с нанесением вашего логотипа. Ручки, термосы, кружки, зонты, флешки — под любой бюджет.
              </p>
              <ul className="space-y-2 mb-6">
                {["5000+ позиций в каталоге", "Все виды нанесения — гравировка, УФ-печать", "От 50 штук — идеально для корпоративных подарков"].map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                Подробнее <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Разворот 2: Пошив — фото справа */}
        <Link href="/uslugi/poshiv" className="block group">
          <div className="flex flex-col md:flex-row-reverse h-auto md:h-80">
            <div className="relative w-full md:w-[45%] h-64 md:h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1759984738054-cbdb13ec3fda?w=900&auto=format&fit=crop"
                alt="Пошив"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
              <div className="absolute bottom-6 right-6 text-right">
                <span className="text-white/50 text-sm font-bold uppercase tracking-widest block mb-1">02</span>
                <span className="text-white text-3xl md:text-4xl font-black uppercase leading-none tracking-tight">
                  Пошив<br/>одежды
                </span>
              </div>
            </div>
            <div className="w-full md:w-[55%] bg-primary group-hover:bg-primary/95 transition-colors duration-300 flex flex-col justify-center px-8 md:px-14 py-10 md:py-0 border-b border-primary/20">
              <h3 className="text-2xl md:text-3xl font-black font-heading uppercase tracking-tight text-white mb-4">
                Пошив корпоративной одежды
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed max-w-lg">
                От разработки дизайна до готового изделия с нанесённым логотипом. Собственный швейный цех в Алматы.
              </p>
              <ul className="space-y-2 mb-6">
                {["Полный цикл — дизайн, пошив, нанесение", "Любые ткани и фурнитура по вашему ТЗ", "Серийное и единичное производство"].map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                Подробнее <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Разворот 3: Печать — фото слева */}
        <Link href="/uslugi/pechat" className="block group">
          <div className="flex flex-col md:flex-row h-auto md:h-80">
            <div className="relative w-full md:w-[45%] h-64 md:h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1456456496250-d5e7c0a9b44d?w=900&auto=format&fit=crop"
                alt="Печать"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-white/50 text-sm font-bold uppercase tracking-widest block mb-1">03</span>
                <span className="text-white text-3xl md:text-4xl font-black uppercase leading-none tracking-tight">
                  Печать<br/>на одежде
                </span>
              </div>
            </div>
            <div className="w-full md:w-[55%] bg-gray-50 group-hover:bg-white transition-colors duration-300 flex flex-col justify-center px-8 md:px-14 py-10 md:py-0 border-b border-gray-100">
              <h3 className="text-2xl md:text-3xl font-black font-heading uppercase tracking-tight text-primary mb-4">
                Нанесение логотипа на одежду
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg">
                DTF, шелкография, термотрансфер — выбираем оптимальный метод под ваш тираж и бюджет.
              </p>
              <ul className="space-y-2 mb-6">
                {["4 метода нанесения под любую задачу", "Полноцветная печать — точная передача цветов", "Работаем с любым тиражом от 1 штуки"].map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                Подробнее <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Разворот 4: Вышивка — фото справа */}
        <Link href="/uslugi/vyshivka" className="block group">
          <div className="flex flex-col md:flex-row-reverse h-auto md:h-80">
            <div className="relative w-full md:w-[45%] h-64 md:h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1758813531001-3af022b8f449?w=900&auto=format&fit=crop"
                alt="Вышивка"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
              <div className="absolute bottom-6 right-6 text-right">
                <span className="text-white/50 text-sm font-bold uppercase tracking-widest block mb-1">04</span>
                <span className="text-white text-3xl md:text-4xl font-black uppercase leading-none tracking-tight">
                  Вышивка<br/>логотипа
                </span>
              </div>
            </div>
            <div className="w-full md:w-[55%] bg-primary group-hover:bg-primary/95 transition-colors duration-300 flex flex-col justify-center px-8 md:px-14 py-10 md:py-0">
              <h3 className="text-2xl md:text-3xl font-black font-heading uppercase tracking-tight text-white mb-4">
                Вышивка на корпоративной одежде
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed max-w-lg">
                Профессиональная машинная вышивка. Долговечно, презентабельно, статусно — идеально для корпоративной формы.
              </p>
              <ul className="space-y-2 mb-6">
                {["Держится 10+ лет — не выцветает и не смывается", "Выглядит статусно на корпоративной форме", "Любая сложность — от простого текста до герба"].map(b => (
                  <li key={b} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                Подробнее <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">Почему выбирают ZERO PRINT</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Быстрое производство</h3>
              <p className="text-gray-400">Соблюдаем сроки благодаря оптимизированным процессам.</p>
            </div>
            <div className="p-6">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Полный цикл</h3>
              <p className="text-gray-400">От дизайна до доставки — мы делаем все сами.</p>
            </div>
            <div className="p-6">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">B2B фокус</h3>
              <p className="text-gray-400">Специализированные решения для корпоративных клиентов.</p>
            </div>
            <div className="p-6">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Доставка по РК</h3>
              <p className="text-gray-400">Надежная доставка по Алматы и всему Казахстану.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2 text-primary">Последние проекты</h2>
              <p className="text-muted-foreground">Посмотрите, что мы создали для наших клиентов.</p>
            </div>
            <Link href="/portfolio">
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                Смотреть все <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProjectCard title="Мерч для конференции" category="Мерчендайзинг" image="/assets/portfolio-merch.png" />
            <ProjectCard title="Форма для персонала" category="Одежда" image="/assets/portfolio-clothing.png" />
            <ProjectCard title="Годовые отчеты" category="Печать" image="/assets/portfolio-printing.png" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-16 text-primary">Как мы работаем</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Запрос", desc: "Присылаете нам требования и детали." },
              { step: "02", title: "Дизайн", desc: "Создаем и утверждаем макет вместе с вами." },
              { step: "03", title: "Производство", desc: "Наша команда изготавливает ваш заказ." },
              { step: "04", title: "Доставка", desc: "Отправляем готовую продукцию по всей стране." }
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                <span className="text-6xl font-bold text-gray-100 absolute top-4 right-4 z-0">{item.step}</span>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-primary">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
           <div className="bg-primary rounded-2xl p-12 text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-6">Готовы начать проект?</h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto opacity-80">Закажите качественный мерч и печать для вашего бренда уже сегодня.</p>
              <LeadForm title="Запросить расчет" />
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
