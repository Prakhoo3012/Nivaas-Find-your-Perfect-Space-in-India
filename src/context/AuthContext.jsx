// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/current-user", {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ LOGIN FUNCTION
  const login = async (formData) => {
    try {
      const res = await api.post("/users/login", formData);

      setUser(res.data.data); // 🔥 set globally
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = async () => {
    try {
      await api.post("/users/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error:", err);
    }

    setUser(null); // 🔥 clear user
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);