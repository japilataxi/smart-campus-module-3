import React, { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, removeToken, setToken } from "../lib/api";

interface AuthContextValue {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeToken(response: any) {
  return response.accessToken || response.token || response.access_token;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    const profile = await api.profile();
    setUser(profile.user || profile);
  }

  async function login(email: string, password: string) {
    const response = await api.login({ email, password });
    const token = normalizeToken(response);

    if (!token) {
      throw new Error("Token not found");
    }

    await setToken(token);
    await refreshProfile();
  }

  async function register(data: any) {
    const response = await api.register(data);
    const token = normalizeToken(response);

    if (token) {
      await setToken(token);
      await refreshProfile();
    }
  }

  async function logout() {
    await removeToken();
    setUser(null);
  }

  useEffect(() => {
    async function loadSession() {
      try {
        const token = await getToken();

        if (token) {
          await refreshProfile();
        }
      } catch {
        await removeToken();
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}