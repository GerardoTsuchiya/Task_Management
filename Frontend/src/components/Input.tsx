import { COLORS } from "../constants/colors.ts";

interface InputProps {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

export default function Input({ placeholder, type = "text", value, onChange, style }: InputProps) {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      style={{ 
        width: "100%", 
        maxWidth: "320px", 
        margin: "0 auto",
        background: COLORS.inputBg, 
        border: "none", 
        borderRadius: 6, 
        padding: "11px 16px", 
        color: COLORS.inputText, 
        fontSize: 14, 
        fontFamily: "'Sansation', sans-serif", 
        boxSizing: "border-box", 
        outline: "none",
        ...style
      }} 
    />
  );
}