import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../api/events";
import { getAllVenues } from "../api/venues";
import type { Event } from "../types";

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
    green: "#2ECC9A",
    red: "#E05A5A",
    blue: "#4A90D9",
    purple: "#9B6EDB",
};

// ── Helpers ──────────────────────────────────────────────────────
// function fmt(n: number): string {
//     if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + "Cr";
//     if (n >= 100000)   return "₹" + (n / 100000).toFixed(2) + "L";
//     return "₹" + n.toLocaleString("en-IN");
// }

function statusColor(status: string): string {
    const map: Record<string, string> = {
        CONFIRMED:   C.green,
        IN_PROGRESS: C.gold,
        QUOTED:      C.blue,
        COMPLETED:   C.muted,
        CANCELLED:   C.red,
    };
    return map[status] ?? C.muted;
}

function statusLabel(status: string): string {
    const map: Record<string, string> = {
        CONFIRMED:   "Confirmed",
        IN_PROGRESS: "In Progress",
        QUOTED:      "Quoted",
        COMPLETED:   "Completed",
        CANCELLED:   "Cancelled",
    };
    return map[status] ?? status;
}

function eventTypeEmoji(type: string): string {
    const map: Record<string, string> = {
        WEDDING: "💍", RECEPTION: "🥂", SANGEET: "🎵",
        MEHENDI: "🌿", HALDI: "🌼", BARAAT: "🐴",
        BIRTHDAY: "🎂", CORPORATE: "🏢", CONFERENCE: "🎤",
        POOJA: "🪔", GRIHA_PRAVESH: "🏠", ANNIVERSARY: "❤️",
        PRODUCT_LAUNCH: "🚀", ENGAGEMENT: "💛", ROKA: "🪔",
    };
    return map[type] ?? "✦";
}

// ── Sub-components ───────────────────────────────────────────────
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: 20,
            ...style,
        }}>
            {children}
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <h2 style={{
                color: C.pearl,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
            }}>
                {children}
            </h2>
            <div style={{
                height: 2, width: 36,
                background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                marginTop: 6, borderRadius: 1,
            }} />
        </div>
    );
}

function Badge({ label, color }: { label: string; color: string }) {
    return (
        <span style={{
            background: color + "22",
            color,
            border: `1px solid ${color}44`,
            borderRadius: 4,
            padding: "2px 8px",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
        }}>
      {label}
    </span>
    );
}

function Skeleton({ width = "100%", height = 16 }: { width?: string | number; height?: number }) {
    return (
        <div style={{
            width,
            height,
            background: C.surfaceHigh,
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
        }} />
    );
}

