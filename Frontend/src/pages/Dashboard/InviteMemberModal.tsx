import { useState } from "react";
import { COLORS } from "../../constants/colors.ts";
import { api } from "../../services/api.ts";

interface InviteMemberModalProps {
  project: { id: number; name: string };
  onClose: () => void;
}

export default function InviteMemberModal({ project, onClose }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.post(`/projects/${project.id}/members`, { email: email.trim() });
      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      if (err?.status === 404) {
        setError("No se encontró ningún usuario con ese correo.");
      } else if (err?.status === 409) {
        setError("Ese usuario ya es miembro o tiene una invitación pendiente.");
      } else if (err?.status === 403) {
        setError("Solo el dueño del proyecto puede invitar miembros.");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(4, 4, 3, 0.8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: COLORS.bgCard,
          border: "1.5px solid #C3E8BD",
          borderRadius: 12,
          padding: "36px 40px",
          width: 400,
          display: "flex", flexDirection: "column",
          gap: 24,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 22, fontWeight: 700, margin: 0, textAlign: "center" }}>
          Invitar miembro
        </h2>
        <p style={{ color: "#aaa", fontFamily: "'Sansation', sans-serif", fontSize: 13, margin: 0, textAlign: "center" }}>
          {project.name}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, fontWeight: 700 }}>
              Correo electrónico
            </label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(false); }}
              placeholder="correo@ejemplo.com"
              style={{
                background: COLORS.bg,
                border: `1.5px solid ${COLORS.inputBorder}`,
                borderRadius: 8,
                padding: "12px 16px",
                color: COLORS.text,
                fontFamily: "'Sansation', sans-serif",
                fontSize: 14,
                outline: "none"
              }}
            />
          </div>

          {error && (
            <p style={{ color: COLORS.priorityHigh, fontFamily: "'Sansation', sans-serif", fontSize: 13, margin: 0, textAlign: "center" }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ color: COLORS.priorityLow, fontFamily: "'Sansation', sans-serif", fontSize: 13, margin: 0, textAlign: "center" }}>
              Invitación enviada correctamente.
            </p>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent", border: `1.5px solid ${COLORS.inputBorder}`, borderRadius: 20,
                padding: "10px 24px", color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={!email.trim() || loading}
              style={{
                background: !email.trim() || loading ? COLORS.inputBorder : COLORS.textMuted,
                border: "none", borderRadius: 20,
                padding: "10px 24px", color: COLORS.bg, fontFamily: "'Sansation', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: !email.trim() || loading ? "not-allowed" : "pointer",
                transition: "background 0.2s"
              }}
            >
              {loading ? "Enviando..." : "Invitar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
