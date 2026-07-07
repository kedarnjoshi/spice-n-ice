import { Link, useLocation, useNavigate } from "react-router-dom";

const C = {
    bg: "#0D0F1A",
    surface: "#13162A",
    surfaceHigh: "#1B1F35",
    border: "#252A45",
    gold: "#C9973A",
    goldLight: "#E5B96A",
    saffron: "#E8631A",
    pearl: "#F2EDE4",
    muted: "#7A7F9A",
};

const NAV = [
    { icon: "⬡", label: "Dashboard",     path: "/dashboard" },
    { icon: "✦", label: "Events",        path: "/events" },
    { icon: "◈", label: "Calendar",      path: "/calendar" },
    { icon: "◎", label: "Leads",         path: "/leads" },
    { icon: "◇", label: "Quote Builder", path: "/quotes" },
    { icon: "◉", label: "Vendors",       path: "/vendors" },
    { icon: "⬟", label: "Team",          path: "/team" },
    { icon: "◆", label: "Payments",      path: "/payments" },
    { icon: "▦", label: "Reports",       path: "/reports" },
];

// Quick-add actions — separate from main nav
const QUICK_ADD = [
    { label: "Add Venue",  path: "/venues/new" },
    { label: "Add Event",  path: "/events/new" },
];

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div style={{
            width: 210,
            background: C.bg,
            borderRight: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 100,
        }}>

            {/* Logo */}
            <div style={{ padding: "24px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 20,
                    color: C.gold,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    cursor: "pointer",
                }} onClick={() => navigate("/dashboard")}>
                    Spice N' Ice
                </div>
                <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 2 }}>
                    EVENT MANAGEMENT
                </div>
            </div>

            {/* Main nav */}
            <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
                {NAV.map(n => {
                    const active = isActive(n.path);
                    return (
                        <Link
                            key={n.path}
                            to={n.path}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                width: "100%",
                                padding: "9px 12px",
                                borderRadius: 7,
                                background: active ? `${C.gold}18` : "transparent",
                                color: active ? C.gold : C.muted,
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: active ? 600 : 400,
                                marginBottom: 2,
                                textDecoration: "none",
                                transition: "all 0.15s",
                                boxSizing: "border-box",
                            }}
                        >
                            <span style={{ fontSize: 14, flexShrink: 0 }}>{n.icon}</span>
                            <span style={{ flex: 1 }}>{n.label}</span>
                            {active && (
                                <div style={{
                                    width: 3, height: 16,
                                    background: C.gold,
                                    borderRadius: 2,
                                    flexShrink: 0,
                                }} />
                            )}
                        </Link>
                    );
                })}

                {/* Divider */}
                <div style={{
                    height: 1,
                    background: C.border,
                    margin: "12px 4px",
                }} />

                {/* Quick add */}
                <div style={{
                    color: C.muted,
                    fontSize: 9,
                    letterSpacing: 1.2,
                    fontWeight: 600,
                    padding: "0 12px",
                    marginBottom: 8,
                }}>
                    QUICK ADD
                </div>
                {QUICK_ADD.map(q => (
                    <Link
                        key={q.path}
                        to={q.path}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 7,
                            background: isActive(q.path) ? `${C.gold}18` : "transparent",
                            color: isActive(q.path) ? C.gold : C.muted,
                            fontSize: 12,
                            fontWeight: 400,
                            marginBottom: 2,
                            textDecoration: "none",
                            transition: "all 0.15s",
                            boxSizing: "border-box",
                        }}
                    >
                        <span style={{ color: C.gold, fontSize: 12 }}>+</span>
                        {q.label}
                    </Link>
                ))}
            </nav>

            {/* User */}
            <div style={{
                padding: "14px 16px",
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}>
                <div style={{
                    width: 32, height: 32,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.gold}, ${C.saffron})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#000",
                    flexShrink: 0,
                }}>
                    AS
                </div>
                <div style={{ overflow: "hidden" }}>
                    <div style={{ color: C.pearl, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Anish Sahasrabudhe
                    </div>
                    <div style={{ color: C.muted, fontSize: 10 }}>Managing Director</div>
                </div>
            </div>

        </div>
    );
}