"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, getToken, removeToken, setToken } from "@/lib/api";
import { LoginRequest, RegisterRequest, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeToken(response: any) {
  return response.accessToken || response.token || response.access_token;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    const profile = await api.profile();
    setUser(profile.user || profile);
  }

  async function login(data: LoginRequest) {
    const response = await api.login(data);
    const token = normalizeToken(response);

    if (!token) {
      throw new Error("Token was not returned by the API.");
    }

    setToken(token);
    await refreshProfile();
    router.push("/dashboard");
  }

  async function register(data: RegisterRequest) {
    const response = await api.register(data);
    const token = normalizeToken(response);

    if (token) {
      setToken(token);
      await refreshProfile();
      router.push("/dashboard");
      return;
    }

    router.push("/login");
  }

  function logout() {
    removeToken();
    setUser(null);
    router.push("/login");
  }

  useEffect(() => {
    async function loadSession() {
      try {
        const token = getToken();

        if (token) {
          await refreshProfile();
        }
      } catch {
        removeToken();
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