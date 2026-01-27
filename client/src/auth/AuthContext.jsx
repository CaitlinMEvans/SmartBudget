import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getJwtExpMs } from "./jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const logoutTimerRef = useRef(null);

  function clearLogoutTimer() {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }

  const logout = () => {
    clearLogoutTimer();
    setToken(null);
    setUser(null);
  };

  const scheduleAutoLogout = (jwtToken) => {
    clearLogoutTimer();
    if (!jwtToken) return;

    const expMs = getJwtExpMs(jwtToken);
    if (!expMs) return;

    const msUntilExp = expMs - Date.now();

    // If already expired (or basically expired), logout immediately.
    if (msUntilExp <= 5_000) {
      logout();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, msUntilExp);
  };

  const login = ({ token, user }) => {
    setToken(token || null);
    setUser(user || null);
    if (token) scheduleAutoLogout(token);
  };

  // Persist token
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // On initial load, if token exists, schedule logout
  useEffect(() => {
    if (token) scheduleAutoLogout(token);
    return () => clearLogoutTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed: !!token,
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}