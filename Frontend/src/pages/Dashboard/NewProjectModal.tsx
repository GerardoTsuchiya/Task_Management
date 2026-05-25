import { useState } from "react";
import { COLORS } from "../../constants/colors.ts";

interface NewProjectModalProps {
  onClose: () => void;
  onSave: (projectData: { name: string }) => void;
}

export default function NewProjectModal({ onClose, onSave }: NewProjectModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({ name: name.trim() });
    onClose();
  };

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
          border: `1.5px solid #C3E8BD`, 
          borderRadius: 12, 
          padding: "36px 40px", 
          width: 400, 
          display: "flex", flexDirection: "column", 
          gap: 24,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 22, fontWeight: 700, margin: 0, textAlign: "center" }}>
          Nuevo Proyecto
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, fontWeight: 700 }}>
              Nombre del Proyecto
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Diseño UI, Backend API..."
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
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                background: !name.trim() ? COLORS.inputBorder : COLORS.textMuted, 
                border: "none", borderRadius: 20,
                padding: "10px 24px", color: COLORS.bg, fontFamily: "'Sansation', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: !name.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s"
              }}
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}