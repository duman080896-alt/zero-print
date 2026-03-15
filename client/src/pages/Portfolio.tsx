import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectCard from "@/components/shared/ProjectCard";
import { useSEO } from "@/hooks/useSEO";

const projects = [
  { id: 1,  title: "Вышивка поло — Doner na Abaya",         category: "Вышивка",  image: "/assets/portfolio/vyshivka-doner.jpg" },
  { id: 2,  title: "Вышивка кепки и поло — Salam Bro",      category: "Вышивка",  image: "/assets/portfolio/vyshivka-salambro.jpg" },
  { id: 3,  title: "Вышивка курток — Magnum GO",             category: "Вышивка",  image: "/assets/portfolio/vyshivka-magnum.jpg" },
  { id: 4,  title: "Вышивка спецодежды — Пром Привод",       category: "Вышивка",  image: "/assets/portfolio/vyshivka-prom.jpg" },
  { id: 5,  title: "Поло с вышивкой — Лукойл",               category: "Вышивка",  image: "/assets/portfolio/lukoil-polo.jpg" },
  { id: 6,  title: "Корпоративные куртки — DIA Properties",  category: "Одежда",   image: "/assets/portfolio/dia-jackets.jpg" },
  { id: 7,  title: "Жилет с логотипом — Аманат",             category: "Одежда",   image: "/assets/portfolio/amanat-vest.jpg" },
  { id: 8,  title: "Корпоративные поло — Colgate",           category: "Одежда",   image: "/assets/portfolio/colgate-polo.jpg" },
  { id: 9,  title: "Брендированные футболки — Coca-Cola",    category: "Одежда",   image: "/assets/portfolio/cocacola-tshirt.jpg" },
  { id: 10, title: "Корпоративная толстовка — Prima",        category: "Одежда",   image: "/assets/portfolio/prima-jacket.jpg" },
  { id: 11, title: "Мерч набор — METU Колледж",              category: "Мерч",     image: "/assets/portfolio/metu-merch.jpg" },
  { id: 12, title: "Подарочный набор — Batyrzhan Cup",       category: "Мерч",     image: "/assets/portfolio/batyrzhan-cup.jpg" },
  { id: 13, title: "Брендированные зонты — Krušovice",       category: "Мерч",     image: "/assets/portfolio/krushovice-umbrellas.jpg" },
  { id: 14, title: "Брендированная сумка — Canon",           category: "Мерч",     image: "/assets/portfolio/canon-bag.jpg" },
  { id: 15, title: "Поло и кепка — Алматинские тепловые сети", category: "Одежда", image: "/assets/portfolio/almatyteplo-polo.jpg" },
  { id: 16, title: "Футболка с логотипом — Euro Super Pens", category: "Одежда",   image: "/assets/portfolio/euro-tshirt.jpg" },
];

const categories = ["Все", "Вышивка", "Одежда", "Мерч"];

export default function Portfolio() {
  useSEO("Портфолио — наши работы | ZERO PRINT", "Примеры работ ZERO PRINT: корпоративный мерч, пошив одежды, полиграфия. Смотрите реализованные проекты.");
  const [filter, setFilter] = useState("Все");

  const filteredProjects = projects.filter(project => 
    filter === "Все" ? true : project.category === filter
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Наше портфолио</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-300">
            Ознакомьтесь с нашими недавними работами по пошиву, печати и созданию мерча.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[500px]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-6 py-2 rounded-full",
                  filter === cat ? "bg-accent hover:bg-accent/90 text-white border-accent" : "bg-white hover:bg-gray-100"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id}
                title={project.title}
                category={project.category}
                image={project.image}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
