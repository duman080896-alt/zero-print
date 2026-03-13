import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useClientAuth } from "@/hooks/useClientAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
}

interface WishlistItem {
  id: string;
  name: string;
  image?: string;
  price: number;
}

interface Proposal {
  id: string;
  title: string;
  createdAt: string;
  managerName?: string;
  items?: any[];
}

type Tab = "orders" | "wishlist" | "proposals" | "profile";

const tabLabels: { key: Tab; label: string }[] = [
  { key: "orders", label: "Заказы" },
  { key: "wishlist", label: "Избранное" },
  { key: "proposals", label: "КП" },
  { key: "profile", label: "Профиль" },
];

function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₸";
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { client, isAuthenticated, loading: authLoading, logout, getToken, updateClient } = useClientAuth();
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCompany, setProfileCompany] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/account/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    if (client) {
      setProfileName(client.name || "");
      setProfilePhone(client.phone || "");
      setProfileCompany(client.company || "");
    }
  }, [client]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    setLoadingData(true);

    if (activeTab === "orders") {
      fetch("/api/client/orders", { headers })
        .then((r) => r.ok ? r.json() : [])
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setLoadingData(false));
    } else if (activeTab === "wishlist") {
      fetch("/api/client/wishlist", { headers })
        .then((r) => r.ok ? r.json() : [])
        .then(setWishlist)
        .catch(() => setWishlist([]))
        .finally(() => setLoadingData(false));
    } else if (activeTab === "proposals") {
      fetch("/api/client/proposals", { headers })
        .then((r) => r.ok ? r.json() : [])
        .then(setProposals)
        .catch(() => setProposals([]))
        .finally(() => setLoadingData(false));
    } else {
      setLoadingData(false);
    }
  }, [activeTab, isAuthenticated, getToken]);

  const handleRemoveWishlist = async (productId: string) => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      await fetch(`/api/client/wishlist/${productId}`, { method: "DELETE", headers });
      setWishlist((prev) => prev.filter((w) => w.id !== productId));
    } catch {}
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");
    const token = getToken();
    try {
      const res = await fetch("/api/client/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: profileName, phone: profilePhone, company: profileCompany || undefined }),
      });
      if (res.ok) {
        updateClient({ name: profileName, phone: profilePhone, company: profileCompany || undefined });
        setProfileMessage("Профиль успешно обновлён");
      } else {
        setProfileMessage("Ошибка сохранения");
      }
    } catch {
      setProfileMessage("Ошибка соединения");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/account/login");
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Загрузка...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "#0a1628" }}
                data-testid="text-dashboard-title"
              >
                Личный кабинет
              </h1>
              {client && (
                <p className="text-gray-500 text-sm mt-1" data-testid="text-dashboard-welcome">
                  Добро пожаловать, {client.name}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors px-4 py-2 border border-gray-200 rounded-xl hover:border-red-200"
              data-testid="button-logout"
            >
              Выйти
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabLabels.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === t.key
                    ? "text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
                style={activeTab === t.key ? { backgroundColor: "#0a1628" } : {}}
                data-testid={`tab-${t.key}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {activeTab === "orders" && (
              <div>
                <h2 className="text-lg font-bold mb-4" style={{ color: "#0a1628" }} data-testid="text-orders-title">
                  Мои заказы
                </h2>
                {loadingData ? (
                  <p className="text-gray-400 text-sm" data-testid="text-orders-loading">Загрузка...</p>
                ) : orders.length === 0 ? (
                  <p className="text-gray-400 text-sm" data-testid="text-orders-empty">У вас пока нет заказов</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="table-orders">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-gray-500">
                          <th className="pb-3 font-medium">№ Заказа</th>
                          <th className="pb-3 font-medium">Дата</th>
                          <th className="pb-3 font-medium">Статус</th>
                          <th className="pb-3 font-medium text-right">Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50" data-testid={`row-order-${order.id}`}>
                            <td className="py-3 font-medium" style={{ color: "#0a1628" }}>{order.id}</td>
                            <td className="py-3 text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("ru-RU") : "—"}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700" data-testid={`status-order-${order.id}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-right font-semibold" data-testid={`text-order-total-${order.id}`}>
                              {formatPrice(order.totalPrice || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-lg font-bold mb-4" style={{ color: "#0a1628" }} data-testid="text-wishlist-title">
                  Избранное
                </h2>
                {loadingData ? (
                  <p className="text-gray-400 text-sm" data-testid="text-wishlist-loading">Загрузка...</p>
                ) : wishlist.length === 0 ? (
                  <p className="text-gray-400 text-sm" data-testid="text-wishlist-empty">Список избранного пуст</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-100 rounded-xl p-4 flex flex-col"
                        data-testid={`card-wishlist-${item.id}`}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-40 object-contain rounded-lg bg-gray-50 mb-3"
                            data-testid={`img-wishlist-${item.id}`}
                          />
                        )}
                        <h3 className="text-sm font-medium mb-1" style={{ color: "#0a1628" }} data-testid={`text-wishlist-name-${item.id}`}>
                          {item.name}
                        </h3>
                        <p className="text-sm font-semibold mb-3" data-testid={`text-wishlist-price-${item.id}`}>
                          {formatPrice(item.price)}
                        </p>
                        <button
                          onClick={() => handleRemoveWishlist(item.id)}
                          className="mt-auto text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                          data-testid={`button-remove-wishlist-${item.id}`}
                        >
                          Удалить из избранного
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "proposals" && (
              <div>
                <h2 className="text-lg font-bold mb-4" style={{ color: "#0a1628" }} data-testid="text-proposals-title">
                  Коммерческие предложения
                </h2>
                {loadingData ? (
                  <p className="text-gray-400 text-sm" data-testid="text-proposals-loading">Загрузка...</p>
                ) : proposals.length === 0 ? (
                  <p className="text-gray-400 text-sm" data-testid="text-proposals-empty">Нет коммерческих предложений</p>
                ) : (
                  <div className="space-y-3">
                    {proposals.map((p) => (
                      <div
                        key={p.id}
                        className="border border-gray-100 rounded-xl p-4 flex items-center justify-between"
                        data-testid={`card-proposal-${p.id}`}
                      >
                        <div>
                          <h3 className="text-sm font-semibold" style={{ color: "#0a1628" }} data-testid={`text-proposal-title-${p.id}`}>
                            {p.title}
                          </h3>
                          <div className="flex gap-3 mt-1 text-xs text-gray-500">
                            <span data-testid={`text-proposal-date-${p.id}`}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString("ru-RU") : "—"}</span>
                            {p.managerName && <span data-testid={`text-proposal-manager-${p.id}`}>Менеджер: {p.managerName}</span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {p.items && Array.isArray(p.items) && (
                            <p className="text-sm font-semibold" data-testid={`text-proposal-total-${p.id}`}>
                              {formatPrice((p.items as any[]).reduce((sum: number, item: any) => sum + (item.price || 0) * (item.qty || 0), 0))}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="text-lg font-bold mb-4" style={{ color: "#0a1628" }} data-testid="text-profile-title">
                  Профиль
                </h2>
                {profileMessage && (
                  <div
                    className={`text-sm rounded-lg px-4 py-3 mb-4 ${
                      profileMessage.includes("успешно")
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                    data-testid="text-profile-message"
                  >
                    {profileMessage}
                  </div>
                )}
                <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={client?.email || ""}
                      disabled
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500"
                      data-testid="input-profile-email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                      data-testid="input-profile-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                      data-testid="input-profile-phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Компания</label>
                    <input
                      type="text"
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      placeholder="Название компании"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                      data-testid="input-profile-company"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="text-white font-semibold py-3 px-8 rounded-xl text-sm transition-colors disabled:opacity-60"
                    style={{ backgroundColor: "#E8500A" }}
                    data-testid="button-profile-save"
                  >
                    {profileSaving ? "Сохранение..." : "Сохранить"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