// ── Dashboard ────────────────────────────────────────────────────
interface DashboardStats {
    totalEvents: number;
    confirmedEvents: number;
    quotedEvents: number;
    totalVenues: number;
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function loadData() {
            try {
                const [eventsData, venuesData] = await Promise.all([
                    getAllEvents(),
                    getAllVenues(),
                ]);

                setEvents(eventsData);
                setStats({
                    totalEvents:     eventsData.length,
                    confirmedEvents: eventsData.filter(e => e.eventStatus === "CONFIRMED").length,
                    quotedEvents:    eventsData.filter(e => e.eventStatus === "QUOTED").length,
                    totalVenues:     venuesData.length,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Recent events — last 5
    const recentEvents = [...events]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    // Events by type breakdown
    const byType = events.reduce<Record<string, number>>((acc, e) => {
        acc[e.type] = (acc[e.type] ?? 0) + 1;
        return acc;
    }, {});

    const topTypes = Object.entries(byType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    // ── Error state ────────────────────────────────────────────────
    if (error) {
        return (
            <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                height: 400, textAlign: "center",
            }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ color: C.pearl, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 8px" }}>
                    Could not load dashboard
                </h2>
                <p style={{ color: C.muted, fontSize: 13, margin: "0 0 24px" }}>{error}</p>
                <button
                    onClick={() => { setError(""); setLoading(true); window.location.reload(); }}
                    style={{
                        background: `linear-gradient(135deg, ${C.gold}, ${C.saffron})`,
                        color: "#000", border: "none", borderRadius: 8,
                        padding: "10px 24px", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    // ── Render ─────────────────────────────────────────────────────
    return (
        <div>
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

            {/* Greeting */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 28, color: C.pearl,
                    margin: 0, fontWeight: 700,
                }}>
                    Good morning 🌅
                </h1>
                <p style={{ color: C.muted, margin: "6px 0 0", fontSize: 13 }}>
                    {loading
                        ? "Loading your events…"
                        : events.length === 0
                            ? "No events yet. Add your first event to get started."
                            : `${stats?.confirmedEvents} confirmed · ${stats?.quotedEvents} awaiting confirmation`}
                </p>
            </div>

            {/* KPI row */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 14,
                marginBottom: 24,
            }}>
                {[
                    {
                        label: "Total Events",
                        value: loading ? null : stats?.totalEvents,
                        color: C.gold,
                        sub: "all time",
                        action: () => navigate("/events"),
                    },
                    {
                        label: "Confirmed",
                        value: loading ? null : stats?.confirmedEvents,
                        color: C.green,
                        sub: "active bookings",
                        action: () => navigate("/events"),
                    },
                    {
                        label: "Quoted",
                        value: loading ? null : stats?.quotedEvents,
                        color: C.blue,
                        sub: "awaiting sign-off",
                        action: () => navigate("/events"),
                    },
                    {
                        label: "Venues",
                        value: loading ? null : stats?.totalVenues,
                        color: C.purple,
                        sub: "registered",
                        action: () => navigate("/venues/new"),
                    },
                ].map(k => (
                    <Card
                        key={k.label}
                        style={{ cursor: "pointer", transition: "border-color 0.15s" }}
                    >
                        <div
                            onClick={k.action}
                            style={{ userSelect: "none" }}
                        >
                            <div style={{
                                color: C.muted, fontSize: 10,
                                letterSpacing: 0.8, marginBottom: 10,
                                fontWeight: 600,
                            }}>
                                {k.label.toUpperCase()}
                            </div>
                            {loading ? (
                                <Skeleton height={32} width={60} />
                            ) : (
                                <div style={{
                                    color: k.color, fontSize: 32,
                                    fontWeight: 700,
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                }}>
                                    {k.value}
                                </div>
                            )}
                            <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>
                                {k.sub}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main content row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>

                {/* Recent events table */}
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <SectionTitle>Recent Events</SectionTitle>
                        <button
                            onClick={() => navigate("/events/new")}
                            style={{
                                background: `linear-gradient(135deg, ${C.gold}, ${C.saffron})`,
                                color: "#000", border: "none", borderRadius: 6,
                                padding: "6px 14px", fontSize: 11, fontWeight: 700,
                                cursor: "pointer", fontFamily: "inherit",
                            }}
                        >
                            + New Event
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} height={44} />)}
                        </div>
                    ) : recentEvents.length === 0 ? (
                        <div style={{
                            textAlign: "center", padding: "40px 0",
                            color: C.muted, fontSize: 13,
                        }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
                            No events yet.{" "}
                            <span
                                onClick={() => navigate("/events/new")}
                                style={{ color: C.gold, cursor: "pointer", textDecoration: "underline" }}
                            >
                Add your first event
              </span>
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                                {["Client", "Type", "Venue", "Guests", "Status"].map(h => (
                                    <th key={h} style={{
                                        color: C.muted, fontSize: 10,
                                        letterSpacing: 0.8, padding: "0 8px 10px 0",
                                        textAlign: "left", fontWeight: 600,
                                    }}>
                                        {h.toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {recentEvents.map(e => (
                                <tr
                                    key={e.id}
                                    style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
                                    onClick={() => navigate("/events")}
                                >
                                    <td style={{ padding: "12px 8px 12px 0" }}>
                                        <div style={{ color: C.pearl, fontWeight: 600, fontSize: 13 }}>
                                            {e.clientName}
                                        </div>
                                        <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>
                                            {e.clientEmail}
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px 8px 12px 0" }}>
                                        <span style={{ fontSize: 16 }}>{eventTypeEmoji(e.type)}</span>
                                        {" "}
                                        <span style={{ color: C.muted, fontSize: 12 }}>
                        {(e.type ?? "UNKNOWN").replace(/_/g, " ")}
                      </span>
                                    </td>
                                    <td style={{ color: C.muted, fontSize: 12, padding: "12px 8px 12px 0" }}>
                                        {e.venueName
                                            ? <>{e.venueName}<br /><span style={{ fontSize: 11 }}>{e.venueCity}</span></>
                                            : <span style={{ color: C.border }}>—</span>}
                                    </td>
                                    <td style={{ color: C.muted, fontSize: 12, padding: "12px 8px 12px 0" }}>
                                        {e.guestCount?.toLocaleString("en-IN") ?? "—"}
                                    </td>
                                    <td style={{ padding: "12px 0" }}>
                                        <Badge
                                            label={statusLabel(e.eventStatus)}
                                            color={statusColor(e.eventStatus)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </Card>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Quick actions */}
                    <Card>
                        <SectionTitle>Quick Actions</SectionTitle>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[
                                { label: "＋  New Event",    path: "/events/new",  primary: true },
                                { label: "＋  New Venue",    path: "/venues/new",  primary: false },
                                { label: "◇  Quote Builder", path: "/quotes",      primary: false },
                                { label: "◎  View Leads",   path: "/leads",       primary: false },
                            ].map(a => (
                                <button
                                    key={a.path}
                                    onClick={() => navigate(a.path)}
                                    style={{
                                        background: a.primary
                                            ? `linear-gradient(135deg, ${C.gold}, ${C.saffron})`
                                            : C.surfaceHigh,
                                        color: a.primary ? "#000" : C.pearl,
                                        border: `1px solid ${a.primary ? "transparent" : C.border}`,
                                        borderRadius: 7,
                                        padding: "10px 14px",
                                        fontSize: 12,
                                        fontWeight: a.primary ? 700 : 500,
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                        textAlign: "left",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Event type breakdown */}
                    <Card>
                        <SectionTitle>By Event Type</SectionTitle>
                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {[1, 2, 3].map(i => <Skeleton key={i} height={32} />)}
                            </div>
                        ) : topTypes.length === 0 ? (
                            <div style={{ color: C.muted, fontSize: 12, textAlign: "center", padding: "20px 0" }}>
                                No data yet
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {topTypes.map(([type, count]) => (
                                    <div key={type}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: C.pearl, fontSize: 12 }}>
                        {eventTypeEmoji(type)} {type.replace(/_/g, " ")}
                      </span>
                                            <span style={{ color: C.gold, fontSize: 12, fontWeight: 700 }}>
                        {count}
                      </span>
                                        </div>
                                        <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
                                            <div style={{
                                                height: "100%",
                                                width: `${Math.round(count / events.length * 100)}%`,
                                                background: `linear-gradient(90deg, ${C.gold}, ${C.saffron})`,
                                                borderRadius: 2,
                                                transition: "width 0.4s ease",
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                </div>
            </div>

            {/* Empty state CTA — only shown when no events at all */}
            {!loading && events.length === 0 && (
                <Card style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 22, color: C.pearl, marginBottom: 8,
                    }}>
                        Start building your event pipeline
                    </div>
                    <p style={{ color: C.muted, fontSize: 13, margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                        Add a venue first, then create your first event. Everything else — vendors, team, payments — follows from there.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        <button
                            onClick={() => navigate("/venues/new")}
                            style={{
                                background: C.surfaceHigh, color: C.pearl,
                                border: `1px solid ${C.border}`, borderRadius: 8,
                                padding: "10px 20px", fontSize: 13, fontWeight: 600,
                                cursor: "pointer", fontFamily: "inherit",
                            }}
                        >
                            Add Venue First
                        </button>
                        <button
                            onClick={() => navigate("/events/new")}
                            style={{
                                background: `linear-gradient(135deg, ${C.gold}, ${C.saffron})`,
                                color: "#000", border: "none", borderRadius: 8,
                                padding: "10px 20px", fontSize: 13, fontWeight: 700,
                                cursor: "pointer", fontFamily: "inherit",
                            }}
                        >
                            Add Event →
                        </button>
                    </div>
                </Card>
            )}

        </div>
    );
}