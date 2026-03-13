import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useClientAuth } from "@/hooks/useClientAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useClientAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/client/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company: company || undefined, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
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
              data-testid="text-register-title"
            >
              Регистрация
            </h1>
            <p className="text-gray-500 text-center text-sm mb-8" data-testid="text-register-subtitle">
              Создайте аккаунт для доступа к личному кабинету
            </p>

            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6"
                data-testid="text-register-error"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ваше имя"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                  data-testid="input-register-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.kz"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                  data-testid="input-register-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+7 (___) ___-__-__"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                  data-testid="input-register-phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Компания</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Название компании (необязательно)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                  data-testid="input-register-company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Минимум 6 символов"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                  data-testid="input-register-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Подтвердите пароль *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Повторите пароль"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/30"
                  data-testid="input-register-confirm-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 mt-2"
                style={{ backgroundColor: "#E8500A" }}
                data-testid="button-register-submit"
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6" data-testid="text-register-login-link">
              Уже есть аккаунт?{" "}
              <Link
                href="/account/login"
                className="font-medium hover:underline"
                style={{ color: "#E8500A" }}
                data-testid="link-to-login"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
