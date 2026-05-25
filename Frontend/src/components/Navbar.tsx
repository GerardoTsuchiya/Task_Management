import { useState, useRef, useEffect } from "react";
import { COLORS } from "../constants/colors.ts";

interface NavbarProps {
  onLogoClick?: () => void;
  onLogout?: () => void;
  user?: { name: string; email: string } | null;
}

export default function Navbar({ onLogoClick, onLogout, user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      style={{ 
        background: COLORS.navbar, 
        padding: "0 24px", 
        height: 44, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        position: "relative", 
        flexShrink: 0,
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        zIndex: 100 
      }}
    >
      <span 
        style={{ 
          color: COLORS.navbarText, 
          fontFamily: "'Sansation', sans-serif", 
          fontSize: 20, 
          fontWeight: 700, 
          letterSpacing: 1.5, 
          cursor: onLogoClick ? "pointer" : "default" 
        }} 
        onClick={onLogoClick}
      >
        Infuse
      </span>
      {user && onLogout && (
        <div ref={dropdownRef} style={{ position: "absolute", right: 24, display: "inline-block" }}>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            title="Mi cuenta"
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: "pointer", 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              color: COLORS.navbarText
            }}
          >
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          {isOpen && (
            <div 
              style={{ 
                position: "absolute",
                right: 0,
                marginTop: 8,
                background: COLORS.bgCard, 
                border: "1px solid #444",
                borderRadius: 8,
                width: 220,
                padding: "14px 16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <p style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 14, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </p>
                <p style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.8 }}>
                  {user.email}
                </p>
              </div>

              <div style={{ height: "1px", background: "#444", width: "100%" }} />
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: COLORS.priorityHigh, 
                  fontFamily: "'Sansation', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: "left",
                  padding: "4px 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}