import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Menu, Search, X, ChevronDown, Phone, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useClientAuth } from "@/hooks/useClientAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₸";
}

const WHATSAPP_URL = "https://wa.me/77716246461";

const catalogMegaMenu = {
  columns: [
    {
      title: "ОДЕЖДА",
      items: [
        { name: "Футболки", href: "/catalog?category=futbolki" },
        { name: "Куртки", href: "/catalog?category=kurtki" },
        { name: "Поло", href: "/catalog?category=polo" },
        { name: "Кепки", href: "/catalog?category=kepki" },
        { name: "Худи", href: "/catalog?category=hudi" },
        { name: "Брюки", href: "/catalog?category=bryuki" },
      ],
      footerLink: { name: "Вся одежда →", href: "/catalog?category=odezhda" },
    },
    {
      title: "АКСЕССУАРЫ",
      items: [
        { name: "Ручки", href: "/catalog?category=ruchki" },
        { name: "Зонты", href: "/catalog?category=zonty" },
        { name: "Сумки", href: "/catalog?category=sumki" },
        { name: "Термосы", href: "/catalog?category=termosy" },
        { name: "Кружки", href: "/catalog?category=kruzhki" },
        { name: "Канцтовары", href: "/catalog?category=kanctovary" },
      ],
      footerLink: { name: "Все аксессуары →", href: "/catalog" },
    },
    {
      title: "ПРОМО",
      items: [
        { name: "Сувениры", href: "/catalog?category=delovye-podarki" },
        { name: "Упаковка", href: "/catalog?category=upakovka" },
        { name: "Награды", href: "/catalog?category=delovye-podarki" },
        { name: "Антистресс", href: "/catalog?category=aksessuary" },
        { name: "Электроника", href: "/catalog?category=elektronika" },
        { name: "Спорт", href: "/catalog?category=dlya-sporta" },
      ],
      footerLink: { name: "Весь каталог →", href: "/catalog" },
    },
  ],
};

const poshivDropdown = [
  { name: "Пошив футболок", href: "/poshiv" },
  { name: "Пошив курток", href: "/poshiv" },
  { name: "Пошив рубашек и поло", href: "/poshiv" },
  { name: "Пошив головных уборов", href: "/poshiv" },
  { name: "Пошив худи и свитшотов", href: "/poshiv" },
  { name: "Пошив спецодежды", href: "/poshiv" },
  { name: "Пошив сумок и рюкзаков", href: "/poshiv" },
];

