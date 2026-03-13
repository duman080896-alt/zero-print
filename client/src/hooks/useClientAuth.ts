import { useState, useEffect, useCallback } from "react";

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  discount?: number;
}

export function useClientAuth() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("client_data");
    const token = localStorage.getItem("client_token");
    if (stored && token) {
      try {
        setClient(JSON.parse(stored));
      } catch {
        localStorage.removeItem("client_data");
        localStorage.removeItem("client_token");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((token: string, data: ClientData) => {
    localStorage.setItem("client_token", token);
    localStorage.setItem("client_data", JSON.stringify(data));
    setClient(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_data");
    setClient(null);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("client_token");
  }, []);

  const updateClient = useCallback((data: Partial<ClientData>) => {
    setClient(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem("client_data", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { client, loading, login, logout, getToken, updateClient, isAuthenticated: !!client };
}
