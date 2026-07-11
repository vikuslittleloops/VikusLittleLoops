import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("vll_token"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("vll_token")));

  // Validate existing token on mount.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((r) => setAdmin(r.data))
      .catch(() => {
        localStorage.removeItem("vll_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    // OAuth2 form: username carries the email.
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);
    const { data } = await api.post("/auth/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    localStorage.setItem("vll_token", data.access_token);
    setToken(data.access_token);
    const me = await api.get("/auth/me");
    setAdmin(me.data);
    return me.data;
  };

  const logout = () => {
    localStorage.removeItem("vll_token");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthed: Boolean(admin) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
