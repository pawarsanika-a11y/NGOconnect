import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Role } from "@/types";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, _password: string, role: Role) => Promise<void>;
  register: (name: string, email: string, _password: string, role: Role) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// In production this calls the Express API at /api/auth/*. For this demo
// build it simulates the JWT round trip against localStorage so every page
// is fully clickable without a live backend.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ngoconnect_session");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setLoading(false);
  }, []);

  async function login(email: string, _password: string, role: Role) {
    const fakeUser: AuthUser = { id: "donor-1", name: email.split("@")[0], email, role };
    const fakeToken = `demo.${btoa(email)}.jwt`;
    setUser(fakeUser);
    setToken(fakeToken);
    localStorage.setItem("ngoconnect_session", JSON.stringify({ user: fakeUser, token: fakeToken }));
  }

  async function register(name: string, email: string, _password: string, role: Role) {
    const fakeUser: AuthUser = { id: "donor-1", name, email, role };
    const fakeToken = `demo.${btoa(email)}.jwt`;
    setUser(fakeUser);
    setToken(fakeToken);
    localStorage.setItem("ngoconnect_session", JSON.stringify({ user: fakeUser, token: fakeToken }));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ngoconnect_session");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
