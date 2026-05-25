import { COLORS } from "../../constants/colors.ts";

interface Project {
  id: number;
  name: string;
}

interface LeaveProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LeaveProjectModal({ isOpen, project, onClose, onConfirm }: LeaveProjectModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        background: "rgba(4, 4, 3, 0.8)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        zIndex: 2000
      }} 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{ 
          background: COLORS.bgCard, 
          border: `1.5px solid #C3E8BD`, 
          borderRadius: 12, 
          padding: "36px 40px", 
          width: 440, 
          display: "flex", 
          flexDirection: "column", 
          gap: 24,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 22, fontWeight: 700, margin: 0, textAlign: "center" }}>
            ¿Salir del Proyecto?
          </h2>
          
          <p style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 14, textAlign: "center", lineHeight: "1.6", margin: 0 }}>
            Estás a punto de salirte del proyecto <strong style={{ color: COLORS.textMuted }}>"{project.name}"</strong>.
          </p>
          
          <p style={{ color: COLORS.priorityHigh, fontFamily: "'Sansation', sans-serif", fontSize: 13, textAlign: "center", lineHeight: "1.5", margin: 0 }}>
            Perderás acceso a sus tareas y tableros de forma inmediata a menos que el propietario te vuelva a invitar.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent", 
              border: `1.5px solid ${COLORS.inputBorder || "rgba(255,255,255,0.1)"}`, 
              borderRadius: 20,
              padding: "10px 24px", 
              color: COLORS.textMuted, 
              fontFamily: "'Sansation', sans-serif",
              fontSize: 14, 
              fontWeight: 700, 
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            style={{
              background: COLORS.priorityHigh, 
              border: "none", 
              borderRadius: 20,
              padding: "10px 24px", 
              color: "#FFFFFF", 
              fontFamily: "'Sansation', sans-serif",
              fontSize: 14, 
              fontWeight: 700, 
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(208, 54, 54, 0.3)"
            }}
          >
            Confirmar Salida
          </button>
        </div>
      </div>
    </div>
  );
}