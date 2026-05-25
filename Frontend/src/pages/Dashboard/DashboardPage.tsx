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
import InviteMemberModal from "./InviteMemberModal.tsx";
import ProjectSidebar from "./ProjectSidebar.tsx";
import ProjectCharts from "./ProjectCharts.tsx";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
  projectId: number | null;
  userId?: number;
  project?: { id: number; name: string } | null;
  assignedTo?: { id: number; name: string; email: string } | null;
}

interface ProjectMember {
  id: number;
  user: { id: number; name: string; email: string };
}

interface Project {
  id: number;
  name: string;
  userId: number;
  members: ProjectMember[];
}

interface DashboardPageProps {
  user: { id: number; name: string; email: string } | null;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [invitingProject, setInvitingProject] = useState<Project | null>(null);
  const [filterAssignedToMe, setFilterAssignedToMe] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false);

  const PRIORITY_ORDER: Record<string, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  function sortTasks(arr: Task[]) {
    if (!sortByPriority) return arr;
    return [...arr].sort((a, b) => (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0));
  }

  async function loadData() {
    try {
      const projs = await api.get("/projects");
      setProjects(projs);
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
    const previousActive = activeProject;

    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    if (activeProject?.id === id) setActiveProject(null);

    try {
      await api.delete(`/projects/${id}`);
      await loadData();
    } catch (err: any) {
      console.error(err);
      setProjects(previousProjects);
      setTasks(previousTasks);
      setActiveProject(previousActive);
      if (err.status === 403) {
        alert("No puedes eliminar este proyecto porque no eres el dueño.");
      } else {
        alert("Error al eliminar el proyecto.");
      }
    }
  }

  async function handleLeaveProject(id: number) {
    const previousProjects = [...projects];
    const previousTasks = [...tasks];
    const previousActive = activeProject;

    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    if (activeProject?.id === id) setActiveProject(null);

    try {
      await api.delete(`/projects/${id}/members/me`);
      await loadData();
    } catch (err: any) {
      console.error(err);
      setProjects(previousProjects);
      setTasks(previousTasks);
      setActiveProject(previousActive);
      alert("No se pudo salir del proyecto.");
    }
  }

  async function handleSaveTask(taskData: { title: string; desc: string; priority: string; dueDate: string; assignedToId?: number }) {
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
        assignedToId: taskData.assignedToId ?? null,
      });
      await loadData();
    } catch (err) {
      console.error(err);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== tempId));
    }
  }

  async function handleUpdateTask(id: number, updatedFields: { title: string; desc: string; priority: string; dueDate: string; assignedToId?: number | null }) {
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
        ...(updatedFields.assignedToId !== undefined && { assignedToId: updatedFields.assignedToId }),
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

  const projectTasks = activeProject
    ? tasks.filter((t) => t.projectId === activeProject.id)
    : tasks;

  const filteredTasks = filterAssignedToMe && user
    ? projectTasks.filter((t) => t.assignedTo?.id === user.id)
    : projectTasks;

  const todayStr = new Date().toISOString().split("T")[0]; 

  function canEditDeleteTask(task: Task): boolean {
    if (task.userId === user?.id) return true;
    if (task.projectId) {
      const proj = projects.find(p => p.id === task.projectId);
      return proj?.userId === user?.id;
    }
    return false;
  }

  const pendingTasksRaw: Task[] = [];
  const overdueTasksRaw: Task[] = [];
  const completedTasksRaw: Task[] = [];

  filteredTasks.forEach((task) => {
    const taskCleanDate = task.dueDate ? task.dueDate.split("T")[0] : null;

    if (task.status === "COMPLETED") {
      completedTasksRaw.push(task);
    } else if (taskCleanDate && taskCleanDate < todayStr) {
      overdueTasksRaw.push(task);
    } else {
      pendingTasksRaw.push(task);
    }
  });

  const pendingTasks = sortTasks(pendingTasksRaw);
  const overdueTasks = sortTasks(overdueTasksRaw);
  const completedTasks = sortTasks(completedTasksRaw);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column" }}>
      <Navbar onLogout={onLogout} user={user} onInvitationAccepted={loadData} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        <ProjectSidebar
          projects={projects}
          activeProject={activeProject}
          tasks={tasks}
          currentUserId={user?.id}
          onSelectProject={setActiveProject}
          onCreateProjectClick={() => setShowProjectModal(true)}
          onEditProjectClick={setEditingProject}
          onDeleteProjectClick={setProjectToDelete}
          onInviteMemberClick={setInvitingProject}
          onLeaveProjectClick={(proj) => handleLeaveProject(proj.id)}
        />
        
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", background: COLORS.bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px 8px" }}>
            <span style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 18, fontWeight: 700 }}>
              {activeProject ? activeProject.name : "Todas las tareas"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setSortByPriority((v) => !v)}
                title="Ordenar por prioridad"
                style={{
                  background: sortByPriority ? COLORS.textMuted : "transparent",
                  border: `1.5px solid ${COLORS.textMuted}`,
                  borderRadius: 20,
                  padding: "4px 14px",
                  color: sortByPriority ? COLORS.bg : COLORS.textMuted,
                  fontFamily: "'Sansation', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Por prioridad
              </button>
              <button
                onClick={() => setFilterAssignedToMe((v) => !v)}
                title="Filtrar por asignadas a mí"
                style={{
                  background: filterAssignedToMe ? COLORS.textMuted : "transparent",
                  border: `1.5px solid ${COLORS.textMuted}`,
                  borderRadius: 20,
                  padding: "4px 14px",
                  color: filterAssignedToMe ? COLORS.bg : COLORS.textMuted,
                  fontFamily: "'Sansation', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Asignadas a mí
              </button>
              <button onClick={() => setShowModal(true)} style={{ background: "transparent", border: "none", color: COLORS.textMuted, fontSize: 26, cursor: "pointer" }}>+</button>
            </div>
          </div>

          <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {pendingTasks.length > 0 && (
              <div>
                <SectionHeader>Pendientes</SectionHeader>
                {pendingTasks.map((t) => (
                  <TaskRow key={t.id} task={t} onToggleStatus={toggleTaskStatus} onViewClick={setViewingTask} onEditClick={setEditingTask} onDeleteClick={setTaskToDelete} canEditDelete={canEditDeleteTask(t)} />
                ))}
              </div>
            )}

            {overdueTasks.length > 0 && (
              <div>
                <SectionHeader>Atrasadas</SectionHeader>
                {overdueTasks.map((t) => (
                  <TaskRow key={t.id} task={t} onToggleStatus={toggleTaskStatus} onViewClick={setViewingTask} onEditClick={setEditingTask} onDeleteClick={setTaskToDelete} isOverdue={true} canEditDelete={canEditDeleteTask(t)} />
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <SectionHeader>Completadas</SectionHeader>
                {completedTasks.map((t) => (
                  <TaskRow key={t.id} task={t} onToggleStatus={toggleTaskStatus} onViewClick={setViewingTask} onEditClick={setEditingTask} onDeleteClick={setTaskToDelete} canEditDelete={canEditDeleteTask(t)} />
                ))}
              </div>
            )}

            {filteredTasks.length === 0 && (
              <p style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 14, textAlign: "center", marginTop: 50 }}>
                Sin tareas en este panel. Presiona + para agregar una.
              </p>
            )}

            {activeProject && filteredTasks.length > 0 && (
              <div style={{ marginTop: 24, maxWidth: 360, alignSelf: "flex-start", width: "100%" }}>
                <ProjectCharts tasks={filteredTasks} isPieOnly={true} />
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingTask && <ViewTaskModal task={viewingTask} onClose={() => setViewingTask(null)} />}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOwner={!!editingTask.projectId && projects.find(p => p.id === editingTask.projectId)?.userId === user?.id}
          projectMembers={
            editingTask.projectId
              ? (() => {
                  const proj = projects.find(p => p.id === editingTask.projectId);
                  if (!proj || proj.userId !== user?.id) return [];
                  return [
                    ...(user ? [{ id: -1, user: { id: user.id, name: `${user.name} (yo)`, email: user.email } }] : []),
                    ...proj.members,
                  ];
                })()
              : []
          }
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}
      {taskToDelete && <DeleteTaskModal task={taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleDeleteTask} />}

      {invitingProject && (
        <InviteMemberModal
          project={invitingProject}
          onClose={() => setInvitingProject(null)}
        />
      )}

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

      {showModal && (
        <NewTaskModal
          projectId={activeProject ? String(activeProject.id) : "0"}
          isOwner={!!activeProject && activeProject.userId === user?.id}
          projectMembers={
            activeProject && user && activeProject.userId === user.id
              ? [{ id: -1, user: { id: user.id, name: `${user.name} (yo)`, email: user.email } }, ...activeProject.members]
              : activeProject?.members ?? []
          }
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
        />
      )}
      
      {showProjectModal && (
        <NewProjectModal 
          onClose={() => setShowProjectModal(false)} 
          onSave={handleSaveProject} 
        />
      )}    
    </div>
  );
}