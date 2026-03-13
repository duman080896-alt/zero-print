import { useState, useEffect, useCallback } from "react";

interface ManagerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export function useManagerAuth() {
  const [manager, setManager] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("manager_data");
    const token = localStorage.getItem("manager_token");
    if (stored && token) {
      try {
        setManager(JSON.parse(stored));
      } catch {
        localStorage.removeItem("manager_data");
        localStorage.removeItem("manager_token");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((token: string, data: ManagerData) => {
    localStorage.setItem("manager_token", token);
    localStorage.setItem("manager_data", JSON.stringify(data));
    setManager(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("manager_token");
    localStorage.removeItem("manager_data");
    setManager(null);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("manager_token");
  }, []);

  return { manager, loading, login, logout, getToken, isAuthenticated: !!manager };
}
