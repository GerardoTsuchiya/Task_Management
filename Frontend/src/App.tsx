import { useState, useEffect } from "react";
import LoginPage from "./pages/Login/LoginPage.tsx";
import RegisterPage from "./pages/Register/RegisterPage.tsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.tsx";
import { api } from "./services/api.ts";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function App() {
  const [page, setPage] = useState<"login" | "register" | "dashboard" | "loading">("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const resetAesthetic = () => {
      document.documentElement.style.margin = "0";
      document.documentElement.style.padding = "0";
      document.documentElement.style.backgroundColor = "#040403";
      
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.backgroundColor = "#040403";
      document.body.style.minHeight = "100vh";
      document.body.style.width = "100%";
    };
    resetAesthetic();
  }, []);

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
    return (
      <div 
        style={{ 
          position: "fixed",
          inset: 0,
          background: "#040403", 
          color: "#fff", 
          fontFamily: "'Sansation', sans-serif", 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16
        }}
      >
        Cargando Infuse...
      </div>
    );
  }

  return (
    <div 
      style={{ 
        width: "100vw", 
        minHeight: "100vh", 
        backgroundColor: "#040403", 
        margin: 0, 
        padding: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {page === "login" && (
        <LoginPage onLoginSuccess={handleAuthSuccess} onGoRegister={() => setPage("register")} />
      )}

      {page === "register" && (
        <RegisterPage onRegisterSuccess={handleAuthSuccess} onGoLogin={() => setPage("login")} />
      )}

      {page === "dashboard" && (
        <DashboardPage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}