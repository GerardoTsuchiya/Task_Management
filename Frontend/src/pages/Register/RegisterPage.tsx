import { useState } from "react";
import { COLORS } from "../../constants/colors.ts";
import Navbar from "../../components/Navbar.tsx";
import Input from "../../components/Input.tsx";
import OutlineBtn from "../../components/OutlineBtn.tsx";
import { api } from "../../services/api.ts";

interface RegisterPageProps {
  onRegisterSuccess: (token: string, user: any) => void;
  onGoLogin: () => void;
}

export default function RegisterPage({ onRegisterSuccess, onGoLogin }: RegisterPageProps) {
  const [form, setForm] = useState({ name: "", correo: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function setField(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleRegister() {
    const { name, correo, password, confirm } = form;
    if (!name || !correo || !password || !confirm) {
      setError("Todos los campos son requeridos.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const data = await api.post('/auth/register', {
        email: correo.trim(),
        name: name.trim(),
        password: password
      });
      onRegisterSuccess(data.accessToken, data.user);
    } catch (err: any) {
      console.error(err);
      if (err?.status === 409) {
        setError("Este correo ya está vinculado a una cuenta.");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: "40px 48px", width: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          
          <h1 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}>
            Bienvenido
          </h1>
          
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            <Input placeholder="Nombre Completo" value={form.name} onChange={(v) => setField("name", v)} />
            <Input placeholder="Correo" type="email" value={form.correo} onChange={(v) => setField("correo", v)} />
            <Input placeholder="Contraseña" type="password" value={form.password} onChange={(v) => setField("password", v)} />
            <Input placeholder="Confirmar contraseña" type="password" value={form.confirm} onChange={(v) => setField("confirm", v)} />
          </div>

          {error && <p style={{ color: COLORS.priorityHigh, fontSize: 13, fontFamily: "'Sansation', sans-serif", margin: 0, textAlign: "center" }}>{error}</p>}
          
          <OutlineBtn variant="filled" onClick={handleRegister} style={{ marginTop: 6 }}>
            Crear cuenta
          </OutlineBtn>

          <div style={{ textAlign: "center", marginTop: 4 }}>
            <span onClick={onGoLogin} style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
              Inicia sesión
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}