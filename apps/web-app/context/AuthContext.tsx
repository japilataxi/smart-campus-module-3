"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, removeSession, setSession } from "@/lib/api";
import {
  LoginRequest,
  NormalizedUser,
  RegisterRequest,
  User,
  UserRole,
} from "@/lib/types";

interface AuthContextValue {
  user: NormalizedUser | null;
  loading: boolean;
  roles: UserRole[];
  primaryRole: UserRole;
  isAdmin: boolean;
  isLibrarian: boolean;
  isStudent: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const validRoles: UserRole[] = ["admin", "librarian", "student"];

function normalizeRoles(user?: User | null): UserRole[] {
  if (!user?.roles || !Array.isArray(user.roles)) return ["student"];

  const roles = user.roles
    .map((role: any) => {
      if (typeof role === "string") return role;
      return role?.name;
    })
    .filter((role: string) => validRoles.includes(role as UserRole));

  return roles.length > 0 ? (roles as UserRole[]) : ["student"];
}

function getPrimaryRole(roles: UserRole[]): UserRole {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("librarian")) return "librarian";
  return "student";
}

function normalizeUser(user: User): NormalizedUser {
  const normalizedRoles = normalizeRoles(user);

  return {
    ...user,
    normalizedRoles,
    primaryRole: getPrimaryRole(normalizedRoles),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<NormalizedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const roles = user?.normalizedRoles || [];
  const primaryRole = user?.primaryRole || "student";

  async function refreshProfile() {
    const profileResponse = await api.profile();
    const profileUser = profileResponse.user || profileResponse;
    const normalized = normalizeUser(profileUser);

    setUser(normalized);

    setSession({
      accessToken: localStorage.getItem("smart_campus_access_token") || "",
      refreshToken: localStorage.getItem("smart_campus_refresh_token") || "",
      user: normalized,
      roles: normalized.normalizedRoles,
    });
  }

  async function login(data: LoginRequest) {
    const response = await api.login(data);

    const accessToken =
      response.accessToken || response.token || response.access_token;

    if (!accessToken) {
      throw new Error("Access token was not returned by the API.");
    }

    const normalized = normalizeUser(response.user);

    setSession({
      accessToken,
      refreshToken: response.refreshToken,
      user: normalized,
      roles: normalized.normalizedRoles,
    });

    setUser(normalized);
    router.push("/dashboard");
  }

  async function register(data: RegisterRequest) {
    const response = await api.register(data);

    const accessToken =
      response.accessToken || response.token || response.access_token;

    if (accessToken && response.user) {
      const normalized = normalizeUser(response.user);

      setSession({
        accessToken,
        refreshToken: response.refreshToken,
        user: normalized,
        roles: normalized.normalizedRoles,
      });

      setUser(normalized);
      router.push("/dashboard");
      return;
    }

    router.push("/login");
  }

  function logout() {
    removeSession();
    setUser(null);
    router.push("/login");
  }

  useEffect(() => {
    async function loadSession() {
      try {
        const token = localStorage.getItem("smart_campus_access_token");

        if (token) {
          await refreshProfile();
        }
      } catch {
        removeSession();
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        roles,
        primaryRole,
        isAdmin: roles.includes("admin"),
        isLibrarian: roles.includes("librarian"),
        isStudent: roles.includes("student"),
        login,
        register,
        logout,
        refreshProfile,
      }}
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