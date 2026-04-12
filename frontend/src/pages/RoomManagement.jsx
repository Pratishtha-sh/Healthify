import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const WARD_COLORS = {
    General: { bg: "#e8f5e9", border: "#4caf50", badge: "#2e7d32" },
    ICU:     { bg: "#fce4ec", border: "#e91e63", badge: "#880e4f" },
    MICU:    { bg: "#fff3e0", border: "#ff9800", badge: "#e65100" },
    Private: { bg: "#e3f2fd", border: "#2196f3", badge: "#1565c0" },
};

const RoomManagement = () => {
    const navigate = useNavigate();
    const [rooms,   setRooms]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter,  setFilter]  = useState("All");

    // Assign modal state
    const [assigning,    setAssigning]    = useState(null); // room object
    const [patientName,  setPatientName]  = useState("");
    const [patientId,    setPatientId]    = useState("");
    const [notes,        setNotes]        = useState("");
    const [saving,       setSaving]       = useState(false);
    const [toast,        setToast]        = useState("");

    const fetchRooms = () => {
        setLoading(true);
        fetch("http://localhost:5000/api/rooms")
            .then(r => r.json())
            .then(d => { if (Array.isArray(d)) setRooms(d); })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchRooms(); }, []);

    const openAssign = (room) => { setAssigning(room); setPatientName(""); setPatientId(""); setNotes(""); };

    const confirmAssign = async () => {
        if (!patientName.trim()) return;
        setSaving(true);
        try {
            await fetch(`http://localhost:5000/api/rooms/${assigning._id}/assign`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId, patientName, notes }),
            });
            setToast(`✅ Bed ${assigning.roomNumber}-${assigning.bedNumber} assigned to ${patientName}`);
            setTimeout(() => setToast(""), 4000);
            setAssigning(null);
            fetchRooms();
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const freeBed = async (room) => {
        if (!window.confirm(`Release bed ${room.roomNumber}-${room.bedNumber} (occupied by ${room.patientName})?`)) return;
        try {
            await fetch(`http://localhost:5000/api/rooms/${room._id}/free`, { method: "PATCH" });
            setToast(`🛏️ Bed ${room.roomNumber}-${room.bedNumber} is now free`);
            setTimeout(() => setToast(""), 3000);
            fetchRooms();
        } catch (err) { console.error(err); }
    };

    const wards = ["All", "General", "ICU", "MICU", "Private"];
    const displayed = filter === "All" ? rooms : rooms.filter(r => r.ward === filter);
    const freeCount = rooms.filter(r => r.status === "free").length;
    const occupiedCount = rooms.filter(r => r.status === "occupied").length;

    return (
        <>
            <Navbar links={[{ label: "← Dashboard", path: "/admin" }]} />

            {/* Toast */}
            {toast && (
                <div style={{ position: "fixed", top: "80px", right: "2rem", zIndex: 999, background: "var(--primary-teal)", color: "white", padding: "1rem 1.8rem", borderRadius: "10px", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                    {toast}
                </div>
            )}

            {/* Assign Modal */}
            {assigning && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "white", borderRadius: "16px", padding: "2.5rem", width: "440px", maxWidth: "95vw" }}>
                        <h2 style={{ color: "var(--primary-dark)", marginBottom: "0.5rem" }}>Assign Bed</h2>
                        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                            {assigning.ward} Ward · Room {assigning.roomNumber} · Bed {assigning.bedNumber}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <input type="text" placeholder="Patient Name *" value={patientName} onChange={e => setPatientName(e.target.value)} required
                                style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #ddd", outline: "none", fontSize: "0.93rem" }} />
                            <input type="text" placeholder="Patient ID (optional)" value={patientId} onChange={e => setPatientId(e.target.value)}
                                style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #ddd", outline: "none", fontSize: "0.93rem" }} />
                            <textarea placeholder="Notes (e.g. diet restriction, special care)" value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                                style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #ddd", outline: "none", fontSize: "0.93rem", resize: "vertical" }} />
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                            <button className="btn-primary" onClick={confirmAssign} disabled={saving || !patientName.trim()} style={{ flex: 1, padding: "0.85rem" }}>
                                {saving ? "Assigning…" : "Confirm Assignment"}
                            </button>
                            <button onClick={() => setAssigning(null)} style={{ padding: "0.85rem 1.2rem", borderRadius: "10px", border: "1.5px solid #ddd", background: "white", cursor: "pointer" }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-content">
                <button onClick={() => navigate("/admin")} style={{ background: "none", border: "none", color: "var(--primary-teal)", fontWeight: 600, cursor: "pointer", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                    ← Back to Dashboard
                </button>
                <div className="flex-between" style={{ marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ color: "var(--primary-dark)" }}>Room & Bed Management</h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "0.3rem" }}>Assign and release hospital beds across all wards.</p>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ textAlign: "center", padding: "0.7rem 1.5rem", background: "#e8f5e9", borderRadius: "10px" }}>
                            <div style={{ fontWeight: 700, fontSize: "1.5rem", color: "#2e7d32" }}>{freeCount}</div>
                            <div style={{ fontSize: "0.78rem", color: "#555" }}>Free Beds</div>
                        </div>
                        <div style={{ textAlign: "center", padding: "0.7rem 1.5rem", background: "#fce4ec", borderRadius: "10px" }}>
                            <div style={{ fontWeight: 700, fontSize: "1.5rem", color: "#880e4f" }}>{occupiedCount}</div>
                            <div style={{ fontSize: "0.78rem", color: "#555" }}>Occupied</div>
                        </div>
                    </div>
                </div>

                {/* Ward filter tabs */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    {wards.map(w => (
                        <button key={w} onClick={() => setFilter(w)} style={{
                            padding: "0.5rem 1.3rem", borderRadius: "24px", cursor: "pointer", fontWeight: 600, fontSize: "0.88rem",
                            border: filter === w ? "2px solid var(--primary-teal)" : "1.5px solid #ddd",
                            background: filter === w ? "var(--glass-glow)" : "white",
                            color: filter === w ? "var(--primary-dark)" : "#888",
                        }}>
                            {w} {w !== "All" && `(${rooms.filter(r => r.ward === w).length})`}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Loading rooms…</p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.2rem" }}>
                        {displayed.map(room => {
                            const colors = WARD_COLORS[room.ward] || WARD_COLORS.General;
                            const isOcc  = room.status === "occupied";
                            return (
                                <div key={room._id} style={{ borderRadius: "12px", padding: "1.2rem", border: `2px solid ${isOcc ? colors.border : "#e0e0e0"}`, background: isOcc ? colors.bg : "white", transition: "all 0.2s" }}>
                                    {/* Header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                                        <div>
                                            <span style={{ fontWeight: 700, color: "var(--primary-dark)", fontSize: "1rem" }}>
                                                {room.roomNumber} — Bed {room.bedNumber}
                                            </span>
                                            <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#888" }}>
                                                {room.ward} Ward · Floor {room.floor >= 0 ? room.floor : `B${Math.abs(room.floor)}`}
                                            </p>
                                        </div>
                                        <span style={{ padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, backgroundColor: isOcc ? colors.badge : "#e0e0e0", color: isOcc ? "white" : "#666" }}>
                                            {isOcc ? "Occupied" : "Free"}
                                        </span>
                                    </div>

                                    {/* Patient info */}
                                    {isOcc && (
                                        <div style={{ marginBottom: "0.8rem", padding: "0.7rem 0.9rem", borderRadius: "8px", background: "rgba(255,255,255,0.7)", fontSize: "0.88rem" }}>
                                            <div style={{ fontWeight: 600, color: "var(--primary-dark)" }}>{room.patientName}</div>
                                            {room.admissionDate && <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Admitted: {new Date(room.admissionDate).toLocaleDateString()}</div>}
                                            {room.notes && <div style={{ color: "#555", marginTop: "4px", fontStyle: "italic" }}>"{room.notes}"</div>}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {isOcc ? (
                                        <button onClick={() => freeBed(room)} className="btn-danger" style={{ width: "100%", padding: "0.6rem" }}>
                                            🛏️ Release Bed
                                        </button>
                                    ) : (
                                        <button onClick={() => openAssign(room)} className="btn-primary" style={{ width: "100%", padding: "0.6rem" }}>
                                            + Assign Patient
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default RoomManagement;
