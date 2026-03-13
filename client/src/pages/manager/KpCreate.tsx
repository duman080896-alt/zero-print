import { useState } from "react";
import { useLocation } from "wouter";
import { useManagerAuth } from "@/hooks/useManagerAuth";

interface ProductItem {
  productId: number;
  name: string;
  qty: number;
  price: number;
  image?: string;
  brand?: string;
}

interface SearchResult {
  id: number;
  name: string;
  price: number;
  [key: string]: any;
}

export default function KpCreate() {
  const [, setLocation] = useLocation();
  const { getToken } = useManagerAuth();

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [branding, setBranding] = useState("");
  const [comment, setComment] = useState("");
  const [validDays, setValidDays] = useState(30);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        setSearchResults(await res.json());
      }
    } catch {
    } finally {
      setSearching(false);
    }
  };

  const addProduct = (product: SearchResult) => {
    if (items.some((it) => it.productId === product.id)) return;
    setItems([...items, { productId: product.id, name: product.name, qty: 1, price: product.price || 0, image: product.image || "", brand: product.brand || "" }]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const updateItem = (index: number, field: "qty" | "price", value: number) => {
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
      const res = await fetch("/api/manager/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title,
          clientName,
          clientContact,
          branding,
          comment,
          validDays,
          items: items.map((it) => ({
            productId: it.productId,
            name: it.name,
            qty: it.qty,
            price: it.price,
            image: it.image || "",
            brand: it.brand || "",
          })),
          total: grandTotal,
        }),
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

  return (
    <div
      data-testid="kp-create-page"
      style={{ minHeight: "100vh", background: "#f8f9fb", padding: 32 }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0a1628" }}>Создать коммерческое предложение</h1>
          <button
            data-testid="button-back"
            onClick={() => setLocation("/manager")}
            style={{
              background: "transparent",
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: "8px 16px",
              fontSize: 14,
              cursor: "pointer",
              color: "#0a1628",
            }}
          >
            ← Назад
          </button>
        </div>

        {error && (
          <div
            data-testid="text-kp-error"
            style={{
              background: "#fee",
              color: "#c00",
              padding: "10px 14px",
              borderRadius: 6,
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 24,
              marginBottom: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a1628", marginBottom: 16 }}>Информация</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Название КП</label>
                <input
                  data-testid="input-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Название предложения"
                />
              </div>
              <div>
                <label style={labelStyle}>Имя клиента</label>
                <input
                  data-testid="input-clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="ФИО или компания"
                />
              </div>
              <div>
                <label style={labelStyle}>Контакт клиента</label>
                <input
                  data-testid="input-clientContact"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  style={inputStyle}
                  placeholder="Телефон или email"
                />
              </div>
              <div>
                <label style={labelStyle}>Брендирование</label>
                <input
                  data-testid="input-branding"
                  value={branding}
                  onChange={(e) => setBranding(e.target.value)}
                  style={inputStyle}
                  placeholder="Тип брендирования"
                />
              </div>
              <div>
                <label style={labelStyle}>Срок действия (дней)</label>
                <input
                  data-testid="input-validDays"
                  type="number"
                  value={validDays}
                  onChange={(e) => setValidDays(Number(e.target.value))}
                  style={inputStyle}
                  min={1}
                />
              </div>
              <div>
                <label style={labelStyle}>Комментарий</label>
                <input
                  data-testid="input-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={inputStyle}
                  placeholder="Дополнительная информация"
                />
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 24,
              marginBottom: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a1628", marginBottom: 16 }}>Товары</h3>

            <div style={{ position: "relative", marginBottom: 16 }}>
              <input
                data-testid="input-product-search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={inputStyle}
                placeholder="Поиск товара..."
              />
              {searching && <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Поиск...</div>}
              {searchResults.length > 0 && (
                <div
                  data-testid="search-results"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    maxHeight: 200,
                    overflowY: "auto",
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      data-testid={`search-result-${p.id}`}
                      onClick={() => addProduct(p)}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{p.name}</span>
                      <span style={{ color: "#888" }}>{Number(p.price || 0).toLocaleString("ru-RU")} ₸</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600 }}>
                    Товар
                  </th>
                  <th style={{ textAlign: "center", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600, width: 100 }}>
                    Кол-во
                  </th>
                  <th style={{ textAlign: "center", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600, width: 140 }}>
                    Цена за ед.
                  </th>
                  <th style={{ textAlign: "right", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600, width: 140 }}>
                    Итого
                  </th>
                  <th style={{ width: 60, borderBottom: "2px solid #e5e7eb" }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} data-testid={`row-item-${i}`}>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0" }}>{item.name}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "center" }}>
                      <input
                        data-testid={`input-qty-${i}`}
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
                        min={1}
                        style={{ width: 70, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4, textAlign: "center", fontSize: 14 }}
                      />
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "center" }}>
                      <input
                        data-testid={`input-price-${i}`}
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(i, "price", Number(e.target.value))}
                        min={0}
                        style={{ width: 110, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4, textAlign: "center", fontSize: 14 }}
                      />
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "right", fontWeight: 500 }}>
                      {(item.qty * item.price).toLocaleString("ru-RU")} ₸
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #f0f0f0", textAlign: "center" }}>
                      <button
                        type="button"
                        data-testid={`button-remove-item-${i}`}
                        onClick={() => removeItem(i)}
                        style={{
                          background: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 10px",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "20px 12px", textAlign: "center", color: "#999" }}>
                      Добавьте товары через поиск
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {items.length > 0 && (
              <div
                data-testid="text-grand-total"
                style={{
                  textAlign: "right",
                  marginTop: 16,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0a1628",
                }}
              >
                Итого: {grandTotal.toLocaleString("ru-RU")} ₸
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              data-testid="button-submit-kp"
              type="submit"
              disabled={submitting || items.length === 0}
              style={{
                background: "#E8500A",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "12px 32px",
                fontSize: 16,
                fontWeight: 600,
                cursor: submitting || items.length === 0 ? "not-allowed" : "pointer",
                opacity: submitting || items.length === 0 ? 0.6 : 1,
              }}
            >
              {submitting ? "Сохранение..." : "Сохранить КП"}
            </button>
            <button
              data-testid="button-cancel"
              type="button"
              onClick={() => setLocation("/manager")}
              style={{
                background: "transparent",
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: "12px 24px",
                fontSize: 16,
                cursor: "pointer",
                color: "#0a1628",
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
