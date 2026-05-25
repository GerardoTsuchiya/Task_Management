import { COLORS } from "../../constants/colors.ts";

interface Task {
  id: number;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  projectId: number | null;
}

interface ProjectChartsProps {
  tasks: Task[];
  isPieOnly?: boolean;
}

export default function ProjectCharts({ tasks, isPieOnly = false }: ProjectChartsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const counts = { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  tasks.forEach((t) => {
    if (counts[t.priority] !== undefined) {
      counts[t.priority]++;
    }
  });

  const maxCount = Math.max(...Object.values(counts), 1);

  const renderPieChart = () => (
    <div
      style={{
        background: COLORS.bgCard,
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        flex: 1,
      }}
    >
      <span style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
        PROGRESO DEL PROYECTO
      </span>
      
      <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#C3E8BD"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 16, fontWeight: 700 }}>
          {percentage}%
        </div>
      </div>

      <div style={{ color: COLORS.textMuted, fontSize: 12, fontFamily: "'Sansation', sans-serif" }}>
        {completedTasks} de {totalTasks} tareas completadas
      </div>
    </div>
  );

  if (isPieOnly) {
    return renderPieChart();
  }

  return (
    <div style={{ display: "flex", gap: 16, width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          background: COLORS.bgCard,
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: 12,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          flex: 1.5,
        }}
      >
        <span style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
          TAREAS POR PRIORIDAD
        </span>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 100, padding: "0 10px", marginTop: 8 }}>
          {[
            { key: "Urgent", label: "Urgente", count: counts.URGENT, color: COLORS.priorityUrgent || "#FF6B6B" },
            { key: "High", label: "Alta", count: counts.HIGH, color: COLORS.priorityHigh || "#FFAD46" },
            { key: "Medium", label: "Media", count: counts.MEDIUM, color: COLORS.priorityMed || "#4DABF7" },
            { key: "Low", label: "Baja", count: counts.LOW, color: COLORS.priorityLow || "#A9E34B" },
          ].map((bar) => {
            const barHeight = (bar.count / maxCount) * 100;
            return (
              <div key={bar.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ color: COLORS.text, fontSize: 11, fontFamily: "'Sansation', sans-serif", fontWeight: 700 }}>
                  {bar.count}
                </span>
                <div
                  style={{
                    width: 24,
                    height: `${barHeight}%`,
                    minHeight: bar.count > 0 ? 4 : 0,
                    background: bar.color,
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease",
                  }}
                />
                <span style={{ color: COLORS.textMuted, fontSize: 11, fontFamily: "'Sansation', sans-serif" }}>
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {renderPieChart()}
    </div>
  );
}