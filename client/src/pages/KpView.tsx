import { useState, useEffect, useCallback } from "react";
import { useSEO } from "@/hooks/useSEO";
import { proxyImage } from "@/lib/utils";

const SERVICE_ICONS: Record<string, string> = {
  "Пошив одежды": "🧵",
  "Брендирование сувениров": "🎁",
  "Печать и нанесение": "🖨️",
  "Вышивка на одежде": "🪡",
  "Полиграфия": "📄",
};

interface KpItem {
  type?: "product" | "service";
  name: string;
  qty: number;
  price: number;
  image?: string;
  brand?: string;
  description?: string;
  serviceType?: string;
  photos?: string[];
}

interface KpData {
  id: string;
  title: string;
  clientName: string;
  clientLogoUrl?: string;
  managerName?: string;
  managerPhone?: string;
  managerPhoto?: string;
  managerWhatsapp?: string;
  branding?: string;
  comment?: string;
  validDays?: number;
  views?: number;
  createdAt?: string;
  items: KpItem[];
}

export default function KpView({ params }: { params: { id: string } }) {
  const [kp, setKp] = useState<KpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc, closeLightbox]);

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
  const managerWa = kp.managerWhatsapp || "77716246461";
  const waText = encodeURIComponent(`Здравствуйте! Ознакомился с КП «${kp.title}» и хочу оформить заказ.`);

  return (
    <>
      {/* Lightbox overlay */}
      {lightboxSrc && (
        <div
          onClick={closeLightbox}
          data-testid="lightbox-overlay"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
            animation: "fadeIn 0.15s ease",
          }}
        >
          <button
            onClick={closeLightbox}
            data-testid="lightbox-close"
            style={{
              position: "absolute", top: 18, right: 22,
              background: "none", border: "none", color: "white",
              fontSize: 36, cursor: "pointer", lineHeight: 1,
              opacity: 0.8,
            }}
            aria-label="Закрыть"
          >
            ×
          </button>
          <img
            src={lightboxSrc}
            alt="Увеличенное фото"
            onClick={(e) => e.stopPropagation()}
            data-testid="lightbox-image"
            style={{
              maxWidth: "92vw", maxHeight: "90vh",
              objectFit: "contain", borderRadius: 8,
              boxShadow: "0 8px 64px rgba(0,0,0,0.7)",
              cursor: "default",
            }}
          />
          <p style={{ position: "absolute", bottom: 18, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            Нажмите вне фото или Escape для закрытия
          </p>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>

      <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "24px 16px" }} data-testid="kp-view-page">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{ background: "#0a1628", borderRadius: "16px 16px 0 0", padding: "40px 32px", textAlign: "center", color: "white" }}
            data-testid="kp-cover"
          >
            <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>
              ZERO <span style={{ color: "#E8500A" }}>PRINT</span>
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 24 }}>Брендирование • Полиграфия • Пошив</div>
            {kp.clientLogoUrl && (
              <img src={kp.clientLogoUrl} alt="Client logo" style={{ maxHeight: 60, maxWidth: 160, objectFit: "contain", margin: "0 auto 20px", display: "block" }} />
            )}
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }} data-testid="kp-title">{kp.title}</h1>
            {kp.comment && <p style={{ color: "#9ca3af", fontSize: 14 }}>{kp.comment}</p>}
            <div style={{ margin: "20px auto 0", width: 40, height: 3, background: "#E8500A", borderRadius: 2 }} />
            <div style={{ marginTop: 20, fontSize: 13, color: "#d1d5db", lineHeight: 1.8 }}>
              {new Date(kp.createdAt || "").toLocaleDateString("ru-RU")}
              {kp.clientName && (
                <>
                  <br />
                  <strong style={{ color: "white" }}>Для: {kp.clientName}</strong>
                </>
              )}
            </div>
          </div>

          {/* Items */}
          <div style={{ background: "white", padding: "32px" }}>
            {kp.items.map((item, idx) => {
              const isService = item.type === "service";
              const serviceIcon = isService ? (SERVICE_ICONS[item.serviceType || ""] || "🔧") : null;
              const servicePhoto = isService && item.photos && item.photos.length > 0 ? item.photos[0] : null;
              const mainImageSrc = isService ? servicePhoto : (item.image ? proxyImage(item.image) : null);

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: 24,
                    padding: isService ? "24px 32px" : "24px 0",
                    borderBottom: idx < kp.items.length - 1 ? "1px solid #f1f5f9" : "none",
                    background: isService ? "#fffaf8" : "transparent",
                    margin: isService ? "0 -32px" : "0",
                  }}
                  data-testid={`kp-product-${idx}`}
                >
                  {/* Image / icon */}
                  <div style={{ width: 180, flexShrink: 0 }}>
                    {mainImageSrc ? (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setLightboxSrc(mainImageSrc)}
                        onKeyDown={(e) => e.key === "Enter" && setLightboxSrc(mainImageSrc)}
                        data-testid={`kp-image-${idx}`}
                        style={{
                          width: 180, height: 180,
                          borderRadius: 10, overflow: "hidden",
                          border: "1px solid #e5e7eb",
                          background: "#fafafa",
                          cursor: "zoom-in",
                          position: "relative",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)")}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                      >
                        <img
                          src={mainImageSrc}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                        {/* Zoom hint */}
                        <div style={{
                          position: "absolute", bottom: 6, right: 6,
                          background: "rgba(0,0,0,0.45)", borderRadius: 4,
                          color: "white", fontSize: 14, padding: "2px 6px",
                          pointerEvents: "none",
                        }}>
                          🔍
                        </div>
                        {/* Service extra thumbnails */}
                        {isService && item.photos && item.photos.length > 1 && (
                          <div style={{ position: "absolute", bottom: 6, left: 6, display: "flex", gap: 4 }}>
                            {item.photos.slice(1, 4).map((p, pi) => (
                              <img
                                key={pi}
                                src={p}
                                alt=""
                                style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "2px solid white" }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        width: 180, height: 180,
                        background: isService ? "#fff8f5" : "#f8fafc",
                        border: isService ? "2px solid #E8500A22" : "1px solid #e5e7eb",
                        borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: isService ? 56 : 40,
                        color: isService ? undefined : "#d1d5db",
                      }}>
                        {isService ? serviceIcon : "📦"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    {isService && (
                      <div style={{ display: "inline-block", background: "#E8500A", color: "white", borderRadius: 4, padding: "2px 10px", fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.3 }}>
                        {item.serviceType}
                      </div>
                    )}
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#111" }}>{item.name}</h3>
                    {isService && item.description && (
                      <p style={{ fontSize: 13, color: "#555", marginBottom: 12, lineHeight: 1.6 }}>{item.description}</p>
                    )}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr auto 1fr",
                        gap: 8,
                        background: isService ? "#fff5f0" : "#f8fafc",
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
                    {!isService && item.brand && (
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        <span style={{ fontWeight: 600 }}>Бренд:</span> {item.brand}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div
              style={{ marginTop: 24, background: "#111", borderRadius: 12, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
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

            {/* Manager card */}
            {(kp.managerName || kp.managerPhoto) && (
              <div
                data-testid="kp-manager-card"
                style={{
                  marginTop: 32,
                  padding: "20px 24px",
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                {kp.managerPhoto ? (
                  <img
                    src={kp.managerPhoto}
                    alt={kp.managerName || "Менеджер"}
                    style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid #0a1628", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0, color: "white" }}>
                    👤
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>ВАШ МЕНЕДЖЕР</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#0a1628", marginBottom: 2 }}>{kp.managerName || "Менеджер ZERO PRINT"}</div>
                  {kp.managerPhone && (
                    <div style={{ fontSize: 13, color: "#555" }}>{kp.managerPhone}</div>
                  )}
                </div>
                <a
                  href={`https://wa.me/${managerWa.replace(/\D/g, "")}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="kp-manager-whatsapp"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#25D366",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  💬 WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* CTA footer */}
          <div style={{ background: "#0a1628", borderRadius: "0 0 16px 16px", padding: "32px", textAlign: "center" }}>
            <h3 style={{ color: "white", fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Готовы оформить заказ?</h3>
            <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 16 }}>Свяжитесь с нами — рассчитаем стоимость за 15 минут</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/77716246461?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
                data-testid="kp-cta-whatsapp"
              >
                💬 WhatsApp
              </a>
              <a
                href="tel:+77001584039"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "2px solid #444", color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
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
    </>
  );
}
