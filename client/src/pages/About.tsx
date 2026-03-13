import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function About() {
  useSEO("О компании ZERO PRINT — корпоративный мерч в Казахстане", "ZERO PRINT — ведущий B2B поставщик корпоративных брендинговых решений в Казахстане. Мерч, пошив, полиграфия.");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8 text-primary">О компании ZERO PRINT</h1>
            
            <div className="prose prose-lg text-muted-foreground mb-12">
              <p className="mb-6">
                ZERO PRINT — ведущий B2B поставщик корпоративных брендинговых решений в Казахстане. 
                Мы специализируемся на помощи компаниям в создании сильного визуального образа через 
                качественный мерч, профессиональную одежду и премиальные печатные услуги.
              </p>
              <p className="mb-6">
                Базируясь в Алматы и имея возможности доставки по всей стране, мы обслуживаем предприятия 
                любого размера — от стартапов до крупных корпораций. Наша миссия — обеспечивать надежное, 
                высококачественное и своевременное производство, которое помогает нашим клиентам добиваться успеха.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-primary">Наша миссия</h3>
                <p>Предоставлять бизнесу осязаемые инструменты брендинга, которые оставляют неизгладимое впечатление.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-primary">B2B фокус</h3>
                <p>Мы понимаем корпоративные потребности: строгие сроки, оптовые заказы и стабильное качество.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold font-heading mb-6 text-primary">Почему стоит работать с нами?</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Собственное производство",
                "Контроль качества",
                "Персональные менеджеры",
                "Конкурентные цены",
                "Помощь с дизайном",
                "Быстрое исполнение"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
