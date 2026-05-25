import { COLORS } from "../../constants/colors.ts";
import { Calendar } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
  projectId: number | null;
}

interface ViewTaskModalProps {
  task: Task;
  onClose: () => void;
}

function formatDateToLatam(dateStr?: string): string {
  if (!dateStr) return "Sin fecha de vencimiento";
  const cleanDate = dateStr.split("T")[0];
  const parts = cleanDate.split("-");
  if (parts.length !== 3) return dateStr;

  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return `${parseInt(parts[2], 10)} de ${months[parseInt(parts[1], 10) - 1]} de ${parts[0]}`;
}

function getPriorityLabelAndColor(p: string) {
  switch (p) {
    case "URGENT": return { label: "Urgente", color: COLORS.priorityUrgent };
    case "HIGH": return { label: "Alta", color: COLORS.priorityHigh };
    case "MEDIUM": return { label: "Media", color: COLORS.priorityMed };
    default: return { label: "Baja", color: COLORS.priorityLow };
  }
}

export default function ViewTaskModal({ task, onClose }: ViewTaskModalProps) {
  const priorityInfo = getPriorityLabelAndColor(task.priority);

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
          width: 460, 
          display: "flex", 
          flexDirection: "column", 
          gap: 20,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 24, fontWeight: 700, margin: 0, textAlign: "left", wordBreak: "break-word" }}>
          {task.title}
        </h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ background: "#2D2D2D", padding: "6px 12px", borderRadius: "4px" }}>
            <span style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: "13px" }}>
              Prioridad: <strong style={{ color: priorityInfo.color }}>{priorityInfo.label}</strong>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#2D2D2D", padding: "6px 12px", borderRadius: "4px" }}>
            <Calendar size={15} color={COLORS.textMuted} />
            <span style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: "13px" }}>
              {formatDateToLatam(task.dueDate)}
            </span>
          </div>

          <span style={{
            fontFamily: "'Sansation', sans-serif", fontSize: "11px", fontWeight: 700,
            padding: "5px 10px", borderRadius: "20px",
            background: task.status === "COMPLETED" ? COLORS.checkDone : "#444",
            color: task.status === "COMPLETED" ? COLORS.btnFilledText : COLORS.text
          }}>
            {task.status === "COMPLETED" ? "COMPLETADA" : "PENDIENTE"}
          </span>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #444", margin: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "flex-start" }}>
            <label style={labelStyle}>Descripción</label>
            <div style={{ 
              width: "100%", 
              background: COLORS.inputBg, 
              borderRadius: 6, 
              padding: "11px 16px", 
              color: COLORS.inputText, 
              fontSize: 14, 
              fontFamily: "'Sansation', sans-serif", 
              boxSizing: "border-box",
              minHeight: 100,
              maxHeight: 180,
              overflowY: "auto",
              whiteSpace: "pre-wrap"
            }}>
              {task.description || <em style={{ opacity: 0.4 }}>Sin descripción.</em>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = { 
  color: COLORS.textMuted, 
  fontFamily: "'Sansation', sans-serif", 
  fontSize: 13, 
  fontWeight: 700, 
  letterSpacing: 0.5 
};