import { useState } from "react";
import { COLORS } from "../../constants/colors.ts";
import OutlineBtn from "../../components/OutlineBtn.tsx";
import Input from "../../components/Input.tsx";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
  projectId: number | null;
  assignedTo?: { id: number; name: string; email: string } | null;
}

interface ProjectMember {
  id: number;
  user: { id: number; name: string; email: string };
}

interface EditTaskModalProps {
  task: Task;
  isOwner?: boolean;
  projectMembers?: ProjectMember[];
  onClose: () => void;
  onSave: (id: number, updatedFields: { title: string; desc: string; priority: string; dueDate: string; assignedToId?: number | null }) => void;
}

export default function EditTaskModal({ task, isOwner, projectMembers = [], onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");
  const [assignedToId, setAssignedToId] = useState<number | null>(task.assignedTo?.id ?? null);
  const [error, setError] = useState("");

  const showAssignField = !!task.projectId && isOwner;

  function handleSave() {
    if (title.trim().length < 2) {
      setError("El título debe tener al menos 2 caracteres.");
      return;
    }
    if (!dueDate) {
      setError("Debes seleccionar una fecha de vencimiento.");
      return;
    }
    if (!priority) {
      setError("Selecciona una prioridad.");
      return;
    }
    
    onSave(task.id, { title, desc, priority, dueDate, assignedToId });
    onClose();
  }

  const priorityBtnStyle = (p: string, baseColor: string) => {
    const isSelected = priority === p;
    return {
      flex: 1,
      padding: "8px 0",
      borderRadius: 20,
      border: "none",
      cursor: "pointer",
      fontFamily: "'Sansation', sans-serif",
      fontSize: 12,
      fontWeight: 700,
      background: isSelected ? baseColor : COLORS.bg,
      color: isSelected ? "#333333" : COLORS.textMuted,
      transition: "all 0.2s ease",
      boxShadow: isSelected ? "0 2px 4px rgba(0,0,0,0.2)" : "none"
    };
  };

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
        <h2 style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 24, fontWeight: 700, margin: 0, textAlign: "center" }}>
          Editar Task
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "flex-start" }}>
            <label style={labelStyle}>Título</label>
            <Input 
              placeholder="Nombre de la tarea..." 
              value={title} 
              onChange={setTitle} 
              style={{ margin: "0", maxWidth: "100%" }} 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "flex-start" }}>
            <label style={labelStyle}>Descripción</label>
            <textarea 
              placeholder="Detalles de la tarea..." 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              rows={3} 
              style={{ 
                width: "100%", 
                background: COLORS.inputBg, 
                border: "none", 
                borderRadius: 6, 
                padding: "11px 16px", 
                color: COLORS.inputText, 
                fontSize: 14, 
                fontFamily: "'Sansation', sans-serif", 
                boxSizing: "border-box", 
                outline: "none",
                resize: "none", 
                minHeight: 80 
              }} 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "flex-start" }}>
            <label style={labelStyle}>Fecha de vencimiento</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              style={{
                width: "240px", 
                background: COLORS.inputBg,
                border: "none",
                borderRadius: 6,
                padding: "11px 16px",
                color: COLORS.inputText,
                fontSize: 14,
                fontFamily: "'Sansation', sans-serif",
                boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "flex-start" }}>
            <label style={labelStyle}>Prioridad</label>
            <div style={{ display: "flex", gap: 6, width: "100%" }}>
              <button type="button" style={priorityBtnStyle("LOW", "#28B128")} onClick={() => setPriority("LOW")}>Baja</button>
              <button type="button" style={priorityBtnStyle("MEDIUM", "#D7B945")} onClick={() => setPriority("MEDIUM")}>Media</button>
              <button type="button" style={priorityBtnStyle("HIGH", "#f39c12")} onClick={() => setPriority("HIGH")}>Alta</button>
              <button type="button" style={priorityBtnStyle("URGENT", "#D03636")} onClick={() => setPriority("URGENT")}>Urgente</button>
            </div>
          </div>

          {showAssignField && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "flex-start" }}>
              <label style={labelStyle}>Asignar a</label>
              <select
                value={assignedToId ?? ""}
                onChange={(e) => setAssignedToId(e.target.value ? Number(e.target.value) : null)}
                style={{
                  width: "100%",
                  background: COLORS.inputBg,
                  border: "none",
                  borderRadius: 6,
                  padding: "11px 16px",
                  color: assignedToId ? COLORS.inputText : COLORS.textMuted,
                  fontSize: 14,
                  fontFamily: "'Sansation', sans-serif",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">Sin asignar</option>
                {projectMembers.map((m) => (
                  <option key={m.id} value={m.user.id}>
                    {m.user.name} ({m.user.email})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && <p style={{ color: "#D03636", fontSize: 13, fontFamily: "'Sansation', sans-serif", margin: 0, textAlign: "center", fontWeight: 700 }}>{error}</p>}
        
        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <OutlineBtn variant="filled" onClick={handleSave}>
            Guardar Cambios
          </OutlineBtn>
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