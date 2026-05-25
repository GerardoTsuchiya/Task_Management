import { useState } from "react";
import { Pencil, Trash2, Layers } from "lucide-react";
import { COLORS } from "../../constants/colors.ts";

interface Project {
  id: number;
  name: string;
}

interface ProjectSidebarRowProps {
  proj: Project;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ProjectSidebarRow({ proj, isActive, onClick, onEdit, onDelete }: ProjectSidebarRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 14px 8px 24px",
        cursor: "pointer",
        background: isActive ? COLORS.bgSidebarActive : "transparent",
        color: isActive ? COLORS.text : COLORS.textMuted,
        fontFamily: "'Sansation', sans-serif",
        fontSize: 14,
        fontWeight: isActive ? 700 : 400,
        transition: "background-color 0.15s ease",
      }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: 8 }}>
        {proj.name}
      </span>

      <div style={{ display: "flex", gap: 10, alignItems: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.15s ease", flexShrink: 0 }}>
        <button
          title="Editar Proyecto"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", padding: 2, display: "flex" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
        >
          <Pencil size={13} />
        </button>
        <button
          title="Eliminar Proyecto"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", padding: 2, display: "flex" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.priorityHigh)}
          onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

interface ProjectSidebarProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (proj: Project | null) => void;
  onCreateProjectClick: () => void;
  onEditProjectClick: (proj: Project) => void;
  onDeleteProjectClick: (proj: Project) => void;
}

export default function ProjectSidebar({
  projects,
  activeProject,
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

      {projects.map((proj) => (
        <ProjectSidebarRow
          key={proj.id}
          proj={proj}
          isActive={activeProject?.id === proj.id}
          onClick={() => onSelectProject(proj)}
          onEdit={() => onEditProjectClick(proj)}
          onDelete={() => onDeleteProjectClick(proj)}
        />
      ))}
    </div>
  );
}