import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "wouter";
import { ChevronDown, ChevronRight, SlidersHorizontal, X, Search, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { catalogCategories, findCategoryBySlug, findParentCategory, type CatalogCategory } from "@/data/catalogCategories";
import { cn, proxyImage } from "@/lib/utils";
import { colorNameToHex, isLightColor } from "@/lib/colors";
import { useSEO } from "@/hooks/useSEO";
import { SEO_MAP } from "@/data/seoData";
import { useCart } from "@/hooks/useCart";

interface ProductCard {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  isNew: boolean;
  isHit: boolean;
  isSale: boolean;
  article: string;
  variantCount: number;
}

interface ProductsResponse {
  products: ProductCard[];
  total: number;
  page: number;
  totalPages: number;
  brands: Array<{ name: string; count: number }>;
}

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₸";
}

function CategorySidebar({ activeSlug, onSelect }: { activeSlug: string; onSelect: (slug: string) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeSlug) {
      for (const cat of catalogCategories) {
        if (cat.children?.some(ch => ch.slug === activeSlug)) {
          setExpanded(prev => ({ ...prev, [cat.slug]: true }));
          break;
        }
        if (cat.slug === activeSlug) {
          setExpanded(prev => ({ ...prev, [cat.slug]: true }));
          break;
        }
      }
    }
  }, [activeSlug]);

  return (
    <div data-testid="category-sidebar">
      <button
        data-testid="category-all"
        onClick={() => onSelect("")}
        className={cn(
          "w-full text-left py-2 px-3 text-sm font-semibold rounded-lg mb-1 transition-colors",
          !activeSlug ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-50"
        )}
      >
        Все товары
      </button>
      {catalogCategories.map(cat => (
        <div key={cat.slug}>
          <div className="flex items-center">
            {cat.children && cat.children.length > 0 && (
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [cat.slug]: !prev[cat.slug] }))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expanded[cat.slug] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            )}
            <button
              data-testid={`category-${cat.slug}`}
              onClick={() => onSelect(cat.slug)}
              className={cn(
                "flex-1 text-left py-1.5 px-2 text-sm rounded-lg transition-colors",
                activeSlug === cat.slug ? "bg-gray-100 font-semibold text-black" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {cat.name}
            </button>
          </div>
          {expanded[cat.slug] && cat.children && (
            <div className="ml-6 border-l border-gray-200 pl-2">
              {cat.children.map(child => (
                <button
                  key={child.slug}
                  data-testid={`category-${child.slug}`}
                  onClick={() => onSelect(child.slug)}
                  className={cn(
                    "w-full text-left py-1 px-2 text-sm rounded transition-colors",
                    activeSlug === child.slug ? "bg-gray-100 font-semibold text-black" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  )}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProductCardComponent({ product }: { product: ProductCard }) {
  const [hovered, setHovered] = useState(false);
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const maxColors = 6;
  const displayColors = product.colors.slice(0, maxColors);
  const extraColors = product.colors.length - maxColors;

  return (
    <Link href={`/catalog/product/${product.id}`}>
      <div
        data-testid={`card-product-${product.id}`}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 group"
        style={{ boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.08)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.images[0] && (
            <img
              src={proxyImage(product.images[0])}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isHit && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">HIT</span>}
            {product.isSale && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">SALE</span>}
            {product.isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">NEW</span>}
          </div>
          <div className={cn(
            "absolute bottom-2 left-2 right-2 transition-opacity duration-200",
            hovered ? "opacity-100" : "opacity-0"
          )}>
            <span className="block text-center bg-black text-white text-xs py-2 rounded-lg font-medium">
              Подробнее
            </span>
          </div>
        </div>
        <div className="p-3">
          {displayColors.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {displayColors.map((color, i) => {
                const hex = colorNameToHex(color);
                const light = isLightColor(hex);
                return (
                  <span
                    key={i}
                    className="relative w-4 h-4 rounded-full inline-block cursor-pointer group/dot"
                    style={{
                      background: hex,
                      border: `1.5px solid ${light ? '#CBD5E1' : 'transparent'}`,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                    }}
                  >
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none z-10">
                      {color}
                    </span>
                  </span>
                );
              })}
              {extraColors > 0 && (
                <span className="text-[10px] text-gray-400 ml-0.5">+{extraColors}</span>
              )}
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] leading-tight">{product.name}</h3>
          {product.brand && <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>}
          <div className="mt-2">
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.oldPrice > 0 && product.oldPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 6).map((size, i) => (
                <span key={i} className="text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">{size}</span>
              ))}
            </div>
          )}
          <div className="flex gap-1.5 mt-2">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
              data-testid={`add-cart-${product.id}`}
              className={cn(
                "flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1",
                inCart
                  ? "bg-green-600 text-white"
                  : "bg-gray-900 text-white hover:bg-[#E8500A]"
              )}
            >
              {inCart ? '✓ В корзине' : '🛒 В корзину'}
            </button>
            <a
              href={`https://wa.me/77716246461?text=${encodeURIComponent(`Здравствуйте! Интересует: ${product.name} (${product.article})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`whatsapp-${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="py-2 px-3 flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-medium rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8" data-testid="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
      >
        ←
      </button>
      {pages.map((p, i) => (
        typeof p === "number" ? (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={cn(
              "w-9 h-9 text-sm rounded-lg transition-colors",
              p === page ? "bg-black text-white" : "border border-gray-200 hover:bg-gray-50"
            )}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="px-1 text-gray-400">…</span>
        )
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
      >
        →
      </button>
    </div>
  );
}

export default function Catalog() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);

  const categorySlug = params.get("category") || "";
  const searchQuery = params.get("search") || "";
  const sortBy = params.get("sort") || "";
  const pageNum = parseInt(params.get("page") || "1", 10);
  const brandFilter = params.get("brand") || "";
  const inStock = params.get("in_stock") === "true";
  const saleOnly = params.get("sale") === "true";
  const hitOnly = params.get("hit") === "true";
  const minPrice = params.get("min_price") || "";
  const maxPrice = params.get("max_price") || "";

  const seoEntry = SEO_MAP[categorySlug] || SEO_MAP["default"];
  useSEO(seoEntry.title, seoEntry.desc);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const updateParams = useCallback((updates: Record<string, string>) => {
    const current = new URLSearchParams(searchString);
    for (const [key, value] of Object.entries(updates)) {
      if (value) current.set(key, value);
      else current.delete(key);
    }
    if (!updates.page) current.set("page", "1");
    setLocation(`/catalog?${current.toString()}`);
  }, [searchString, setLocation]);

  const queryParams = new URLSearchParams();
  if (categorySlug) queryParams.set("category", categorySlug);
  if (searchQuery) queryParams.set("search", searchQuery);
  if (sortBy) queryParams.set("sort", sortBy);
  if (brandFilter) queryParams.set("brand", brandFilter);
  if (inStock) queryParams.set("in_stock", "true");
  if (saleOnly) queryParams.set("sale", "true");
  if (hitOnly) queryParams.set("hit", "true");
  if (minPrice) queryParams.set("min_price", minPrice);
  if (maxPrice) queryParams.set("max_price", maxPrice);
  queryParams.set("page", String(pageNum));
  queryParams.set("limit", "24");

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["/api/products", queryParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const currentCategory = categorySlug ? findCategoryBySlug(categorySlug) : null;
  const parentCategory = currentCategory ? findParentCategory(currentCategory.id) : null;
  const pageTitle = currentCategory?.h1 || "Каталог товаров с нанесением логотипа";

  const breadcrumbs = [{ name: "Главная", href: "/" }];
  if (parentCategory) {
    breadcrumbs.push({ name: parentCategory.name, href: `/catalog?category=${parentCategory.slug}` });
  }
  if (currentCategory) {
    breadcrumbs.push({ name: currentCategory.name, href: `/catalog?category=${currentCategory.slug}` });
  } else {
    breadcrumbs.push({ name: "Каталог", href: "/catalog" });
  }

  const filtersContent = (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-sm mb-3">Цена (₸)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="от"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            onBlur={() => updateParams({ min_price: priceMin })}
            onKeyDown={e => e.key === "Enter" && updateParams({ min_price: priceMin })}
            data-testid="input-min-price"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="до"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            onBlur={() => updateParams({ max_price: priceMax })}
            onKeyDown={e => e.key === "Enter" && updateParams({ max_price: priceMax })}
            data-testid="input-max-price"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
      {data?.brands && data.brands.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-3">Бренд</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {data.brands.map(b => (
              <label key={b.name} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded">
                <input
                  type="checkbox"
                  checked={brandFilter === b.name}
                  onChange={() => updateParams({ brand: brandFilter === b.name ? "" : b.name })}
                  className="rounded"
                />
                <span className="text-gray-700">{b.name}</span>
                <span className="text-gray-400 text-xs ml-auto">({b.count})</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={() => updateParams({ in_stock: inStock ? "" : "true" })}
          className="rounded"
          data-testid="checkbox-in-stock"
        />
        <span>В наличии</span>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4" data-testid="breadcrumbs">
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link href={bc.href} className="hover:text-gray-600">{bc.name}</Link>
              ) : (
                <span className="text-gray-700">{bc.name}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <h3 className="font-bold text-base mb-3">Категории</h3>
              <CategorySidebar
                activeSlug={categorySlug}
                onSelect={(slug) => updateParams({ category: slug })}
              />
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="font-bold text-base mb-3">Фильтры</h3>
                {filtersContent}
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-catalog-title">{pageTitle}</h1>
              {data && <span className="text-sm text-gray-400">{data.total} товаров</span>}
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button
                onClick={() => updateParams({ hit: hitOnly ? "" : "true" })}
                className={cn("px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors",
                  hitOnly ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
                data-testid="filter-hit"
              >
                🔥 HIT
              </button>
              <button
                onClick={() => updateParams({ sale: saleOnly ? "" : "true" })}
                className={cn("px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors",
                  saleOnly ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
                data-testid="filter-sale"
              >
                🏷️ СКИДКИ
              </button>

              <div className="ml-auto flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={e => updateParams({ sort: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white"
                  data-testid="select-sort"
                >
                  <option value="">По умолчанию</option>
                  <option value="price_asc">Сначала дешёвые</option>
                  <option value="price_desc">Сначала дорогие</option>
                  <option value="name">По названию</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>
            </div>

            <div className="lg:hidden flex gap-2 mb-4">
              <button
                onClick={() => setMobileCategoriesOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium"
                data-testid="button-mobile-categories"
              >
                <LayoutGrid className="h-4 w-4" /> Каталог
              </button>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium"
                data-testid="button-mobile-filters"
              >
                <SlidersHorizontal className="h-4 w-4" /> Фильтры
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : data && data.products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="product-grid">
                  {data.products.map(product => (
                    <ProductCardComponent key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={p => updateParams({ page: String(p) })}
                />
              </>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Товары не найдены</p>
                <p className="text-sm mt-1">Попробуйте изменить фильтры или категорию</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {mobileCategoriesOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileCategoriesOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Каталог</h3>
              <button onClick={() => setMobileCategoriesOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <CategorySidebar
              activeSlug={categorySlug}
              onSelect={(slug) => { updateParams({ category: slug }); setMobileCategoriesOpen(false); }}
            />
          </div>
        </div>
      )}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[70vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Фильтры</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            {filtersContent}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg font-medium"
            >
              Применить
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
