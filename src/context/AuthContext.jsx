import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

const TOKEN_KEY = "accessToken";
const USER_KEY  = "nivaas_user";

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    const token  = localStorage.getItem(TOKEN_KEY);
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* corrupt */ }
    }
    setLoading(false);
  }, []);

  // Accepts login(formObj) or login(email, password)
  const login = useCallback(async (emailOrForm, password) => {
    const payload =
      typeof emailOrForm === "object"
        ? emailOrForm
        : { email: emailOrForm, password };

    const res      = await api.post("/users/login", payload);
    const data     = res.data;
    const token    = data.accessToken || data.token || data.data?.accessToken;
    const userData = data.data?.user  || data.user  || data.data || data;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY,  JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isOwner  = user?.role === "owner";
  const isTenant = user?.role === "tenant";
  const initials = user
    ? (user.fullName || user.username || "?")
        .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isOwner, isTenant, initials }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
