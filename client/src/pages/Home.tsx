import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Truck, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/shared/ServiceCard";
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

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4 text-primary">Наши услуги</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Комплексные брендинговые решения для вашего бизнеса.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              title="Мерч и брендинг"
              description="Брендированная продукция: ручки, блокноты, бутылки и аксессуары."
              icon={<Users className="h-8 w-8" />}
              href="/portfolio"
              image="/assets/portfolio-merch.png"
            />
            <ServiceCard 
              title="Вышивка"
              description="Качественная вышивка на униформе, кепках и премиальной одежде."
              icon={<CheckCircle className="h-8 w-8" />}
              href="/poshiv"
              image="/assets/portfolio-clothing.png"
            />
            <ServiceCard 
              title="Пошив"
              description="Индивидуальный пошив униформы, спецодежды и промо-одежды."
              icon={<Users className="h-8 w-8" />}
              href="/poshiv"
              image="/assets/tailoring-hero.png"
            />
            <ServiceCard 
              title="Печать"
              description="Профессиональная печать каталогов, брошюр и бизнес-материалов."
              icon={<CheckCircle className="h-8 w-8" />}
              href="/poligrafiya"
              image="/assets/printing-hero.png"
            />
          </div>
        </div>
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
