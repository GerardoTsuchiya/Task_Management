import { useState } from "react";
import { COLORS } from "../../constants/colors.ts";
import OutlineBtn from "../../components/OutlineBtn.tsx";
import Input from "../../components/Input.tsx";

interface NewProjectModalProps {
  onClose: () => void;
  onSave: (projectData: { name: string }) => void;
}

export default function NewProjectModal({ onClose, onSave }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    if (name.trim().length < 2) {
      setError("El nombre del proyecto debe tener al menos 2 caracteres.");
      return;
    }
    onSave({ name });
    onClose();
  }

  return (
    <div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        background: "rgba(4, 4, 3, 0.8)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
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
          display: "flex", 
          flexDirection: "column", 
          gap: 20,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 24, fontWeight: 700, margin: 0, textAlign: "center" }}>
          Nuevo Proyecto
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "flex-start" }}>
            <label style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
              Nombre del Proyecto
            </label>
            <Input 
              placeholder="Ej. Rediseño Web, API Rest..." 
              value={name} 
              onChange={setName} 
              style={{ margin: "0", maxWidth: "100%" }} 
            />
          </div>
        </div>

        {error && <p style={{ color: "#D03636", fontSize: 13, fontFamily: "'Sansation', sans-serif", margin: 0, textAlign: "center", fontWeight: 700 }}>{error}</p>}
        
        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <OutlineBtn variant="filled" onClick={handleSave}>
            Crear Proyecto
          </OutlineBtn>
        </div>
      </div>
    </div>
  );
}