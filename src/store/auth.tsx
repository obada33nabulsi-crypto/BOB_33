import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  country: string;
  joinDate: string;
};

type AuthCtx = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { username: string; email: string; password: string; country: string }) => Promise<AuthUser>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "nexus_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window === "undefined") return;
    if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthCtx = {
    user,
    isAuthenticated: !!user,
    login: async (email) => {
      await new Promise((r) => setTimeout(r, 900));
      const username = email.split("@")[0] || "player";
      const u: AuthUser = {
        id: `u_${Date.now()}`,
        username,
        email,
        avatar: username.slice(0, 2).toUpperCase(),
        country: "US",
        joinDate: new Date().toISOString(),
      };
      persist(u);
      return u;
    },
    register: async ({ username, email, country }) => {
      await new Promise((r) => setTimeout(r, 1100));
      const u: AuthUser = {
        id: `u_${Date.now()}`,
        username,
        email,
        avatar: username.slice(0, 2).toUpperCase(),
        country,
        joinDate: new Date().toISOString(),
      };
      persist(u);
      return u;
    },
    logout: () => persist(null),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
