import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { catalogCategories, findCategoryById, findParentCategory } from "@/data/catalogCategories";
import { cn, proxyImage } from "@/lib/utils";
import { colorNameToHex, isLightColor } from "@/lib/colors";
import { useCart } from "@/hooks/useCart";

interface ProductVariant {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  oldPrice: number;
  article: string;
  images: string[];
  stock: number;
  attributes: Record<string, string>;
}

interface Product {
  id: string;
  name: string;
  fullName: string;
  brand: string;
  price: number;
  oldPrice: number;
  categories: number[];
  primaryCategory: number;
  images: string[];
  description: string;
  rating: number;
  colors: string[];
  sizes: string[];
  variants: ProductVariant[];
  stock: number;
  article: string;
  brandingMethods: string[];
  isNew: boolean;
  isHit: boolean;
  isSale: boolean;
}

interface RelatedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  isNew: boolean;
  isHit: boolean;
  isSale: boolean;
}

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₸";
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "branding" | "delivery">("desc");
  const { addItem, isInCart } = useCart();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    },
  });

  const { data: related } = useQuery<RelatedProduct[]>({
    queryKey: [`/api/products/${id}/related`],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}/related`);
      return res.json();
    },
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-100 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-2/3" />
                <div className="h-6 bg-gray-100 rounded w-1/4" />
                <div className="h-10 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <Link href="/catalog" className="text-blue-500 hover:underline">Вернуться в каталог</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentVariant = product.variants.find(v => {
    if (selectedColor && selectedSize) return v.color === selectedColor && v.size === selectedSize;
    if (selectedColor) return v.color === selectedColor;
    if (selectedSize) return v.size === selectedSize;
    return false;
  }) || product.variants[0];

  const displayImages = selectedColor
    ? product.variants.filter(v => v.color === selectedColor).flatMap(v => v.images).filter((v, i, a) => a.indexOf(v) === i).slice(0, 8)
    : product.images;

  const displayPrice = currentVariant?.price || product.price;
  const displayOldPrice = currentVariant?.oldPrice || product.oldPrice;
  const displayStock = currentVariant?.stock ?? product.stock;
  const displayArticle = currentVariant?.article || product.article;

  const category = findCategoryById(product.primaryCategory);
  const parentCat = category ? findParentCategory(category.id) : null;

  const breadcrumbs = [{ name: "Главная", href: "/" }, { name: "Каталог", href: "/catalog" }];
  if (parentCat) breadcrumbs.push({ name: parentCat.name, href: `/catalog?category=${parentCat.slug}` });
  if (category) breadcrumbs.push({ name: category.name, href: `/catalog?category=${category.slug}` });
  breadcrumbs.push({ name: product.name, href: "" });

  const allAttributes: Record<string, string> = {};
  if (currentVariant) {
    Object.entries(currentVariant.attributes).forEach(([k, v]) => {
      if (!k.includes("Штрихкод") && !k.includes("Производство")) allAttributes[k] = v;
    });
  }

  const inCart = isInCart(product.id);

  const whatsappText = `Здравствуйте! Хочу заказать: ${product.name}${selectedColor ? `, цвет: ${selectedColor}` : ""}${selectedSize ? `, размер: ${selectedSize}` : ""} (арт. ${displayArticle})`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap" data-testid="breadcrumbs">
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
              {displayImages[selectedImage] && (
                <img
                  src={proxyImage(displayImages[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-contain p-6"
                  data-testid="img-product-main"
                />
              )}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.isHit && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">HIT</span>}
                {product.isSale && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                    i === selectedImage ? "border-black" : "border-gray-200 hover:border-gray-400"
                  )}
                  data-testid={`img-thumb-${i}`}
                >
                  <img src={proxyImage(img)} alt="" className="w-full h-full object-contain p-1 bg-gray-50" />
                </button>
              ))}
            </div>
          </div>

          <div>
            {product.brand && (
              <p className="text-sm text-gray-400 mb-1">Бренд: <span className="text-gray-600">{product.brand}</span></p>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-product-name">{product.name}</h1>

            {product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  Цвет: <span className="text-gray-900 font-medium">{selectedColor || "не выбран"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => {
                    const hex = colorNameToHex(color);
                    const light = isLightColor(hex);
                    return (
                      <button
                        key={color}
                        onClick={() => { setSelectedColor(selectedColor === color ? "" : color); setSelectedImage(0); }}
                        className={cn(
                          "relative w-9 h-9 rounded-full border-2 transition-all cursor-pointer group/color",
                          selectedColor === color ? "border-black scale-110 ring-2 ring-black ring-offset-2" : light ? "border-gray-300 hover:border-gray-500" : "border-transparent hover:border-gray-500"
                        )}
                        style={{
                          background: hex,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        }}
                        data-testid={`color-${color}`}
                      >
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[11px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none z-10">
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  Размер: <span className="text-gray-900 font-medium">{selectedSize || "не выбран"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                      className={cn(
                        "px-3 py-1.5 border rounded-lg text-sm font-medium transition-all",
                        selectedSize === size ? "bg-black text-white border-black" : "border-gray-300 text-gray-700 hover:border-gray-500"
                      )}
                      data-testid={`size-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900" data-testid="text-product-price">{formatPrice(displayPrice)}</span>
                {displayOldPrice > 0 && displayOldPrice > displayPrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(displayOldPrice)}</span>
                )}
              </div>
              <p className={cn("text-sm mt-1", displayStock > 0 ? "text-green-600" : "text-gray-400")}>
                {displayStock > 0 ? `✓ В наличии: ${displayStock} шт.` : "✗ Нет в наличии"}
              </p>
              {displayArticle && (
                <p className="text-sm text-gray-400 mt-1">Артикул: {displayArticle}</p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => addItem(product)}
                data-testid="button-add-cart"
                className={cn(
                  "w-full flex items-center justify-center gap-2 text-white text-base font-bold py-3.5 rounded-xl transition-all hover:-translate-y-0.5",
                  inCart
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-900 hover:bg-[#E8500A] hover:shadow-lg hover:shadow-orange-200"
                )}
              >
                {inCart ? '✓ Добавлен в корзину' : '🛒 Добавить в корзину'}
              </button>
              <a
                href={`https://wa.me/77716246461?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-whatsapp-order"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-base font-semibold py-3.5 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.755-6.273-2.035l-.438-.326-3.275 1.098 1.098-3.275-.326-.438A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Заказать в WhatsApp
              </a>
              <a
                href={`https://wa.me/77716246461?text=${encodeURIComponent(`Здравствуйте! Прошу прислать прайс-лист на: ${product.name} (арт. ${displayArticle})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-request-price"
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 text-base font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                📋 Запросить прайс
              </a>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex border-b border-gray-200 mb-6">
            {(["desc", "specs", "branding", "delivery"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-testid={`tab-${tab}`}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                {{ desc: "Описание", specs: "Характеристики", branding: "Нанесение", delivery: "Доставка" }[tab]}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === "desc" && (
              <div className="prose prose-sm text-gray-600" data-testid="tab-content-desc">
                <p>{product.description || "Описание товара отсутствует."}</p>
              </div>
            )}

            {activeTab === "specs" && (
              <div data-testid="tab-content-specs">
                {Object.keys(allAttributes).length > 0 ? (
                  <table className="w-full">
                    <tbody>
                      {Object.entries(allAttributes).map(([key, value], i) => (
                        <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                          <td className="py-2.5 px-4 text-sm text-gray-500 w-1/3">{key}</td>
                          <td className="py-2.5 px-4 text-sm text-gray-900">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-400">Характеристики не указаны</p>
                )}
              </div>
            )}

            {activeTab === "branding" && (
              <div className="space-y-4" data-testid="tab-content-branding">
                <p className="text-gray-600">Возможные методы нанесения логотипа:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.brandingMethods.length > 0 ? (
                    product.brandingMethods.map(m => <li key={m}>{m}</li>)
                  ) : (
                    <>
                      <li>Шелкография</li>
                      <li>Вышивка</li>
                      <li>DTF-печать</li>
                      <li>Термотрансфер</li>
                    </>
                  )}
                </ul>
                <p className="text-gray-500 text-sm">Узнайте стоимость нанесения у менеджера</p>
                <a
                  href={`https://wa.me/77716246461?text=${encodeURIComponent(`Здравствуйте! Интересует нанесение логотипа на: ${product.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  Написать в WhatsApp
                </a>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-3 text-gray-600" data-testid="tab-content-delivery">
                <p className="font-medium text-gray-900">Доставка по всему Казахстану</p>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Алматы</span><span className="font-medium text-gray-900">1-2 дня</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Астана</span><span className="font-medium text-gray-900">2-4 дня</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Другие города</span><span className="font-medium text-gray-900">3-7 дней</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Работаем от 1 штуки. Оптовые скидки при заказе от 50 шт.</p>
              </div>
            )}
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4">Похожие товары</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {related.map(p => (
                <Link key={p.id} href={`/catalog/product/${p.id}`}>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" data-testid={`related-${p.id}`}>
                    <div className="aspect-square bg-gray-50 p-3">
                      {p.images[0] && <img src={proxyImage(p.images[0])} alt={p.name} className="w-full h-full object-contain" loading="lazy" />}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{p.name}</h3>
                      {p.brand && <p className="text-xs text-gray-400 mt-0.5">{p.brand}</p>}
                      <p className="text-sm font-bold mt-1">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
