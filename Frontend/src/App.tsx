import { useState, useEffect } from "react";
import LoginPage from "./pages/Login/LoginPage.tsx";
import RegisterPage from "./pages/Register/RegisterPage.tsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.tsx";
import { api } from "./services/api.ts";

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [page, setPage] = useState<"login" | "register" | "dashboard" | "loading">("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem("token");
      if (!token) {
        setPage("login");
        return;
      }
      try {
        const userData = await api.get("/auth/me");
        setUser(userData);
        setPage("dashboard");
      } catch (err) {
        localStorage.removeItem("token");
        setPage("login");
      }
    }
    checkSession();
  }, []);

  function handleAuthSuccess(token: string, u: User) {
    localStorage.setItem("token", token);
    setUser(u);
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  }

if (page === "loading") {
    return <div style={{ color: "#fff", fontFamily: "'Sansation', sans-serif", textAlign: "center", marginTop: 40 }}>Cargando Infuse...</div>;
  }

  if (page === "login") {
    return <LoginPage onLoginSuccess={handleAuthSuccess} onGoRegister={() => setPage("register")} />;
  }

  if (page === "register") {
    return <RegisterPage onRegisterSuccess={handleAuthSuccess} onGoLogin={() => setPage("login")} />;
  }

  if (page === "dashboard") {
    return <DashboardPage user={user} onLogout={handleLogout} />;
  }

  return null;
}