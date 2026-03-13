import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectCard from "@/components/shared/ProjectCard";
import { useSEO } from "@/hooks/useSEO";

const projects = [
  { id: 1, title: "Мерч для IT-конференции", category: "Мерч", image: "/assets/portfolio-merch.png" },
  { id: 2, title: "Униформа для отеля", category: "Одежда", image: "/assets/portfolio-clothing.png" },
  { id: 3, title: "Финансовые отчеты", category: "Печать", image: "/assets/portfolio-printing.png" },
  { id: 4, title: "Футболки для летнего мероприятия", category: "Одежда", image: "/assets/home-hero.png" },
  { id: 5, title: "Подарочные наборы", category: "Мерч", image: "/assets/portfolio-merch.png" },
  { id: 6, title: "Маркетинговые брошюры", category: "Печать", image: "/assets/printing-hero.png" },
  { id: 7, title: "Спецодежда для застройщика", category: "Одежда", image: "/assets/tailoring-hero.png" },
  { id: 8, title: "Набор для запуска бренда", category: "Мерч", image: "/assets/home-hero.png" },
  { id: 9, title: "Каталоги продукции", category: "Печать", image: "/assets/portfolio-printing.png" },
];

const categories = ["Все", "Одежда", "Мерч", "Печать"];

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
