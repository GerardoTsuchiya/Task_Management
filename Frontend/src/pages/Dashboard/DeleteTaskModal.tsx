import { COLORS } from "../../constants/colors.ts";
import OutlineBtn from "../../components/OutlineBtn.tsx";

interface Task {
  id: number;
  title: string;
}

interface DeleteTaskModalProps {
  task: Task;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export default function DeleteTaskModal({ task, onClose, onConfirm }: DeleteTaskModalProps) {
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
          width: 440, 
          display: "flex", 
          flexDirection: "column", 
          gap: 24,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 22, fontWeight: 700, margin: 0, textAlign: "center" }}>
            ¿Eliminar Tarea?
          </h2>
          <p style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 14, textAlign: "center", lineHeight: "1.5", margin: 0 }}>
            Estás a punto de eliminar la tarea: <br />
            <strong style={{ color: COLORS.priorityHigh }}>"{task.title}"</strong>. <br />
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1.5px solid ${COLORS.inputBorder}`,
              borderRadius: 20,
              padding: "10px 24px",
              color: COLORS.textMuted,
              fontFamily: "'Sansation', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              onConfirm(task.id);
              onClose();
            }}
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
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}