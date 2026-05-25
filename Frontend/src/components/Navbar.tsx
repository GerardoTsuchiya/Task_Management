import { useState, useRef, useEffect, useCallback } from "react";
import { COLORS } from "../constants/colors.ts";
import { api } from "../services/api.ts";

interface Invitation {
  id: number;
  project: {
    id: number;
    name: string;
    user: { id: number; name: string; email: string };
  };
}

interface NavbarProps {
  onLogoClick?: () => void;
  onLogout?: () => void;
  user?: { name: string; email: string } | null;
  onInvitationAccepted?: () => void;
}

export default function Navbar({ onLogoClick, onLogout, user, onInvitationAccepted }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadInvitations = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.get("/notifications/invitations");
      setInvitations(data);
    } catch {
      // silently ignore
    }
  }, [user]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  async function handleAccept(id: number) {
    setLoadingId(id);
    try {
      await api.patch(`/notifications/invitations/${id}/accept`);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      onInvitationAccepted?.();
    } catch {
      // ignore
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDecline(id: number) {
    setLoadingId(id);
    try {
      await api.delete(`/notifications/invitations/${id}/decline`);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch {
      // ignore
    } finally {
      setLoadingId(null);
    }
  }

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
              color: COLORS.navbarText,
              position: "relative"
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
            {invitations.length > 0 && (
              <span style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: COLORS.priorityHigh,
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                borderRadius: "50%",
                width: 14,
                height: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Sansation', sans-serif",
              }}>
                {invitations.length}
              </span>
            )}
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

              {invitations.length > 0 && (
                <>
                  <div style={{ height: "1px", background: "#444", width: "100%" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 11, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Invitaciones pendientes
                    </p>
                    {invitations.map((inv) => (
                      <div key={inv.id} style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                        <p style={{ color: COLORS.text, fontFamily: "'Sansation', sans-serif", fontSize: 12, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {inv.project.name}
                        </p>
                        <p style={{ color: COLORS.textMuted, fontFamily: "'Sansation', sans-serif", fontSize: 11, margin: 0, opacity: 0.8 }}>
                          De: {inv.project.user.name}
                        </p>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            disabled={loadingId === inv.id}
                            onClick={() => handleAccept(inv.id)}
                            style={{
                              flex: 1,
                              background: COLORS.btnFilledBg,
                              color: COLORS.btnFilledText,
                              border: "none",
                              borderRadius: 6,
                              fontFamily: "'Sansation', sans-serif",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "5px 0",
                              cursor: loadingId === inv.id ? "default" : "pointer",
                              opacity: loadingId === inv.id ? 0.6 : 1,
                            }}
                          >
                            Aceptar
                          </button>
                          <button
                            disabled={loadingId === inv.id}
                            onClick={() => handleDecline(inv.id)}
                            style={{
                              flex: 1,
                              background: "transparent",
                              color: COLORS.textMuted,
                              border: `1px solid #555`,
                              borderRadius: 6,
                              fontFamily: "'Sansation', sans-serif",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "5px 0",
                              cursor: loadingId === inv.id ? "default" : "pointer",
                              opacity: loadingId === inv.id ? 0.6 : 1,
                            }}
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

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