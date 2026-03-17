import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useManagerAuth } from "@/hooks/useManagerAuth";

interface ProductItem {
  type: "product";
  productId: number;
  name: string;
  qty: number;
  price: number;
  image?: string;
  brand?: string;
}

interface ServiceItem {
  type: "service";
  serviceType: string;
  name: string;
  description: string;
  photos: string[];
  qty: number;
  price: number;
}

type KpLineItem = ProductItem | ServiceItem;

interface SearchResult {
  id: number;
  name: string;
  price: number;
  [key: string]: any;
}

const SERVICE_TYPES = [
  "Пошив одежды",
  "Брендирование сувениров",
  "Печать и нанесение",
  "Вышивка на одежде",
  "Полиграфия",
];

const SERVICE_ICONS: Record<string, string> = {
  "Пошив одежды": "🧵",
  "Брендирование сувениров": "🎁",
  "Печать и нанесение": "🖨️",
  "Вышивка на одежде": "🪡",
  "Полиграфия": "📄",
};

export default function KpCreate() {
  const [, setLocation] = useLocation();
  const { getToken } = useManagerAuth();

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [branding, setBranding] = useState("");
  const [comment, setComment] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [items, setItems] = useState<KpLineItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [svcType, setSvcType] = useState(SERVICE_TYPES[0]);
  const [svcName, setSvcName] = useState("");
  const [svcDesc, setSvcDesc] = useState("");
  const [svcPrice, setSvcPrice] = useState(0);
  const [svcQty, setSvcQty] = useState(1);
  const [svcPhotos, setSvcPhotos] = useState<string[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setSearchResults(await res.json());
    } catch { } finally { setSearching(false); }
  };

  const addProduct = (product: SearchResult) => {
    if (items.some((it) => it.type === "product" && (it as ProductItem).productId === product.id)) return;
    setItems([...items, {
      type: "product",
      productId: product.id,
      name: product.name,
      qty: 1,
      price: product.price || 0,
      image: product.image || "",
      brand: product.brand || "",
    }]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const compressImage = (file: File, maxBytes = 900_000): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const MAX_DIM = 1200;
        if (width > MAX_DIM || height > MAX_DIM) {
          const scale = MAX_DIM / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        let quality = 0.85;
        let result = canvas.toDataURL("image/jpeg", quality);
        while (result.length > maxBytes && quality > 0.3) {
          quality -= 0.1;
          result = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(result);
      };
      img.src = url;
    });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (svcPhotos.length + files.length > 3) {
      alert("Максимум 3 фото");
      return;
    }
    files.forEach((file) => {
      compressImage(file).then((data) => {
        setSvcPhotos((prev) => [...prev, data]);
      });
    });
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const addService = () => {
    if (!svcName.trim()) { alert("Укажите название услуги"); return; }
    if (svcPrice <= 0) { alert("Укажите цену услуги"); return; }
    setItems([...items, {
      type: "service",
      serviceType: svcType,
      name: svcName.trim(),
      description: svcDesc.trim(),
      photos: svcPhotos,
      qty: svcQty,
      price: svcPrice,
    }]);
    setSvcName("");
    setSvcDesc("");
    setSvcPrice(0);
    setSvcQty(1);
    setSvcPhotos([]);
  };

  const updateItemField = (index: number, field: "qty" | "price", value: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const grandTotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = items.map((it) => {
        if (it.type === "product") {
          const p = it as ProductItem;
          return { type: "product", productId: p.productId, name: p.name, qty: p.qty, price: p.price, image: p.image || "", brand: p.brand || "" };
        } else {
          const s = it as ServiceItem;
          return { type: "service", serviceType: s.serviceType, name: s.name, description: s.description, photos: s.photos, qty: s.qty, price: s.price };
        }
      });
      const res = await fetch("/api/manager/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ title, clientName, clientContact, branding, comment, validDays, items: payload, total: grandTotal }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.message || "Ошибка создания КП");
        return;
      }
      setLocation("/manager");
    } catch {
      setError("Ошибка сервера");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    color: "#0a1628",
    marginBottom: 6,
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  };

  return (
    <div data-testid="kp-create-page" style={{ minHeight: "100vh", background: "#f8f9fb", padding: 32 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0a1628" }}>Создать коммерческое предложение</h1>
          <button data-testid="button-back" onClick={() => setLocation("/manager")} style={{ background: "transparent", border: "1px solid #ddd", borderRadius: 6, padding: "8px 16px", fontSize: 14, cursor: "pointer", color: "#0a1628" }}>
            ← Назад
          </button>
        </div>

        {error && (
          <div data-testid="text-kp-error" style={{ background: "#fee", color: "#c00", padding: "10px 14px", borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic info */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a1628", marginBottom: 16 }}>Информация</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Название КП</label>
                <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} placeholder="Название предложения" />
              </div>
              <div>
                <label style={labelStyle}>Имя клиента</label>
                <input data-testid="input-clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required style={inputStyle} placeholder="ФИО или компания" />
              </div>
              <div>
                <label style={labelStyle}>Контакт клиента</label>
                <input data-testid="input-clientContact" value={clientContact} onChange={(e) => setClientContact(e.target.value)} style={inputStyle} placeholder="Телефон или email" />
              </div>
              <div>
                <label style={labelStyle}>Брендирование</label>
                <input data-testid="input-branding" value={branding} onChange={(e) => setBranding(e.target.value)} style={inputStyle} placeholder="Тип брендирования" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Комментарий</label>
                <textarea data-testid="input-comment" value={comment} onChange={(e) => setComment(e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Дополнительные пожелания..." />
              </div>
              <div>
                <label style={labelStyle}>Действует (дней)</label>
                <input data-testid="input-validDays" type="number" value={validDays} onChange={(e) => setValidDays(Number(e.target.value))} min={1} max={365} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Products search */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a1628", marginBottom: 16 }}>Товары из каталога</h3>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <input data-testid="input-product-search" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} style={inputStyle} placeholder="Поиск товара по каталогу..." />
              {searching && <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Поиск...</div>}
              {searchResults.length > 0 && (
                <div data-testid="search-results" style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ddd", borderRadius: 6, maxHeight: 200, overflowY: "auto", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  {searchResults.map((p) => (
                    <div key={p.id} data-testid={`search-result-${p.id}`} onClick={() => addProduct(p)} style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
                      <span>{p.name}</span>
                      <span style={{ color: "#888" }}>{Number(p.price || 0).toLocaleString("ru-RU")} ₸</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add service section */}
          <div style={{ ...cardStyle, border: "2px dashed #E8500A44", background: "#fffaf8" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a1628", marginBottom: 4 }}>Добавить услугу</h3>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Пошив, брендирование, вышивка и другие услуги компании</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Тип услуги</label>
                <select
                  data-testid="select-service-type"
                  value={svcType}
                  onChange={(e) => {
                    setSvcType(e.target.value);
                    if (!svcName) setSvcName(e.target.value);
                  }}
                  style={{ ...inputStyle, background: "#fff" }}
                >
                  {SERVICE_TYPES.map((t) => <option key={t} value={t}>{SERVICE_ICONS[t]} {t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Название услуги</label>
                <input data-testid="input-service-name" value={svcName} onChange={(e) => setSvcName(e.target.value)} style={inputStyle} placeholder="Напр: Пошив 100 футболок с логотипом" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Описание</label>
                <textarea data-testid="input-service-desc" value={svcDesc} onChange={(e) => setSvcDesc(e.target.value)} style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="Описание услуги, материалы, сроки выполнения..." />
              </div>
              <div>
                <label style={labelStyle}>Цена за единицу (₸)</label>
                <input data-testid="input-service-price" type="number" value={svcPrice || ""} onChange={(e) => setSvcPrice(Number(e.target.value))} min={0} style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label style={labelStyle}>Количество</label>
                <input data-testid="input-service-qty" type="number" value={svcQty} onChange={(e) => setSvcQty(Number(e.target.value))} min={1} style={inputStyle} />
              </div>
            </div>

            {/* Photo upload */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Фото (до 3 штук)</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                {svcPhotos.map((photo, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={photo} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd" }} />
                    <button
                      type="button"
                      onClick={() => setSvcPhotos(svcPhotos.filter((_, pi) => pi !== i))}
                      style={{ position: "absolute", top: -6, right: -6, background: "#dc2626", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >✕</button>
                  </div>
                ))}
                {svcPhotos.length < 3 && (
                  <label data-testid="button-upload-photo" style={{ width: 80, height: 80, border: "2px dashed #ddd", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 28, color: "#bbb", flexShrink: 0 }}>
                    +
                    <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: "none" }} />
                  </label>
                )}
              </div>
              <p style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>Загрузите фото образца или примера работы</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, color: "#555" }}>
                Итого за услугу: <strong style={{ color: "#0a1628" }}>{(svcQty * svcPrice).toLocaleString("ru-RU")} ₸</strong>
              </div>
              <button data-testid="button-add-service" type="button" onClick={addService} style={{ background: "#E8500A", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                + Добавить услугу
              </button>
            </div>
          </div>

          {/* All items list */}
          {items.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a1628", marginBottom: 16 }}>
                Позиции КП <span style={{ fontSize: 13, color: "#888", fontWeight: 400 }}>({items.length} поз.)</span>
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600 }}>Позиция</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600, width: 100 }}>Кол-во</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600, width: 140 }}>Цена за ед.</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600, width: 140 }}>Итого</th>
                    <th style={{ width: 60, borderBottom: "2px solid #e5e7eb" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} data-testid={`row-item-${i}`} style={{ background: item.type === "service" ? "#fffaf8" : "transparent" }}>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {item.type === "service" ? (
                            <>
                              {(item as ServiceItem).photos[0] ? (
                                <img src={(item as ServiceItem).photos[0]} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                              ) : (
                                <span style={{ fontSize: 22, lineHeight: 1 }}>{SERVICE_ICONS[(item as ServiceItem).serviceType] || "🔧"}</span>
                              )}
                            </>
                          ) : (
                            (item as ProductItem).image
                              ? <img src={(item as ProductItem).image} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                              : <div style={{ width: 36, height: 36, background: "#f0f0f0", borderRadius: 4, flexShrink: 0 }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 500 }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: item.type === "service" ? "#E8500A" : "#888" }}>
                              {item.type === "service" ? (item as ServiceItem).serviceType : (item as ProductItem).brand || "Товар из каталога"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "center" }}>
                        <input data-testid={`input-qty-${i}`} type="number" value={item.qty} onChange={(e) => updateItemField(i, "qty", Number(e.target.value))} min={1} style={{ width: 70, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4, textAlign: "center", fontSize: 14 }} />
                      </td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "center" }}>
                        <input data-testid={`input-price-${i}`} type="number" value={item.price} onChange={(e) => updateItemField(i, "price", Number(e.target.value))} min={0} style={{ width: 110, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4, textAlign: "center", fontSize: 14 }} />
                      </td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "right", fontWeight: 600 }}>
                        {(item.qty * item.price).toLocaleString("ru-RU")} ₸
                      </td>
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "center" }}>
                        <button type="button" data-testid={`button-remove-item-${i}`} onClick={() => removeItem(i)} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", fontSize: 13, cursor: "pointer" }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 16, textAlign: "right", fontSize: 20, fontWeight: 700, color: "#0a1628" }}>
                Итого: {grandTotal.toLocaleString("ru-RU")} ₸
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              data-testid="button-submit-kp"
              type="submit"
              disabled={submitting || items.length === 0}
              style={{ background: "#E8500A", color: "#fff", border: "none", borderRadius: 6, padding: "12px 32px", fontSize: 16, fontWeight: 600, cursor: submitting || items.length === 0 ? "not-allowed" : "pointer", opacity: submitting || items.length === 0 ? 0.6 : 1 }}
            >
              {submitting ? "Сохранение..." : "Сохранить КП"}
            </button>
            <button
              data-testid="button-cancel"
              type="button"
              onClick={() => setLocation("/manager")}
              style={{ background: "transparent", border: "1px solid #ddd", borderRadius: 6, padding: "12px 24px", fontSize: 16, cursor: "pointer", color: "#0a1628" }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
