import { useState } from "react";
import { COLORS } from "../../constants/colors.ts";

interface Project {
  id: number;
  name: string;
}

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSave: (id: number, name: string) => void;
}

export default function EditProjectModal({ project, onClose, onSave }: EditProjectModalProps) {
  const [name, setName] = useState(project.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(project.id, name.trim());
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
      <form 
        onSubmit={handleSubmit}
        style={{ 
          background: COLORS.bgCard, 
          border: `1.5px solid #C3E8BD`, 
          borderRadius: 12, 
          padding: "36px 40px", 
          width: 400, 
          display: "flex", flexDirection: "column", 
          gap: 20,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 22, fontWeight: 700, margin: 0, textAlign: "left" }}>
          Editar Proyecto
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "flex-start" }}>
          <label style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, fontWeight: 700 }}>
            Nombre del Proyecto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            style={{
              width: "100%", background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`,
              borderRadius: 6, padding: "10px 14px", color: COLORS.inputText, fontSize: 14,
              fontFamily: "'Sansation', sans-serif", boxSizing: "border-box", outline: "none"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent", border: `1.5px solid ${COLORS.inputBorder}`, borderRadius: 20,
              padding: "8px 20px", color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif",
              fontSize: 14, fontWeight: 700, cursor: "pointer"
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            style={{
              background: "#C3E8BD", border: "none", borderRadius: 20,
              padding: "8px 20px", color: COLORS.bg, fontFamily: "'Sansation', sans-serif",
              fontSize: 14, fontWeight: 700, cursor: "pointer"
            }}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}