const uslugiItems = [
  { icon: "🧵", label: "Вышивка на одежде", href: "/uslugi/vyshivka", desc: "Машинная вышивка логотипа" },
  { icon: "🖨️", label: "Печать и нанесение", href: "/uslugi/pechat", desc: "DTF, шелкография, термотрансфер" },
  { icon: "👕", label: "Пошив одежды", href: "/uslugi/poshiv", desc: "Корпоративная одежда на заказ" },
  { icon: "🎁", label: "Брендирование сувениров", href: "/uslugi/brendirovanie", desc: "Нанесение логотипа на сувениры" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { totalQty } = useCart();
  const { client, isAuthenticated, logout } = useClientAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowResults(true);
        }
      } catch {}
    }, 300);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          <Link href="/" className="font-heading font-bold text-2xl tracking-tighter flex items-center gap-0.5 flex-shrink-0" data-testid="link-logo">
            <span className="text-primary">ZERO</span>
            <span className="text-white bg-primary px-1 rounded-sm">PRINT</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                placeholder="Поиск: ручки, термос, футболки..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 bg-gray-50"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setSearchResults([]); setShowResults(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
                  {searchResults.map(r => (
                    <Link
                      key={r.id}
                      href={`/catalog/product/${r.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => { setShowResults(false); setSearchQuery(""); }}
                      data-testid={`search-result-${r.id}`}
                    >
                      {r.image && (
                        <img src={r.image} alt="" className="w-10 h-10 object-contain rounded bg-gray-50" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                        {r.brand && <p className="text-xs text-gray-400">{r.brand}</p>}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 flex-shrink-0">{formatPrice(r.price)}</span>
                    </Link>
                  ))}
                  <Link
                    href={`/catalog?search=${encodeURIComponent(searchQuery)}`}
                    className="block text-center text-sm text-blue-500 py-3 border-t border-gray-100 hover:bg-gray-50"
                    onClick={() => { setShowResults(false); setSearchQuery(""); }}
                  >
                    Показать все результаты →
                  </Link>
                </div>
              )}
            </form>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href={isAuthenticated ? "/account" : "/account/login"}
              className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-lg transition-colors text-sm font-semibold text-gray-700 hover:border-[#0a1628] hover:text-[#0a1628]"
              data-testid="link-account"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">{isAuthenticated ? client?.name?.split(" ")[0] : "Войти"}</span>
            </Link>
            <Link
              href="/cart"
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 border-2 rounded-lg transition-colors text-sm font-semibold",
                totalQty > 0 ? "border-[#E8500A] bg-orange-50 text-gray-900" : "border-gray-200 text-gray-700 hover:border-[#E8500A]"
              )}
              data-testid="link-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden lg:inline">Корзина</span>
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E8500A] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center" data-testid="text-cart-count">
                  {totalQty}
                </span>
              )}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-whatsapp-header"
              className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#20bd5a] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2 ml-auto">
            <Link
              href={isAuthenticated ? "/account" : "/account/login"}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="mobile-link-account-icon"
            >
              {isAuthenticated && client ? (
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {client.name[0].toUpperCase()}
                </div>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2"
              data-testid="mobile-link-cart-icon"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E8500A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <nav className="flex flex-col gap-2 mt-6">
                  {isAuthenticated && client ? (
                    <div className="mb-4 space-y-2" data-testid="mobile-menu-auth-logged">
                      <Link
                        href="/account"
                        onClick={() => setIsOpen(false)}
                        data-testid="mobile-menu-account-link"
                      >
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 active:bg-orange-50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {client.name[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-sm">Привет, {client.name.split(" ")[0]}</div>
                              <div className="text-xs text-gray-400">Личный кабинет</div>
                            </div>
                          </div>
                          <span className="text-gray-400">›</span>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors"
                        data-testid="mobile-menu-logout"
                      >
                        <span>🚪</span> Выйти
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4 space-y-2" data-testid="mobile-menu-auth-guest">
                      <Link
                        href="/account/login"
                        onClick={() => setIsOpen(false)}
                        data-testid="mobile-menu-login-link"
                      >
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 active:bg-orange-50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm">
                              👤
                            </div>
                            <div>
                              <div className="font-bold text-sm">Войти в кабинет</div>
                              <div className="text-xs text-gray-400">История заказов, избранное</div>
                            </div>
                          </div>
                          <span className="text-gray-400">›</span>
                        </div>
                      </Link>
                      <Link
                        href="/account/register"
                        onClick={() => setIsOpen(false)}
                        data-testid="mobile-menu-register-link"
                      >
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 active:bg-orange-50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                              📝
                            </div>
                            <div>
                              <div className="font-bold text-sm">Зарегистрироваться</div>
                              <div className="text-xs text-gray-400">Создать личный кабинет</div>
                            </div>
                          </div>
                          <span className="text-gray-400">›</span>
                        </div>
                      </Link>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        setLocation(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
                        setIsOpen(false);
                      }
                    }}
                    className="relative mb-4"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Поиск по каталогу..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm"
                      data-testid="input-search-mobile-sheet"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </form>

                  <Link href="/" className="text-base font-medium py-2 hover:text-gray-600" onClick={() => setIsOpen(false)} data-testid="mobile-link-home">
                    Главная
                  </Link>

                  <button
                    type="button"
                    className="flex items-center justify-between text-base font-bold py-2 hover:text-gray-600 w-full text-left"
                    onClick={() => setMobileExpanded(mobileExpanded === "catalog" ? null : "catalog")}
                    data-testid="mobile-toggle-catalog"
                  >
                    Каталог
                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileExpanded === "catalog" && "rotate-180")} />
                  </button>
                  {mobileExpanded === "catalog" && (
                    <div className="pl-4 border-l border-gray-200 space-y-1">
                      {catalogMegaMenu.columns.map(col => (
                        <div key={col.title}>
                          <p className="text-xs font-bold text-gray-400 uppercase mt-2 mb-1">{col.title}</p>
                          {col.items.map(item => (
                            <Link key={item.name} href={item.href} className="block text-sm text-gray-600 py-1 hover:text-gray-900" onClick={() => setIsOpen(false)} data-testid={`mobile-catalog-${item.name}`}>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="flex items-center justify-between text-base font-bold py-2 hover:text-gray-600 w-full text-left"
                    onClick={() => setMobileExpanded(mobileExpanded === "uslugi" ? null : "uslugi")}
                    data-testid="mobile-toggle-uslugi"
                  >
                    Услуги
                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileExpanded === "uslugi" && "rotate-180")} />
                  </button>
                  {mobileExpanded === "uslugi" && (
                    <div className="pl-4 border-l border-gray-200 space-y-1">
                      {uslugiItems.map(item => (
                        <Link key={item.label} href={item.href} className="flex items-center gap-2 text-sm text-gray-600 py-1.5 hover:text-gray-900" onClick={() => setIsOpen(false)} data-testid={`mobile-uslugi-${item.label}`}>
                          <span>{item.icon}</span> {item.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link href="/poligrafiya" className="text-base font-medium py-2 hover:text-gray-600" onClick={() => setIsOpen(false)} data-testid="mobile-link-poligrafiya">
                    Полиграфия
                  </Link>
                  <Link href="/portfolio" className="text-base font-medium py-2 hover:text-gray-600" onClick={() => setIsOpen(false)} data-testid="mobile-link-portfolio">
                    Портфолио
                  </Link>
                  <Link href="/about" className="text-base font-medium py-2 hover:text-gray-600" onClick={() => setIsOpen(false)} data-testid="mobile-link-about">
                    О нас
                  </Link>
                  <Link href="/kontakty" className="text-base font-medium py-2 hover:text-gray-600" onClick={() => setIsOpen(false)} data-testid="mobile-link-kontakty">
                    Контакты
                  </Link>

                  <div className="mt-4 space-y-2">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                      data-testid="mobile-link-whatsapp"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                      WhatsApp
                    </a>
                    <a
                      href="tel:+77716246461"
                      className="flex items-center justify-center gap-2 bg-[#E8500A] text-white py-3 rounded-xl text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                      data-testid="mobile-link-phone"
                    >
                      <Phone className="w-4 h-4" />
                      +7 771 624 64 61
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 pb-2 -mt-1 relative">
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("catalog")}
            onMouseLeave={handleDropdownLeave}
          >
            <Link
              href="/catalog"
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                location === "/catalog" || location.startsWith("/catalog?") ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"
              )}
              data-testid="nav-catalog"
            >
              Каталог
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {activeDropdown === "catalog" && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6 min-w-[600px]" data-testid="megamenu-catalog">
                <div className="grid grid-cols-3 gap-8">
                  {catalogMegaMenu.columns.map(col => (
                    <div key={col.title}>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{col.title}</p>
                      <div className="space-y-1.5">
                        {col.items.map(item => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                            data-testid={`megamenu-${item.name}`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={col.footerLink.href}
                        className="block text-sm text-blue-500 font-medium mt-3 px-2 hover:text-blue-700"
                        onClick={() => setActiveDropdown(null)}
                        data-testid={`megamenu-footer-${col.title}`}
                      >
                        {col.footerLink.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("uslugi")}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                location.startsWith("/uslugi") ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"
              )}
              data-testid="nav-uslugi"
            >
              Услуги
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {activeDropdown === "uslugi" && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 min-w-[300px]" data-testid="dropdown-uslugi">
                <div className="space-y-0.5">
                  {uslugiItems.map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setActiveDropdown(null)}
                      data-testid={`dropdown-uslugi-${item.label}`}
                    >
                      <span className="text-lg mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/poligrafiya"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              location === "/poligrafiya" ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"
            )}
            data-testid="nav-poligrafiya"
          >
            Полиграфия
          </Link>
          <Link
            href="/portfolio"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              location === "/portfolio" ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"
            )}
            data-testid="nav-portfolio"
          >
            Портфолио
          </Link>
          <Link
            href="/about"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              location === "/about" ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"
            )}
            data-testid="nav-about"
          >
            О нас
          </Link>
          <Link
            href="/kontakty"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
              location === "/kontakty" ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"
            )}
            data-testid="nav-kontakty"
          >
            Контакты
          </Link>
        </nav>
      </div>

      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              setLocation(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          className="relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск: ручки, термос..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm bg-gray-50"
            data-testid="input-search-mobile"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </form>
      </div>
    </header>
  );
}
