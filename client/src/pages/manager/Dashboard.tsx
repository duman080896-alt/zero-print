import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useManagerAuth } from "@/hooks/useManagerAuth";

type Tab = "kp" | "clients" | "orders" | "subscribers" | "settings";

const STATUS_LABELS: Record<string, string> = {
  new: "Новый",
  processing: "В обработке",
  ready: "Готов",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const STATUSES = ["new", "processing", "ready", "delivered", "cancelled"];

export default function ManagerDashboard() {
  const [, setLocation] = useLocation();
  const { manager, isAuthenticated, loading: authLoading, getToken, logout } = useManagerAuth();
  const [tab, setTab] = useState<Tab>("kp");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileWhatsapp, setProfileWhatsapp] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/manager/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    if (isAuthenticated && tab === "settings") {
      fetch("/api/manager/me", { headers: { Authorization: `Bearer ${getToken()}` } })
        .then((r) => r.json())
        .then((d) => {
          setProfileName(d.name || "");
          setProfilePhone(d.phone || "");
          setProfileWhatsapp(d.whatsapp || "");
          setProfilePhoto(d.photo || "");
        })
        .catch(() => {});
    }
  }, [isAuthenticated, tab, getToken]);

  const fetchData = useCallback(async () => {
    const endpoints: Record<Tab, string> = {
      kp: "/api/manager/proposals",
      clients: "/api/manager/clients",
      orders: "/api/manager/orders",
      subscribers: "/api/manager/subscribers",
      settings: "",
    };
    const url = endpoints[tab];
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) setData(await res.json());
    } catch {
    } finally {
      setLoading(false);
    }
  }, [tab, getToken]);

  useEffect(() => {
    if (isAuthenticated && tab !== "settings") {
      fetchData();
    }
  }, [isAuthenticated, tab, fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить?")) return;
    await fetch(`/api/manager/proposals/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    fetchData();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/manager/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const handleLogout = () => {
    logout();
    setLocation("/manager/login");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/manager/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: profileName, phone: profilePhone, whatsapp: profileWhatsapp, photo: profilePhoto }),
      });
      if (res.ok) {
        setProfileMsg("✓ Профиль сохранён! Фото будет отображаться в новых КП.");
      } else {
        setProfileMsg("Ошибка сохранения");
      }
    } catch {
      setProfileMsg("Ошибка сохранения");
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(""), 4000);
    }
  };

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "kp", label: "КП" },
    { key: "clients", label: "Клиенты" },
    { key: "orders", label: "Заказы" },
    { key: "subscribers", label: "Подписчики" },
    { key: "settings", label: "Настройки" },
  ];

  const sidebarStyle: React.CSSProperties = {
    width: 220,
    minHeight: "100vh",
    background: "#0a1628",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    flexShrink: 0,
  };

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    display: "block",
    width: "100%",
    padding: "12px 24px",
    background: active ? "rgba(232,80,10,0.15)" : "transparent",
    color: active ? "#E8500A" : "#ccc",
    border: "none",
    borderLeft: active ? "3px solid #E8500A" : "3px solid transparent",
    textAlign: "left",
    fontSize: 15,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
  });

  const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
  const thStyle: React.CSSProperties = { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#0a1628", fontWeight: 600 };
  const tdStyle: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid #f0f0f0" };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div data-testid="manager-dashboard" style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={sidebarStyle}>
        <div data-testid="text-sidebar-logo" style={{ padding: "0 24px 24px", fontSize: 18, fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 8 }}>
          ZERO PRINT Manager
        </div>
        {tabs.map((t) => (
          <button key={t.key} data-testid={`button-tab-${t.key}`} style={tabBtnStyle(tab === t.key)} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 32, background: "#f8f9fb" }}>
        {/* KP tab */}
        {tab === "kp" && (
          <div data-testid="tab-kp">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a1628" }}>Коммерческие предложения</h2>
              <button data-testid="button-create-kp" onClick={() => setLocation("/manager/kp/create")} style={{ background: "#E8500A", color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Создать КП
              </button>
            </div>
            {loading ? <p>Загрузка...</p> : (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Название</th>
                    <th style={thStyle}>Клиент</th>
                    <th style={thStyle}>Сумма</th>
                    <th style={thStyle}>Дата</th>
                    <th style={thStyle}>👁</th>
                    <th style={thStyle}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id} data-testid={`row-kp-${item.id}`}>
                      <td style={tdStyle}>{item.id.slice(0, 8)}...</td>
                      <td style={tdStyle}>{item.title}</td>
                      <td style={tdStyle}>{item.clientName}</td>
                      <td style={tdStyle}>{(Array.isArray(item.items) ? item.items.reduce((s: number, i: any) => s + (i.price || 0) * (i.qty || 0), 0) : 0).toLocaleString("ru-RU")} ₸</td>
                      <td style={tdStyle}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ru-RU") : "—"}</td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: 12, color: "#9ca3af" }} data-testid={`text-views-${item.id}`}>{item.views || 0}</span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            data-testid={`button-share-kp-${item.id}`}
                            onClick={() => {
                              const url = window.location.origin + "/kp/" + item.id;
                              navigator.clipboard.writeText(url).then(() => alert("✅ Ссылка скопирована!\n" + url));
                            }}
                            style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                          >
                            🔗 Поделиться
                          </button>
                          <a href={`/api/kp/${item.id}/html`} target="_blank" rel="noopener noreferrer" data-testid={`button-pdf-kp-${item.id}`} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            📄 PDF
                          </a>
                          <button data-testid={`button-delete-kp-${item.id}`} onClick={() => handleDelete(item.id)} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "#999" }}>Нет данных</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Clients tab */}
        {tab === "clients" && (
          <div data-testid="tab-clients">
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a1628", marginBottom: 20 }}>Клиенты</h2>
            {loading ? <p>Загрузка...</p> : (
              <table style={tableStyle}>
                <thead><tr><th style={thStyle}>Имя</th><th style={thStyle}>Email</th><th style={thStyle}>Телефон</th><th style={thStyle}>Компания</th><th style={thStyle}>Дата</th></tr></thead>
                <tbody>
                  {data.map((item: any, i: number) => (
                    <tr key={item.id || i} data-testid={`row-client-${item.id || i}`}>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.email}</td>
                      <td style={tdStyle}>{item.phone || "—"}</td>
                      <td style={tdStyle}>{item.company || "—"}</td>
                      <td style={tdStyle}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ru-RU") : "—"}</td>
                    </tr>
                  ))}
                  {data.length === 0 && <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "#999" }}>Нет данных</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Orders tab */}
        {tab === "orders" && (
          <div data-testid="tab-orders">
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a1628", marginBottom: 20 }}>Заказы</h2>
            {loading ? <p>Загрузка...</p> : (
              <table style={tableStyle}>
                <thead><tr><th style={thStyle}>ID</th><th style={thStyle}>Клиент</th><th style={thStyle}>Сумма</th><th style={thStyle}>Статус</th><th style={thStyle}>Дата</th></tr></thead>
                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id} data-testid={`row-order-${item.id}`}>
                      <td style={tdStyle}>{item.id}</td>
                      <td style={tdStyle}>{item.clientName || item.name || "—"}</td>
                      <td style={tdStyle}>{Number(item.totalPrice || 0).toLocaleString("ru-RU")} ₸</td>
                      <td style={tdStyle}>
                        <select data-testid={`select-status-${item.id}`} value={item.status || "new"} onChange={(e) => handleStatusChange(item.id, e.target.value)} style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }}>
                          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                      </td>
                      <td style={tdStyle}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ru-RU") : "—"}</td>
                    </tr>
                  ))}
                  {data.length === 0 && <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "#999" }}>Нет данных</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Subscribers tab */}
        {tab === "subscribers" && (
          <div data-testid="tab-subscribers">
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a1628", marginBottom: 20 }}>Подписчики</h2>
            {loading ? <p>Загрузка...</p> : (
              <table style={tableStyle}>
                <thead><tr><th style={thStyle}>Email</th><th style={thStyle}>Имя</th><th style={thStyle}>Дата</th></tr></thead>
                <tbody>
                  {data.map((item: any, i: number) => (
                    <tr key={item.id || i} data-testid={`row-subscriber-${item.id || i}`}>
                      <td style={tdStyle}>{item.email}</td>
                      <td style={tdStyle}>{item.name || "—"}</td>
                      <td style={tdStyle}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ru-RU") : "—"}</td>
                    </tr>
                  ))}
                  {data.length === 0 && <tr><td colSpan={3} style={{ ...tdStyle, textAlign: "center", color: "#999" }}>Нет данных</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Settings tab */}
        {tab === "settings" && (
          <div data-testid="tab-settings">
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0a1628", marginBottom: 20 }}>Настройки</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 760 }}>
              {/* Profile card */}
              <div style={{ background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", gridColumn: "1 / -1" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a1628", marginBottom: 20 }}>Профиль менеджера</h3>
                <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Ваше имя и фото будут отображаться в КП для клиентов</p>

                {/* Photo upload */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Фото" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #0a1628", flexShrink: 0 }} data-testid="img-manager-photo" />
                  ) : (
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0f4f8", border: "3px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>👤</div>
                  )}
                  <div>
                    <label data-testid="button-upload-manager-photo" style={{ display: "inline-block", cursor: "pointer", background: "#0a1628", color: "#fff", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>
                      {profilePhoto ? "Сменить фото" : "Загрузить фото"}
                      <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                    </label>
                    {profilePhoto && (
                      <button onClick={() => setProfilePhoto("")} style={{ display: "block", marginTop: 8, background: "transparent", border: "none", color: "#dc2626", fontSize: 12, cursor: "pointer", padding: 0 }}>Удалить фото</button>
                    )}
                    <p style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>JPG, PNG — рекомендуемый размер 400×400px</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0a1628", marginBottom: 6 }}>Имя</label>
                    <input data-testid="input-profile-name" value={profileName} onChange={(e) => setProfileName(e.target.value)} style={inputStyle} placeholder="Ваше имя" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0a1628", marginBottom: 6 }}>Телефон</label>
                    <input data-testid="input-profile-phone" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} style={inputStyle} placeholder="+7 777 000 00 00" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0a1628", marginBottom: 6 }}>WhatsApp (номер для кнопки в КП)</label>
                    <input data-testid="input-profile-whatsapp" value={profileWhatsapp} onChange={(e) => setProfileWhatsapp(e.target.value)} style={inputStyle} placeholder="77716246461" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#0a1628", marginBottom: 6 }}>Email</label>
                    <input value={manager?.email || ""} readOnly style={{ ...inputStyle, background: "#f8f9fb", color: "#999" }} />
                  </div>
                </div>

                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
                  <button
                    data-testid="button-save-profile"
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                    style={{ background: "#E8500A", color: "#fff", border: "none", borderRadius: 6, padding: "10px 28px", fontSize: 14, fontWeight: 600, cursor: profileSaving ? "wait" : "pointer", opacity: profileSaving ? 0.7 : 1 }}
                  >
                    {profileSaving ? "Сохранение..." : "Сохранить профиль"}
                  </button>
                  {profileMsg && (
                    <span data-testid="text-profile-msg" style={{ fontSize: 13, color: profileMsg.includes("✓") ? "#16a34a" : "#dc2626" }}>
                      {profileMsg}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Logout */}
            <div style={{ marginTop: 24, maxWidth: 760 }}>
              <div style={{ background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a1628", marginBottom: 12 }}>Аккаунт</h3>
                <button
                  data-testid="button-logout"
                  onClick={handleLogout}
                  style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                >
                  Выйти из кабинета
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
