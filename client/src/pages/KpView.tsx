import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { proxyImage } from "@/lib/utils";

interface KpData {
  id: string;
  title: string;
  clientName: string;
  clientLogoUrl?: string;
  managerName?: string;
  managerPhone?: string;
  branding?: string;
  comment?: string;
  validDays?: number;
  views?: number;
  createdAt?: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    image?: string;
    brand?: string;
    description?: string;
  }>;
}

export default function KpView({ params }: { params: { id: string } }) {
  const [kp, setKp] = useState<KpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useSEO(
    kp ? `${kp.title} — ZERO PRINT` : "Коммерческое предложение — ZERO PRINT",
    "Коммерческое предложение от ZERO PRINT"
  );

  useEffect(() => {
    fetch(`/api/kp/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("КП не найдено");
        return r.json();
      })
      .then((data) => setKp(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fb" }}>
        <p style={{ color: "#888" }}>Загрузка...</p>
      </div>
    );
  }

  if (error || !kp) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fb" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>КП не найдено</h1>
          <p style={{ color: "#888" }}>Возможно, ссылка устарела или была удалена</p>
        </div>
      </div>
    );
  }

  const totalPrice = kp.items.reduce((s, i) => s + i.qty * i.price, 0);
  const validUntil = new Date(kp.createdAt || new Date());
  validUntil.setDate(validUntil.getDate() + (kp.validDays || 30));
  const waText = encodeURIComponent(`Здравствуйте! Ознакомился с КП «${kp.title}» и хочу оформить заказ.`);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "24px 16px" }} data-testid="kp-view-page">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            background: "#0a1628",
            borderRadius: "16px 16px 0 0",
            padding: "40px 32px",
            textAlign: "center",
            color: "white",
          }}
          data-testid="kp-cover"
        >
          <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>
            ZERO <span style={{ color: "#E8500A" }}>PRINT</span>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 24 }}>Брендирование • Полиграфия • Пошив</div>
          {kp.clientLogoUrl && (
            <img
              src={kp.clientLogoUrl}
              alt="Client logo"
              style={{ maxHeight: 60, maxWidth: 160, objectFit: "contain", margin: "0 auto 20px", display: "block" }}
            />
          )}
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }} data-testid="kp-title">{kp.title}</h1>
          {kp.comment && <p style={{ color: "#9ca3af", fontSize: 14 }}>{kp.comment}</p>}
          <div style={{ margin: "20px auto 0", width: 40, height: 3, background: "#E8500A", borderRadius: 2 }} />
          <div style={{ marginTop: 20, fontSize: 13, color: "#d1d5db", lineHeight: 1.8 }}>
            {kp.managerName && <span>{kp.managerName}</span>}
            {kp.managerPhone && <span> • {kp.managerPhone}</span>}
            <br />
            {new Date(kp.createdAt || "").toLocaleDateString("ru-RU")}
            {kp.clientName && (
              <>
                <br />
                <strong style={{ color: "white" }}>{kp.clientName}</strong>
              </>
            )}
          </div>
        </div>

        <div style={{ background: "white", padding: "32px", borderRadius: "0 0 0 0" }}>
          {kp.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 24,
                padding: "24px 0",
                borderBottom: idx < kp.items.length - 1 ? "1px solid #f1f5f9" : "none",
              }}
              data-testid={`kp-product-${idx}`}
            >
              <div style={{ width: 160, flexShrink: 0 }}>
                {item.image ? (
                  <img
                    src={proxyImage(item.image)}
                    alt={item.name}
                    style={{ width: 160, height: 160, objectFit: "contain", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fafafa" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 160,
                      height: 160,
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                      color: "#d1d5db",
                    }}
                  >
                    📦
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#111" }}>{item.name}</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr auto 1fr",
                    gap: 8,
                    background: "#f8fafc",
                    borderRadius: 8,
                    padding: "12px 16px",
                    fontSize: 13,
                    marginBottom: 12,
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ color: "#6b7280", fontSize: 11 }}>Цена за 1 шт.</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{item.price.toLocaleString("ru-RU")} ₸</div>
                  </div>
                  <div style={{ color: "#9ca3af" }}>×</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#6b7280", fontSize: 11 }}>Тираж</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{item.qty} шт.</div>
                  </div>
                  <div style={{ color: "#9ca3af" }}>=</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#6b7280", fontSize: 11 }}>Итого</div>
                    <div style={{ fontWeight: 900, fontSize: 17, color: "#111" }}>
                      {(item.qty * item.price).toLocaleString("ru-RU")} ₸
                    </div>
                  </div>
                </div>
                {item.brand && (
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    <span style={{ fontWeight: 600 }}>Бренд:</span> {item.brand}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 24,
              background: "#111",
              borderRadius: 12,
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            data-testid="kp-total"
          >
            <span style={{ color: "#9ca3af", fontSize: 14, fontWeight: 600 }}>ИТОГО:</span>
            <span style={{ color: "white", fontSize: 24, fontWeight: 900 }}>{totalPrice.toLocaleString("ru-RU")} ₸</span>
          </div>

          {kp.branding && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#fff8f5", borderLeft: "3px solid #E8500A", borderRadius: 4, fontSize: 13 }}>
              <strong>Брендирование:</strong> {kp.branding}
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
            Предложение действует до {validUntil.toLocaleDateString("ru-RU")}
          </div>
        </div>

        <div
          style={{
            background: "#0a1628",
            borderRadius: "0 0 16px 16px",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "white", fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Готовы оформить заказ?</h3>
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 16 }}>Свяжитесь с нами — рассчитаем стоимость за 15 минут</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/77716246461?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#25D366",
                color: "white",
                padding: "12px 24px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
              data-testid="kp-cta-whatsapp"
            >
              💬 WhatsApp
            </a>
            <a
              href="tel:+77001584039"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "2px solid #444",
                color: "white",
                padding: "12px 24px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
              }}
              data-testid="kp-cta-phone"
            >
              📞 +7 700 158 40 39
            </a>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#9ca3af" }}>
          ZERO PRINT • г. Алматы, ул. Радостовца 152/6, офис 104 • zeroprint.kz@gmail.com
        </div>
      </div>
    </div>
  );
}
