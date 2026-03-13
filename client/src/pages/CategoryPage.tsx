import { useRoute, Link } from "wouter";
import { categoriesData } from "@/data/categories";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LeadForm from "@/components/shared/LeadForm";
import { CheckCircle, ChevronRight, Star, Shield, Zap, Target } from "lucide-react";
import { Helmet } from "react-helmet"; // Using standard title update instead

export default function CategoryPage({ section }: { section: "tekstil" | "poligrafiya" }) {
  const [match, params] = useRoute(`/${section}/:slug`);
  
  if (!match || !params?.slug) {
    return <div>Page not found</div>;
  }

  const categorySection = categoriesData[section];
  const item = categorySection.items.find(i => i.slug === params.slug);

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <title>{`${item.h1} | ZERO PRINT`}</title>
      <meta name="description" content={item.desc} />
      <meta name="keywords" content={item.keywords} />
      
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm text-muted-foreground">
          <Link href="/"><a className="hover:text-primary transition-colors">Главная</a></Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={section === "tekstil" ? "/tailoring" : "/printing"}>
            <a className="hover:text-primary transition-colors">{categorySection.name}</a>
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-primary font-medium">{item.title}</span>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Content */}
            <div>
              <span className="text-accent font-bold tracking-wider uppercase text-sm mb-4 block">
                {categorySection.name}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-primary leading-tight">
                {item.h1}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {item.desc}
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/5 p-2 rounded-full mt-1">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Премиум качество</h3>
                    <p className="text-muted-foreground text-sm">Используем только лучшие материалы и передовые технологии.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/5 p-2 rounded-full mt-1">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Высокая скорость</h3>
                    <p className="text-muted-foreground text-sm">Соблюдаем сроки и оперативно выполняем даже сложные заказы.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/5 p-2 rounded-full mt-1">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Индивидуальный подход</h3>
                    <p className="text-muted-foreground text-sm">Адаптируем решения под задачи и бюджет вашего бизнеса.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold mb-3 text-primary">Этапы работы:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-accent" /> Оформление заявки</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-accent" /> Согласование макета</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-accent" /> Производство</li>
                  <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-accent" /> Доставка готовой продукции</li>
                </ul>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img 
                  src={section === "tekstil" ? "/assets/tailoring-hero.png" : "/assets/printing-hero.png"} 
                  alt={item.title} 
                  loading="lazy"
                  className="w-full h-[250px] object-cover"
                />
              </div>
              <LeadForm 
                title={`Заказать: ${item.title}`} 
                description="Оставьте заявку, и мы рассчитаем стоимость вашего проекта." 
              />
            </div>

          </div>
        </div>
      </section>

      {/* SEO Text Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold font-heading mb-4 text-primary">Почему стоит заказать у нас?</h2>
          <div className="prose text-muted-foreground">
            <p>
              Компания ZERO PRINT предлагает профессиональные услуги для бизнеса в Алматы и по всему Казахстану. 
              {item.title} — это отличный способ подчеркнуть статус вашей компании, повысить узнаваемость бренда 
              и обеспечить команду качественными материалами.
            </p>
            <p className="mt-4">
              Мы используем современное оборудование, что позволяет нам гарантировать стойкость нанесения, 
              четкость изображений и долговечность готовой продукции. Независимо от тиража, мы обеспечиваем 
              строгий контроль качества на каждом этапе производства.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
