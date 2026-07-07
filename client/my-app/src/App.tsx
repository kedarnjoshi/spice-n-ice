import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddVenue from "./pages/AddVenue";
import AddEvent from "./pages/AddEvent";

// Placeholder for pages not yet built
function ComingSoon({ name }: { name: string }) {
    return (
        <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: 400, textAlign: "center",
        }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔧</div>
            <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F2EDE4", fontSize: 22, margin: "0 0 8px",
            }}>
                {name}
            </h2>
            <p style={{ color: "#7A7F9A", fontSize: 13 }}>Coming in the next sprint.</p>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ display: "flex", minHeight: "100vh", background: "#0D0F1A" }}>
                <Sidebar />
                <main style={{ marginLeft: 210, padding: "32px 36px", flex: 1, minWidth: 0 }}>
                    <Routes>
                        <Route path="/"            element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard"   element={<Dashboard />} />
                        <Route path="/events"      element={<ComingSoon name="Events" />} />
                        <Route path="/events/new"  element={<AddEvent />} />
                        <Route path="/venues/new"  element={<AddVenue />} />
                        <Route path="/calendar"    element={<ComingSoon name="Calendar" />} />
                        <Route path="/leads"       element={<ComingSoon name="Leads" />} />
                        <Route path="/quotes"      element={<ComingSoon name="Quote Builder" />} />
                        <Route path="/vendors"     element={<ComingSoon name="Vendors" />} />
                        <Route path="/team"        element={<ComingSoon name="Team" />} />
                        <Route path="/payments"    element={<ComingSoon name="Payments" />} />
                        <Route path="/reports"     element={<ComingSoon name="Reports" />} />
                        <Route path="*"            element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}