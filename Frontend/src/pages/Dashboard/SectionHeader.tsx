import { COLORS } from "../../constants/colors.ts";

interface SectionHeaderProps {
  children: React.ReactNode;
}

export default function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div style={{ background: COLORS.sectionHeader, borderRadius: 6, padding: "7px 14px", display: "flex", alignItems: "center", marginBottom: 2 }}>
      <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 14, fontWeight: 600, flex: 2, minWidth: 0 }}>
        {children}
      </span>

      <div style={{ display: "flex", alignItems: "center", flex: 8, minWidth: 0, overflow: "hidden" }}>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, flex: 2.2, minWidth: 0, paddingRight: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Descripción
        </span>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, flex: 1.8, minWidth: 0, paddingRight: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Asignado
        </span>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, flex: 1.8, minWidth: 0, paddingRight: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Vencimiento
        </span>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, flex: 1.2, minWidth: 0, paddingRight: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Prioridad
        </span>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, flex: 1, textAlign: "center", minWidth: 96, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Acciones
        </span>
      </div>
    </div>
  );
}
