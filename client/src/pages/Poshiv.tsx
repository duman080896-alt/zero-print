import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { Shirt, Shield, Award, Package, Briefcase } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const WHATSAPP_URL = "https://wa.me/77716246461";

const services = [
  { name: "Футболки", price: "от 2 000 ₸", icon: Shirt },
  { name: "Куртки", price: "от 8 000 ₸", icon: Shield },
  { name: "Поло", price: "от 3 500 ₸", icon: Shirt },
  { name: "Худи", price: "от 5 000 ₸", icon: Package },
  { name: "Спецодежда", price: "от 6 000 ₸", icon: Briefcase },
  { name: "Сумки", price: "от 4 000 ₸", icon: Package },
];

const steps = [
  { num: 1, title: "Заявка", desc: "Пишете нам в WhatsApp" },
  { num: 2, title: "Дизайн", desc: "Разрабатываем эскиз бесплатно" },
  { num: 3, title: "Пошив", desc: "Производим в нашем цеху" },
  { num: 4, title: "Доставка", desc: "Отправляем по всему Казахстану" },
];

const advantages = [
  "Собственный швейный цех в Алматы",
  "Производство от 1 штуки",
  "Разработка дизайна бесплатно",
  "Гарантия качества",
  "Доставка по всему Казахстану",
  "Срок от 7 рабочих дней",
];

const clothingTypes = ["Футболки", "Куртки", "Поло", "Худи", "Спецодежда", "Сумки"];

export default function Poshiv() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [clothingType, setClothingType] = useState("");
  const [quantity, setQuantity] = useState("");

  useSEO(
    "Пошив одежды на заказ в Казахстане | ZERO PRINT",
    "Пошив корпоративной одежды под ключ в Алматы: футболки, куртки, спецодежда, худи. Собственный цех. От 1 штуки. ZERO PRINT ☎ +7 771 624 64 61",
    "пошив одежды на заказ Алматы, пошив корпоративной одежды Казахстан, швейный цех Алматы, пошив футболок, пошив спецодежды"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Заявка на пошив%0AИмя: ${name}%0AТелефон: ${phone}%0AТип одежды: ${clothingType}%0AКоличество: ${quantity}`;
    window.open(`${WHATSAPP_URL}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <h1 className="sr-only">Пошив одежды на заказ в Казахстане</h1>

      <section className="relative min-h-[450px] flex items-center justify-center text-white" data-testid="section-hero">
        <div className="absolute inset-0 z-0 bg-[#0a1628]">
          <img
            src="/assets/tailoring-hero.png"
            alt="Пошив корпоративной одежды"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container relative z-10 px-4 text-center py-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Пошив корпоративной одежды под ключ</h2>
          <p className="text-xl max-w-2xl mx-auto text-gray-200 mb-8">
            От разработки дизайна до готового изделия. Работаем с компаниями по всему Казахстану
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#20bd5a] transition-colors"
              data-testid="button-hero-whatsapp"
            >
              Рассчитать стоимость
            </a>
            <a
              href="/portfolio"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
              data-testid="button-hero-portfolio"
            >
              Смотреть примеры работ
            </a>
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-services">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-primary">Услуги пошива</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-service-${s.name}`}>
                  <Icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-1">{s.name}</h3>
                  <p className="text-accent font-semibold text-lg mb-4">{s.price}</p>
                  <a
                    href={`${WHATSAPP_URL}?text=Здравствуйте! Интересует пошив: ${s.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                    data-testid={`button-whatsapp-${s.name}`}
                  >
                    Написать в WhatsApp
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" data-testid="section-steps">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-primary">Как мы работаем</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center" data-testid={`step-${step.num}`}>
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-advantages">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-primary">Преимущества</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, i) => (
              <div key={i} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm" data-testid={`advantage-${i}`}>
                <Award className="h-8 w-8 text-accent flex-shrink-0" />
                <span className="font-medium text-lg">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" data-testid="section-form">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-heading mb-4 text-primary">Форма заявки</h2>
            <p className="text-muted-foreground">
              Заполните форму и мы свяжемся с вами через WhatsApp
            </p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                data-testid="input-name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Телефон</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                data-testid="input-phone"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Тип одежды</label>
              <select
                value={clothingType}
                onChange={(e) => setClothingType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                data-testid="select-clothing-type"
                required
              >
                <option value="">Выберите тип</option>
                {clothingTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Количество</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Количество штук"
                min="1"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                data-testid="input-quantity"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-medium hover:bg-[#20bd5a] transition-colors"
              data-testid="button-submit-form"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              Отправить в WhatsApp
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
