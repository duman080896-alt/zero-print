import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="font-heading font-bold text-2xl tracking-tighter mb-4 block">
              <span className="text-primary bg-white px-1 rounded-sm">ZERO</span><span className="text-white">PRINT</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Ваш надежный партнер в создании корпоративного мерча, брендирования и профессиональных печатных решений в Казахстане.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/zeroprint.kz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'}}
                data-testid="footer-instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/77716246461"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center transition-all hover:scale-110"
                data-testid="footer-whatsapp-icon"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Услуги</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/uslugi/vyshivka" className="hover:text-white transition-colors">Вышивка на одежде</Link></li>
              <li><Link href="/uslugi/pechat" className="hover:text-white transition-colors">Печать и нанесение</Link></li>
              <li><Link href="/uslugi/poshiv" className="hover:text-white transition-colors">Пошив одежды</Link></li>
              <li><Link href="/uslugi/brendirovanie" className="hover:text-white transition-colors">Брендирование сувениров</Link></li>
              <li><Link href="/poligrafiya" className="hover:text-white transition-colors">Полиграфия</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог товаров</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Компания</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">О нас</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition-colors">Портфолио</Link></li>
              <li><Link href="/kontakty" className="hover:text-white transition-colors">Контакты</Link></li>
              <li>
                <a href="https://wa.me/77716246461" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Заказать расчет
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Контакты</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div>г. Алматы, ул. Радостовца 152/6</div>
                  <div>офис 104</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <span className="text-base shrink-0 mt-0.5">💬</span>
                <div>
                  <div className="text-xs text-gray-500">WhatsApp (заказы)</div>
                  <a href="https://wa.me/77716246461" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-[#E8500A] transition-colors">
                    +7 771 624 64 61
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Звонки</div>
                  <a href="tel:+77001584039" className="text-white font-semibold hover:text-[#E8500A] transition-colors">
                    +7 700 158 40 39
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <a href="mailto:zeroprint.kz@gmail.com" className="hover:text-white transition-colors">zeroprint.kz@gmail.com</a>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <span className="text-base shrink-0">🕐</span>
                <span>Пн-Пт: 9:00 — 18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ZERO PRINT. Все права защищены.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
