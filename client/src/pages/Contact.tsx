import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { COMPANY, RESPONSE_LABEL } from "@shared/site";

const WHATSAPP_NUMBER = "77716246461";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useSEO(
    "Контакты ZERO PRINT — Алматы, Радостовца 152/6 | +7 700 158 40 39",
    "ZERO PRINT в Алматы: ул. Радостовца 152/6, офис 104. WhatsApp: +7 771 624 64 61. Звонки: +7 700 158 40 39. Брендирование, полиграфия, пошив одежды. Пн-Пт 9:00-18:00",
    "контакты ZERO PRINT, ZERO PRINT Алматы, полиграфия Алматы контакты"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Здравствуйте! Меня зовут ${name}.\nТелефон: ${phone}\nЧто нужно: ${message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-[#0a1628] text-white py-16" data-testid="section-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4" data-testid="hero-h1">Контакты ZERO PRINT в Алматы</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ответим за {RESPONSE_LABEL} и рассчитаем стоимость вашего заказа
          </p>
        </div>
      </section>

      <section className="py-20" data-testid="section-contacts">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm" data-testid="contact-whatsapp">
                <div className="flex items-start gap-4">
                  <div className="bg-[#25D366]/10 p-3 rounded-full flex-shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Основной номер · WhatsApp</p>
                    <p className="font-bold text-lg text-[#0a1628]">+7 771 624 64 61</p>
                    <a
                      href="https://wa.me/77716246461"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                      data-testid="button-whatsapp"
                    >
                      Написать →
                    </a>
                    <a
                      href={`tel:${COMPANY.phones.main.tel}`}
                      className="inline-flex items-center gap-2 mt-3 ml-2 border border-[#25D366] text-[#128C4A] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#25D366]/10 transition-colors"
                      data-testid="button-phone-main"
                    >
                      Позвонить →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm" data-testid="contact-phone">
                <div className="flex items-start gap-4">
                  <div className="bg-[#E8500A]/10 p-3 rounded-full flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Отдел продаж</p>
                    <p className="font-bold text-lg text-[#0a1628]">+7 700 158 40 39</p>
                    <a
                      href="tel:+77001584039"
                      className="inline-flex items-center gap-2 mt-3 bg-[#E8500A] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#d14709] transition-colors"
                      data-testid="button-phone"
                    >
                      Позвонить →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm" data-testid="contact-address">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Адрес</p>
                    <p className="font-bold text-[#0a1628]">г. Алматы, ул. Радостовца 152/6</p>
                    <p className="text-gray-500">офис 104</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${COMPANY.geo.latitude},${COMPANY.geo.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      data-testid="button-map-route"
                    >
                      Маршрут →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm" data-testid="contact-hours">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-2xl">🕐</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Часы работы</p>
                    <p className="font-bold text-[#0a1628]">{COMPANY.hours.weekdays}</p>
                    <p className="font-bold text-[#0a1628]">{COMPANY.hours.saturday}</p>
                    <p className="text-gray-500 text-sm">{COMPANY.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
                <iframe
                  src={`https://maps.google.com/maps?q=${COMPANY.geo.latitude},${COMPANY.geo.longitude}&z=17&hl=ru&output=embed`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="ZERO PRINT на карте"
                  data-testid="map-iframe"
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${COMPANY.geo.latitude},${COMPANY.geo.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#E8500A] transition-colors"
                data-testid="button-open-maps"
              >
                📍 Открыть в Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" data-testid="section-form">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-heading mb-4 text-[#0a1628]">Оставьте заявку</h2>
            <p className="text-gray-500">Перезвоним или напишем в WhatsApp в течение {COMPANY.responseMinutes} минут</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ваше имя"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]/20"
                data-testid="form-input-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Телефон</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+7 (___) ___-__-__"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]/20"
                data-testid="form-input-phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1628] mb-1.5">Что нужно</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Опишите ваш запрос..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] focus:ring-1 focus:ring-[#0a1628]/20 resize-none"
                data-testid="form-textarea-message"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl text-base font-bold hover:bg-[#20bd5a] transition-colors"
              data-testid="form-submit"
            >
              📱 Отправить через WhatsApp
            </button>
          </form>
        </div>
      </section>

      <section className="py-20" data-testid="section-directions">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading text-center mb-12 text-[#0a1628]">Как нас найти</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm" data-testid="directions-car">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="font-bold text-lg mb-2 text-[#0a1628]">На машине</h3>
              <p className="text-gray-500 text-sm">Ул. Радостовца 152/6. Парковка на территории бизнес-центра.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm" data-testid="directions-bus">
              <div className="text-3xl mb-3">🚌</div>
              <h3 className="font-bold text-lg mb-2 text-[#0a1628]">На общественном транспорте</h3>
              <p className="text-gray-500 text-sm">Автобусы: маршруты, следующие по ул. Радостовца.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
