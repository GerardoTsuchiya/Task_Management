import { COLORS } from "../constants/colors.ts";

interface OutlineBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  variant?: "outline" | "filled";
}

export default function OutlineBtn({ children, onClick, style = {}, variant = "outline" }: OutlineBtnProps) {
  const isFilled = variant === "filled";

  return (
    <button 
      onClick={onClick} 
      style={{ 
        background: isFilled ? COLORS.btnFilledBg : "transparent", 
        border: isFilled ? "none" : `1px solid ${COLORS.btnBorder}`, 
        borderRadius: 20, 
        padding: "10px 28px", 
        color: isFilled ? COLORS.btnFilledText : COLORS.btnText, 
        fontSize: 14, 
        fontWeight: isFilled ? 700 : 400,
        fontFamily: "'Sansation', sans-serif", 
        cursor: "pointer", 
        width: "fit-content",
        minWidth: "160px",
        boxShadow: isFilled ? "0 4px 6px rgba(0,0,0,0.1)" : "none",
        display: "inline-block",
        ...style 
      }}
    >
      {children}
    </button>
  );
}