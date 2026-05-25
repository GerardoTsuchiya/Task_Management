import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { COLORS } from "../../constants/colors.ts";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
  projectId: number | null;
  project?: { id: number; name: string } | null;
  assignedTo?: { id: number; name: string; email: string } | null;
}

interface TaskRowProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onViewClick: (task: Task) => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
  isOverdue?: boolean;
  canEditDelete?: boolean;
}

function formatDateToLatam(dateStr?: string): string {
  if (!dateStr) return "--";
  const cleanDate = dateStr.split("T")[0];
  const parts = cleanDate.split("-");
  if (parts.length !== 3) return dateStr;

  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return `${parseInt(parts[2], 10)} de ${months[parseInt(parts[1], 10) - 1]} de ${parts[0]}`;
}

function PriorityBadge({ p }: { p: string }) {
  const color =
    p === "URGENT" ? COLORS.priorityUrgent :
    p === "HIGH" ? COLORS.priorityHigh :
    p === "MEDIUM" ? COLORS.priorityMed : COLORS.priorityLow;

  return <div style={{ width: 42, height: 16, background: color, borderRadius: 3, display: "inline-block" }} />;
}

function StatusCircle({ status, isOverdue, isRowHovered }: { status: string; isOverdue?: boolean; isRowHovered: boolean }) {
  const filled = status === "COMPLETED";
  let borderColor = filled ? COLORS.checkDone : isOverdue ? COLORS.priorityHigh : COLORS.checkPending;
  
  if (isRowHovered && !filled) {
    borderColor = COLORS.text;
  }

  return (
    <div style={{
      width: 20, height: 20, borderRadius: "50%",
      border: `2px solid ${borderColor}`,
      background: filled ? COLORS.checkDone : isRowHovered ? "rgba(255, 255, 255, 0.25)" : "transparent",
      flexShrink: 0,
      transition: "all 0.2s ease",
      transform: isRowHovered ? "scale(1.1)" : "scale(1)"
    }} />
  );
}

export default function TaskRow({ task, onToggleStatus, onViewClick, onEditClick, onDeleteClick, isOverdue, canEditDelete = true }: TaskRowProps) {
  const [isClickZoneHovered, setIsClickZoneHovered] = useState(false);
  const isCompleted = task.status === "COMPLETED";

  const titleColor = isOverdue ? "#E57373" : COLORS.text;
  const descColor = isOverdue ? "#EF9A9A" : COLORS.text;
  const textDecoration = isCompleted ? "line-through" : "none";
  const opacity = isCompleted ? 0.5 : 1;

  return (
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        padding: "11px 14px", 
        borderBottom: `1px solid #444`, 
        opacity,
        background: isClickZoneHovered ? "rgba(255, 255, 255, 0.06)" : "transparent",
        boxShadow: isClickZoneHovered ? "inset 3px 0px 0px 0px rgba(255, 255, 255, 0.4)" : "none",
        transition: "all 0.2s ease"
      }}
    >
      <div 
        onClick={() => onToggleStatus(task)}
        onMouseEnter={() => setIsClickZoneHovered(true)}
        onMouseLeave={() => setIsClickZoneHovered(false)}
        style={{ 
          display: "flex",
          alignItems: "center",
          gap: 14,
          flex: 2,
          minWidth: 0,
          cursor: "pointer",
          height: "100%",
          padding: "4px 0"
        }}
      >
        <StatusCircle status={task.status} isOverdue={isOverdue} isRowHovered={isClickZoneHovered} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, overflow: "hidden" }}>
          <span style={{
            color: titleColor,
            fontFamily: "'Sansation', sans-serif", fontSize: 14,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration,
            opacity: isClickZoneHovered ? 1 : 0.85,
            transition: "opacity 0.2s ease"
          }}>
            {task.title} {isOverdue && <span style={{ fontSize: 11, opacity: 0.6 }}>(Vencida)</span>}
          </span>
          {task.project && (
            <span style={{
              color: COLORS.textMuted,
              fontFamily: "'Sansation', sans-serif",
              fontSize: 11,
              opacity: 0.6,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              textDecoration: "none",
            }}>
              {task.project.name}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", flex: 8 }}>

        <span style={{
          color: descColor, opacity: 0.6, fontFamily: "'Sansation', sans-serif", fontSize: 13,
          flex: 2.2, minWidth: 0, paddingRight: "12px", overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap", textAlign: "left", textDecoration
        }}>
          {task.description || "--"}
        </span>

        <span style={{
          color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13,
          flex: 1.8, minWidth: 0, paddingRight: "12px", overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap", textAlign: "left", textDecoration, opacity: isCompleted ? 0.5 : 0.85
        }}>
          {task.assignedTo ? task.assignedTo.name : "--"}
        </span>

        <span style={{
          color: isOverdue ? "#EF9A9A" : COLORS.textMuted, fontFamily: "'Sansation', sans-serif",
          fontSize: 13, flex: 1.8, minWidth: 0, textAlign: "left", textDecoration
        }}>
          {formatDateToLatam(task.dueDate)}
        </span>

        <div style={{ flex: 1.2, minWidth: 0, opacity: isCompleted ? 0.5 : 1 }}>
          <PriorityBadge p={task.priority} />
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 16 }}>
          <button 
            title="Visualizar Tarea" 
            onClick={(e) => { e.stopPropagation(); onViewClick(task); }}
            style={{ 
              background: "transparent", border: "none", cursor: "pointer", padding: "4px", 
              display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted,
              transition: "color 0.2s ease, transform 0.1s ease" 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COLORS.text;
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COLORS.textMuted;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Eye size={18} />
          </button>
          
          {canEditDelete && (
            <button
              title="Editar Tarea"
              onClick={(e) => { e.stopPropagation(); onEditClick(task); }}
              style={{
                background: "transparent", border: "none", cursor: "pointer", padding: "4px",
                display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted,
                transition: "color 0.2s ease, transform 0.1s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.text; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <Pencil size={16} />
            </button>
          )}

          {canEditDelete && (
            <button
              title="Eliminar Tarea"
              onClick={(e) => { e.stopPropagation(); onDeleteClick(task); }}
              style={{
                background: "transparent", border: "none", cursor: "pointer", padding: "4px",
                display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted,
                transition: "color 0.2s ease, transform 0.1s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.priorityHigh; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <Trash2 size={16} />
            </button>
          )}

        </div>
      </div>
    </div>
  );
}