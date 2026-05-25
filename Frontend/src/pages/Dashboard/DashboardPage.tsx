import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors.ts";
import NewTaskModal from "./NewTaskModal.tsx";
import NewProjectModal from "./NewProjectModal.tsx";
import Navbar from "../../components/Navbar.tsx";
import { api } from "../../services/api.ts";

import SectionHeader from "./SectionHeader.tsx";
import TaskRow from "./TaskRow.tsx";
import ViewTaskModal from "./ViewTaskModal.tsx";
import EditTaskModal from "./EditTaskModal.tsx";
import DeleteTaskModal from "./DeleteTaskModal.tsx";
import EditProjectModal from "./EditProjectModal.tsx";
import DeleteProjectModal from "./DeleteProjectModal.tsx";
import ProjectSidebar from "./ProjectSidebar.tsx";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string; 
  projectId: number | null;
}

interface Project {
  id: number;
  name: string;
}

interface DashboardPageProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  // Iniciamos en null para que "Todas las tareas" sea la vista por defecto
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  async function loadData() {
    try {
      const projs = await api.get("/projects");
      setProjects(projs);
      // REMOVIDO: Ya no forzamos la selección del primer proyecto de forma automática
      const allTasks = await api.get("/tasks");
      setTasks(allTasks);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSaveProject(projectData: { name: string }) {
    try {
      const newProj = await api.post("/projects", { name: projectData.name });
      await loadData();
      setActiveProject(newProj);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateProject(id: number, newName: string) {
    const previousProjects = [...projects];
    
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    if (activeProject?.id === id) {
      setActiveProject(prev => prev ? { ...prev, name: newName } : null);
    }

    try {
      await api.patch(`/projects/${id}`, { name: newName });
      await loadData();
    } catch (err) {
      console.error(err);
      setProjects(previousProjects);
      alert("Error al renombrar el proyecto.");
    }
  }

  async function handleDeleteProject(id: number) {
    const previousProjects = [...projects];
    const previousTasks = [...tasks];

    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));

    if (activeProject?.id === id) {
      // Si eliminamos el proyecto en el que estábamos parados, volvemos a la vista general
      setActiveProject(null);
    }

    try {
      await api.delete(`/projects/${id}`);
      await loadData();
    } catch (err) {
      console.error(err);
      setProjects(previousProjects);
      setTasks(previousTasks);
      alert("Error al eliminar el proyecto.");
    }
  }

  async function handleSaveTask(taskData: { title: string; desc: string; priority: string; dueDate: string }) {
    const tempId = Date.now() * -1;
    const newTaskOptimista: Task = {
      id: tempId,
      title: taskData.title,
      description: taskData.desc || undefined,
      priority: taskData.priority as any,
      dueDate: taskData.dueDate || undefined,
      status: "PENDING",
      projectId: activeProject ? Number(activeProject.id) : null,
    };

    setTasks((prevTasks) => [...prevTasks, newTaskOptimista]);

    try {
      await api.post("/tasks", {
        title: taskData.title,
        description: taskData.desc || null,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        status: "PENDING",
        projectId: activeProject ? Number(activeProject.id) : null,
      });
      await loadData();
    } catch (err) {
      console.error(err);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== tempId));
    }
  }

  async function handleUpdateTask(id: number, updatedFields: { title: string; desc: string; priority: string; dueDate: string }) {
    const previousTasks = [...tasks];

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id
          ? { ...t, title: updatedFields.title, description: updatedFields.desc, priority: updatedFields.priority as any, dueDate: updatedFields.dueDate }
          : t
      )
    );

    try {
      await api.patch(`/tasks/${id}`, {
        title: updatedFields.title,
        description: updatedFields.desc || null,
        priority: updatedFields.priority,
        dueDate: updatedFields.dueDate || null,
      });
      await loadData();
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
    }
  }

  async function handleDeleteTask(id: number) {
    const previousTasks = [...tasks];
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));

    try {
      await api.delete(`/tasks/${id}`);
      await loadData();
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
    }
  }

  async function toggleTaskStatus(task: Task) {
    const previousTasks = [...tasks];
    const targetStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, status: targetStatus } : t))
    );

    try {
      if (task.status === "COMPLETED") {
        await api.patch(`/tasks/${task.id}/uncomplete`);
      } else {
        await api.patch(`/tasks/${task.id}/complete`);
      }
      await loadData();
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
    }
  }

  // Filtrado lógico: si activeProject es null, filteredTasks toma TODO el array completo de tareas
  const filteredTasks = activeProject 
    ? tasks.filter((t) => t.projectId === activeProject.id)
    : tasks;

  const todayStr = new Date().toISOString().split("T")[0]; 

  const pendingTasks: Task[] = [];
  const overdueTasks: Task[] = [];
  const completedTasks: Task[] = [];

  filteredTasks.forEach((task) => {
    const taskCleanDate = task.dueDate ? task.dueDate.split("T")[0] : null;

    if (task.status === "COMPLETED") {
      completedTasks.push(task);
    } else if (taskCleanDate && taskCleanDate < todayStr) {
      overdueTasks.push(task);
    } else {
      pendingTasks.push(task);
    }
  });

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column" }}>
      <Navbar onLogout={onLogout} user={user} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        <ProjectSidebar 
          projects={projects}
          activeProject={activeProject}
          onSelectProject={setActiveProject} // Maneja perfectamente objetos del proyecto o null
          onCreateProjectClick={() => setShowProjectModal(true)}
          onEditProjectClick={setEditingProject}
          onDeleteProjectClick={setProjectToDelete}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", background: COLORS.bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px 8px" }}>
            <span style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 18, fontWeight: 700 }}>
              {activeProject ? activeProject.name : "Todas las tareas"}
            </span>
            <button onClick={() => setShowModal(true)} style={{ background: "transparent", border: "none", color: COLORS.textMuted, fontSize: 26, cursor: "pointer" }}>+</button>
          </div>

          <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {pendingTasks.length > 0 && (
              <div>
                <SectionHeader>Pendientes</SectionHeader>
                {pendingTasks.map((t) => (
                  <TaskRow key={t.id} task={t} onToggleStatus={toggleTaskStatus} onViewClick={setViewingTask} onEditClick={setEditingTask} onDeleteClick={setTaskToDelete} />
                ))}
              </div>
            )}

            {overdueTasks.length > 0 && (
              <div>
                <SectionHeader>Atrasadas</SectionHeader>
                {overdueTasks.map((t) => (
                  <TaskRow key={t.id} task={t} onToggleStatus={toggleTaskStatus} onViewClick={setViewingTask} onEditClick={setEditingTask} onDeleteClick={setTaskToDelete} isOverdue={true} />
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <SectionHeader>Completadas</SectionHeader>
                {completedTasks.map((t) => (
                  <TaskRow key={t.id} task={t} onToggleStatus={toggleTaskStatus} onViewClick={setViewingTask} onEditClick={setEditingTask} onDeleteClick={setTaskToDelete} />
                ))}
              </div>
            )}

            {filteredTasks.length === 0 && (
              <p style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 14, textAlign: "center", marginTop: 50 }}>
                Sin tareas en este panel. Presiona + para agregar una.
              </p>
            )}
          </div>
        </div>
      </div>

      {viewingTask && <ViewTaskModal task={viewingTask} onClose={() => setViewingTask(null)} />}
      {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleUpdateTask} />}
      {taskToDelete && <DeleteTaskModal task={taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleDeleteTask} />}

      {editingProject && (
        <EditProjectModal 
          project={editingProject} 
          onClose={() => setEditingProject(null)} 
          onSave={handleUpdateProject} 
        />
      )}
      {projectToDelete && (
        <DeleteProjectModal 
          project={projectToDelete} 
          onClose={() => setProjectToDelete(null)} 
          onConfirm={handleDeleteProject} 
        />
      )}

      {showModal && <NewTaskModal projectId={activeProject ? String(activeProject.id) : "0"} onClose={() => setShowModal(false)} onSave={handleSaveTask} />}
      {showProjectModal && <NewProjectModal onClose={() => setShowProjectModal(false)} onSave={handleSaveProject} />}
    </div>
  );
}