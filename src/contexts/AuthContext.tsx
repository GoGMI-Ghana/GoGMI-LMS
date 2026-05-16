import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import type { UserRole } from "../types";
import { api, setAccessToken } from "../services/api";

interface AuthUser {
  id: string; email: string; firstName: string; lastName: string;
  role: UserRole; initials: string; organization?: string; jobTitle?: string; country?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ step: "otp"; verificationKey: string; maskedEmail: string }>;
  verifyLoginOtp: (verificationKey: string, otp: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);
const USER_STORAGE_KEY = "gogmi_user";

function getStoredUser(): AuthUser | null {
  try { const s = sessionStorage.getItem(USER_STORAGE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      api.post<{ accessToken: string }>("/auth/refresh")
        .then(d => setAccessToken(d.accessToken))
        .catch(() => { setUser(null); setAccessToken(null); sessionStorage.removeItem(USER_STORAGE_KEY); });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<{ step: string; verificationKey: string; maskedEmail: string; message: string }>("/auth/login", { email, password });
      return { step: "otp" as const, verificationKey: data.verificationKey, maskedEmail: data.maskedEmail };
    } finally { setIsLoading(false); }
  }, []);

  const verifyLoginOtp = useCallback(async (verificationKey: string, otp: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<{ user: AuthUser; accessToken: string }>("/auth/login/verify", { verificationKey, otp });
      setAccessToken(data.accessToken);
      setUser(data.user);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } finally { setIsLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); } catch {}
    setAccessToken(null); setUser(null); sessionStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const hasRole = useCallback((role: UserRole) => user?.role === role, [user]);

  const value = useMemo<AuthState>(() => ({ user, isAuthenticated: !!user, isLoading, login, verifyLoginOtp, logout, hasRole }), [user, isLoading, login, verifyLoginOtp, logout, hasRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}