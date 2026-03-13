import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useClientAuth } from "@/hooks/useClientAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useClientAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }
      login(data.token, data.client);
      setLocation("/account");
    } catch {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1
              className="text-2xl font-bold text-center mb-2"
              style={{ color: "#0a1628" }}
              data-testid="text-login-title"
            >
              Вход в личный кабинет
            </h1>
            <p className="text-gray-500 text-center text-sm mb-8" data-testid="text-login-subtitle">
              Введите ваши данные для входа
            </p>

            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6"
                data-testid="text-login-error"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.kz"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                  data-testid="input-login-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Введите пароль"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                  data-testid="input-login-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
                style={{ backgroundColor: "#E8500A" }}
                data-testid="button-login-submit"
              >
                {loading ? "Вход..." : "Войти"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6" data-testid="text-login-register-link">
              Нет аккаунта?{" "}
              <Link
                href="/account/register"
                className="font-medium hover:underline"
                style={{ color: "#E8500A" }}
                data-testid="link-to-register"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
