import { useState } from "react";
import { COLORS } from "../../constants/colors.ts";
import Navbar from "../../components/Navbar.tsx";
import Input from "../../components/Input.tsx";
import OutlineBtn from "../../components/OutlineBtn.tsx";
import { api } from "../../services/api.ts";

interface LoginPageProps {
  onLoginSuccess: (token: string, user: any) => void;
  onGoRegister: () => void;
}

export default function LoginPage({ onLoginSuccess, onGoRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    try {
      const data = await api.post('/auth/login', { email, password });
      onLoginSuccess(data.accessToken, data.user);
    } catch (err: any) {
      setError("Credenciales inválidas o error de conexión.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: "40px 48px", width: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          
          <h1 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}>
            Login
          </h1>
          
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            <Input placeholder="Correo" type="email" value={email} onChange={setEmail} />
            <Input placeholder="Contraseña" type="password" value={password} onChange={setPassword} />
          </div>

          {error && <p style={{ color: COLORS.priorityHigh, fontSize: 13, fontFamily: "'Sansation', sans-serif", margin: 0, textAlign: "center" }}>{error}</p>}
          
          <OutlineBtn variant="filled" onClick={handleLogin} style={{ marginTop: 6 }}>
            Iniciar sesión
          </OutlineBtn>

          <div style={{ textAlign: "center", marginTop: 4 }}>
            <span onClick={onGoRegister} style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
              Crear una cuenta
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}