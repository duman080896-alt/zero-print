import { useState } from "react";
import { useLocation } from "wouter";
import { useManagerAuth } from "@/hooks/useManagerAuth";

export default function ManagerLogin() {
  const [, setLocation] = useLocation();
  const { login } = useManagerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/manager/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка авторизации");
        return;
      }
      login(data.token, data.manager);
      setLocation("/manager");
    } catch {
      setError("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="manager-login-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a1628",
      }}
    >
      <form
        onSubmit={handleSubmit}
        data-testid="login-form"
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 40,
          width: 400,
          maxWidth: "90vw",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          data-testid="text-login-title"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#0a1628",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          ZERO PRINT Manager
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          Вход в панель управления
        </p>

        {error && (
          <div
            data-testid="text-login-error"
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

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 500,
              color: "#0a1628",
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            data-testid="input-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="manager@zeroprint.kz"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 500,
              color: "#0a1628",
              marginBottom: 6,
            }}
          >
            Пароль
          </label>
          <input
            data-testid="input-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Введите пароль"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          data-testid="button-login"
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#E8500A",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
