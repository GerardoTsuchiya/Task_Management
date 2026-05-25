import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Layers, ChevronDown, Calendar } from "lucide-react"; 
import { COLORS } from "../../constants/colors.ts";
import { api } from "../../services/api.ts";

interface Task {
  id: number;
  title: string;
  projectId: number | null;
}

interface DetailedTask extends Task {
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
}

interface Project {
  id: number;
  name: string;
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

function SidebarTaskItem({ task }: { task: Task }) {
  const [hovered, setHovered] = useState(false);
  const [detailedTask, setDetailedTask] = useState<DetailedTask | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(async () => {
      setHovered(true);
      if (!detailedTask) {
        try {
          const data = await api.get(`/tasks/${task.id}`);
          setDetailedTask(data);
        } catch (err) {
          console.error("Error al cargar detalles en la barra lateral:", err);
        }
      }
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setHovered(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const priorityInfo = detailedTask ? getPriorityLabelAndColor(detailedTask.priority) : null;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        padding: "6px 0",
        fontSize: 12,
        color: COLORS.textMuted,
        fontFamily: "'Sansation', sans-serif",
        overflow: "visible", 
        borderBottom: "1px solid rgba(255,255,255,0.02)",
        cursor: "default"
      }}
    >
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        • {task.title}
      </div>

      <div
        style={{
          position: "fixed", 
          left: 230, 
          top: "auto",
          transform: hovered ? "scale(1) translateX(0)" : "scale(0.95) translateX(-10px)",
          opacity: hovered ? 1 : 0,
          pointerEvents: "none", 
          visibility: hovered ? "visible" : "hidden",
          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          background: COLORS.bgCard,
          border: `1.5px solid #C3E8BD`,
          borderRadius: 8,
          padding: "12px 16px",
          width: 250,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}
      >
        {detailedTask && priorityInfo ? (
          <>
            <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text, wordBreak: "break-word" }}>
              {detailedTask.title}
            </div>
            
            {detailedTask.description ? (
              <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: "14px", maxHeight: 42, overflow: "hidden", textOverflow: "ellipsis" }}>
                {detailedTask.description}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
                Sin descripción
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 6 }}>
              <span style={{ color: COLORS.textMuted, fontSize: "11px" }}>
                Prioridad: <strong style={{ color: priorityInfo.color }}>{priorityInfo.label}</strong>
              </span>
              
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.textMuted, fontSize: "11px" }}>
                <Calendar size={12} color={COLORS.textMuted} />
                <span>{formatDateToLatam(detailedTask.dueDate)}</span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", textAlign: "center" }}>
            Cargando vista previa...
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectSidebarRowProps {
  proj: Project;
  isActive: boolean;
  projectTasks: Task[]; 
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ProjectSidebarRow({ 
  proj, 
  isActive, 
  projectTasks, 
  onClick, 
  onEdit, 
  onDelete 
}: ProjectSidebarRowProps) {
  const [hovered, setHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); 

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsExpanded(!isExpanded);
  };

  const maxHeight = isExpanded ? `${projectTasks.length * 32 + 8}px` : "0px";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px 8px 12px", 
          cursor: "pointer",
          background: isActive ? COLORS.bgSidebarActive : "transparent",
          color: isActive ? COLORS.text : COLORS.textMuted,
          fontFamily: "'Sansation', sans-serif",
          fontSize: 14,
          fontWeight: isActive ? 700 : 400,
          transition: "background-color 0.15s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, overflow: "hidden" }}>
          <button
            onClick={handleToggleExpand}
            style={{
              background: "transparent",
              border: "none",
              color: COLORS.textMuted,
              cursor: "pointer",
              padding: 4,
              display: "flex",
              transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <ChevronDown size={14} />
          </button>

          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {proj.name}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.15s ease", flexShrink: 0 }}>
          <button
            title="Editar Proyecto"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", padding: 2, display: "flex" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
          >
            <Pencil size={12} />
          </button>
          <button
            title="Eliminar Proyecto"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", padding: 2, display: "flex" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.priorityHigh)}
            onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div
        style={{
          maxHeight: maxHeight,
          overflow: "hidden",
          transition: "max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
          opacity: isExpanded ? 1 : 0,
          paddingLeft: 34, 
          display: "flex",
          flexDirection: "column",
          background: "rgba(0, 0, 0, 0.1)" 
        }}
      >
        {projectTasks.length > 0 ? (
          projectTasks.map((task) => (
            <SidebarTaskItem key={task.id} task={task} />
          ))
        ) : (
          <div style={{ padding: "6px 0", fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "'Sansation', sans-serif", fontStyle: "italic" }}>
            Sin tareas
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectSidebarProps {
  projects: Project[];
  activeProject: Project | null;
  tasks: Task[]; 
  onSelectProject: (proj: Project | null) => void;
  onCreateProjectClick: () => void;
  onEditProjectClick: (proj: Project) => void;
  onDeleteProjectClick: (proj: Project) => void;
}

export default function ProjectSidebar({
  projects,
  activeProject,
  tasks,
  onSelectProject,
  onCreateProjectClick,
  onEditProjectClick,
  onDeleteProjectClick,
}: ProjectSidebarProps) {
  return (
    <div
      style={{
        width: 220,
        background: COLORS.bgSidebar,
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
        borderRight: "1px solid #222",
        overflow: "auto",
        flexShrink: 0,
      }}
    >
      <div
        onClick={() => onSelectProject(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px 10px 24px",
          cursor: "pointer",
          background: activeProject === null ? COLORS.bgSidebarActive : "transparent",
          color: activeProject === null ? COLORS.text : COLORS.textMuted,
          fontFamily: "'Sansation', sans-serif",
          fontSize: 14,
          fontWeight: activeProject === null ? 700 : 400,
          transition: "background-color 0.15s ease",
          marginBottom: 8,
          borderBottom: "1px solid #1a1a1a"
        }}
      >
        <Layers size={14} style={{ color: activeProject === null ? "#C3E8BD" : COLORS.textMuted }} />
        <span>Todas las tareas</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 16px 4px" }}>
        <p style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: 0.5 }}>
          PROYECTOS
        </p>
        <button
          onClick={onCreateProjectClick}
          title="Nuevo Proyecto"
          style={{ background: "transparent", border: "none", color: COLORS.textMuted, fontSize: 26, cursor: "pointer", padding: 0 }}
        >
          +
        </button>
      </div>

      {projects.map((proj) => {
        const projectTasks = tasks.filter(t => t.projectId === proj.id);

        return (
          <ProjectSidebarRow
            key={proj.id}
            proj={proj}
            isActive={activeProject?.id === proj.id}
            projectTasks={projectTasks} 
            onClick={() => onSelectProject(proj)}
            onEdit={() => onEditProjectClick(proj)}
            onDelete={() => onDeleteProjectClick(proj)}
          />
        );
      })}
    </div>
  );
}