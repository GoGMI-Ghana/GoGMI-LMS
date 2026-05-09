import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import type { UserRole } from "../types";
import { api, setAccessToken } from "../services/api";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  initials: string;
  organization?: string;
  jobTitle?: string;
  country?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

const USER_STORAGE_KEY = "gogmi_user";

function getStoredUser(): AuthUser | null {
  try {
    const stored = sessionStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(false);

  // On mount, try to refresh the token if we have a stored user
  useEffect(() => {
    if (user) {
      api.post<{ accessToken: string }>("/auth/refresh")
        .then((data) => {
          setAccessToken(data.accessToken);
        })
        .catch(() => {
          // Refresh failed — session expired
          setUser(null);
          setAccessToken(null);
          sessionStorage.removeItem(USER_STORAGE_KEY);
        });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<{ user: AuthUser; accessToken: string }>(
        "/auth/login",
        { email, password }
      );

      setAccessToken(data.accessToken);
      setUser(data.user);
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Logout API failed — clear local state anyway
    }
    setAccessToken(null);
    setUser(null);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => user?.role === role,
    [user]
  );

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasRole,
    }),
    [user, isLoading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}