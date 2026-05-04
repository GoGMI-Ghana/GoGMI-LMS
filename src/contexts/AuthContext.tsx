import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { User, UserRole } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "gogmi_auth";

function getPersistedAuth(): User | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function persistAuth(user: User | null) {
  if (user) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getPersistedAuth);

  const login = useCallback(async (email: string, _password: string) => {
    // TODO: Replace with real API call → POST /api/auth/login
    // The backend determines the role, not the frontend.
    // For now, we simulate: admin emails get admin role, others get student.
    await new Promise((r) => setTimeout(r, 1000));

    const isAdmin = email.toLowerCase().includes("admin");
    const role: UserRole = isAdmin ? "admin" : "student";

    const mockUser: User = {
      id: isAdmin ? "usr_admin" : "usr_001",
      firstName: isAdmin ? "Lawrence" : "Kwame",
      lastName: isAdmin ? "Dogli" : "Asante",
      email,
      role,
      initials: isAdmin ? "LD" : "KA",
      cpdPoints: 24,
      cpdTarget: 40,
      enrolledCount: 2,
      completedCount: 1,
    };

    persistAuth(mockUser);
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    persistAuth(null);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => user?.role === role,
    [user]
  );

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasRole,
    }),
    [user, login, logout, hasRole]
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