import { COLORS } from "../../constants/colors.ts";

interface SectionHeaderProps {
  children: React.ReactNode;
}

export default function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div style={{ background: COLORS.sectionHeader, borderRadius: 6, padding: "7px 14px", display: "flex", alignItems: "center", marginBottom: 2 }}>
      <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 14, fontWeight: 600, flex: 1 }}>
        {children}
      </span>
      
      <div style={{ display: "flex", alignItems: "center", gap: 0, width: "680px", flexShrink: 0, paddingLeft: "0px" }}>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, width: "240px", textAlign: "left" }}>
          Descripción
        </span>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, width: "160px", textAlign: "left" }}>
          Vencimiento
        </span>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, width: "160px", textAlign: "left" }}>
          Prioridad
        </span>
        <span style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, opacity: 0.8, width: "120px", textAlign: "center" }}>
          Acciones
        </span>
      </div>
    </div>
  );
}