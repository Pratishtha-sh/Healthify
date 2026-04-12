import { useState, useEffect } from "react";
import { CheckSquare, Square, CalendarPlus, BedDouble, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CalendarWidget from "../components/CalendarWidget";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([
        { id: 1, title: "Schedule Surgeries", count: "100+", done: true },
        { id: 2, title: "Appoint hospital rooms", count: "100+", done: true },
        { id: 3, title: "Alert Housekeeping", count: "100+", done: true },
    ]);

    const [stats] = useState({ icu: 105, wards: 343, micu: 49 });
    const [appointments, setAppointments] = useState([]);
    const [approving, setApproving] = useState(null); // id being processed
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [showAddTask, setShowAddTask] = useState(false);
    const [notification, setNotification] = useState("");

    const fetchAppointments = () => {
        fetch("http://localhost:5000/api/appointments")
            .then(res => res.json())
            .then(data => setAppointments(Array.isArray(data) ? data : []))
            .catch(err => console.error("Error fetching appointments:", err));
    };

    useEffect(() => { fetchAppointments(); }, []);

    const approveAppointment = async (id, newStatus = "scheduled") => {
        setApproving(id);
        try {
            await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            setNotification(
                newStatus === "emergency"
                    ? "🚨 Emergency appointment escalated!"
                    : "✅ Appointment approved and scheduled!"
            );
            setTimeout(() => setNotification(""), 3000);
            fetchAppointments();
        } catch (err) {
            console.error(err);
        } finally {
            setApproving(null);
        }
    };

    const addTask = () => {
        if (!newTaskTitle.trim()) return;
        setTasks(prev => [...prev, { id: Date.now(), title: newTaskTitle.trim(), count: "1", done: false }]);
        setNewTaskTitle("");
        setShowAddTask(false);
    };

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const pendingApps = appointments.filter(a => a.status === "pending" || a.status === "emergency");
    const scheduledCount = appointments.filter(a => a.status === "scheduled").length;

    const navLinks = [
        { label: "Home", path: "/admin" },
        { label: "Appointment", path: "/admin" },
        { label: "Billing", path: "/billing" },
    ];

    return (
        <>
            <Navbar links={navLinks} />

            {/* Global notification toast */}
            {notification && (
                <div style={{
                    position: "fixed", top: "80px", right: "2rem", zIndex: 999,
                    backgroundColor: notification.includes("Emergency") ? "var(--danger-red)" : "var(--primary-teal)",
                    color: "white", padding: "1rem 1.8rem", borderRadius: "10px",
                    fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    animation: "slideIn 0.3s ease"
                }}>
                    {notification}
                </div>
            )}

            <div className="page-content" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                {/* ── Top Section: 4-column grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 320px", gap: "1.5rem", alignItems: "stretch" }}>

                    {/* 1. Task List */}
                    <Card>
                        <h2 style={{ marginBottom: "0.3rem" }}>Task List</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
                            Deadline — 8th Feb 2026
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {tasks.map(task => (
                                <div key={task.id} className="flex-between" style={{ padding: "0.65rem 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }} onClick={() => toggleTask(task.id)}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div style={{
                                            width: "30px", height: "30px", borderRadius: "50%",
                                            backgroundColor: "var(--glass-glow)", color: "var(--primary-teal)",
                                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.9rem"
                                        }}>A</div>
                                        <span style={{ fontWeight: 500, fontSize: "0.9rem", textDecoration: task.done ? "line-through" : "none", color: task.done ? "var(--text-muted)" : "var(--text-main)" }}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)" }}>
                                        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{task.count}</span>
                                        {task.done
                                            ? <CheckSquare size={18} color="var(--primary-teal)" />
                                            : <Square size={18} color="#ccc" />
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showAddTask ? (
                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                                <input
                                    type="text"
                                    placeholder="Task name…"
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addTask()}
                                    style={{ flex: 1, padding: "0.5rem 0.8rem", borderRadius: "6px", border: "1px solid #ddd", outline: "none", fontSize: "0.88rem" }}
                                />
                                <button className="btn-primary" onClick={addTask} style={{ padding: "0.5rem 0.9rem", fontSize: "0.85rem" }}>Add</button>
                            </div>
                        ) : (
                            <div
                                onClick={() => setShowAddTask(true)}
                                style={{ textAlign: "right", marginTop: "0.8rem", color: "var(--primary-teal)", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}
                            >
                                + Add Task
                            </div>
                        )}
                    </Card>

                    {/* 2. Web Bookings (Pending Appointments) */}
                    <Card style={{ border: "2px solid var(--primary-teal)", display: "flex", flexDirection: "column" }}>
                        <div className="flex-between" style={{ marginBottom: "1rem" }}>
                            <h2 style={{ color: "var(--primary-teal)" }}>Web Bookings</h2>
                            <span className="badge badge-gray">{pendingApps.length} pending</span>
                        </div>

                        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {pendingApps.length === 0 ? (
                                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: "0.5rem" }}>
                                    No pending requests 🎉
                                </p>
                            ) : (
                                pendingApps.map(app => (
                                    <div key={app._id} style={{
                                        padding: "0.8rem 1rem", borderRadius: "8px",
                                        backgroundColor: app.status === "emergency" ? "rgba(211,47,47,0.07)" : "#f9fafb",
                                        border: app.status === "emergency" ? "1.5px solid var(--danger-red)" : "1px solid #eee"
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                            <div>
                                                <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--primary-dark)" }}>
                                                    {app.status === "emergency" && "🚨 "}{app.specialtyRequested}
                                                </span>
                                                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                                    {new Date(app.date).toLocaleDateString()} | {app.timeSlot}
                                                </p>
                                                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#555" }}>
                                                    Patient: <strong>{app.patient}</strong>
                                                </p>
                                                {app.symptoms && (
                                                    <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                                                        "{app.symptoms.substring(0, 50)}{app.symptoms.length > 50 ? "…" : ""}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button
                                                className="btn-primary"
                                                onClick={() => approveAppointment(app._id, "scheduled")}
                                                disabled={approving === app._id}
                                                style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem" }}
                                            >
                                                {approving === app._id ? "…" : "✓ Approve"}
                                            </button>
                                            <button
                                                className="btn-danger"
                                                onClick={() => approveAppointment(app._id, "emergency")}
                                                disabled={approving === app._id}
                                                style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem" }}
                                            >
                                                🚨 Emergency
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* 3. Operational Summary */}
                    <Card style={{ border: "2px solid var(--primary-teal)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "2rem 1.5rem" }}>
                        <ClipboardList size={36} color="var(--primary-teal)" style={{ marginBottom: "1rem" }} />
                        <h2 style={{ color: "var(--primary-teal)", marginBottom: "1rem" }}>Operational Summary</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "85%" }}>
                            Please review today's scheduled appointments, room allocations, and pending patient registrations.
                            Ensure all appointments are confirmed and billing is initiated for completed consultations.
                        </p>
                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                            <span className="badge badge-teal">{scheduledCount} Scheduled</span>
                            <span className="badge badge-yellow">{pendingApps.length} Pending</span>
                        </div>
                        <div
                            onClick={() => navigate("/billing")}
                            style={{ marginTop: "1.5rem", color: "var(--primary-teal)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", textDecoration: "underline" }}
                        >
                            Goto Billing →
                        </div>
                    </Card>

                    {/* 4. Calendar Widget */}
                    <CalendarWidget />
                </div>

                {/* ── Action Cards ── */}
                <div className="grid-3">
                    <Card className="flex-center glow-bg hover-lift" style={{ flexDirection: "column", padding: "2rem 1rem", border: "none", cursor: "pointer" }}>
                        <CalendarPlus size={72} strokeWidth={1.2} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.3rem", marginBottom: "1.2rem", lineHeight: 1.3 }}>
                            Schedule<br />Appointments
                        </h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1rem" }}>Proceed</button>
                    </Card>

                    <Card className="flex-center glow-bg hover-lift" style={{ flexDirection: "column", padding: "2rem 1rem", border: "none", cursor: "pointer" }}>
                        <BedDouble size={72} strokeWidth={1.2} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.3rem", marginBottom: "1.2rem", lineHeight: 1.3 }}>
                            Appoint<br />Rooms
                        </h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1rem" }}>Proceed</button>
                    </Card>

                    <Card className="flex-center glow-bg hover-lift" style={{ flexDirection: "column", padding: "2rem 1rem", border: "none", cursor: "pointer" }}>
                        <ClipboardList size={72} strokeWidth={1.2} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.3rem", marginBottom: "1.2rem", lineHeight: 1.3 }}>
                            Patient<br />Registration
                        </h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1rem" }}>Proceed</button>
                    </Card>
                </div>

                {/* ── Details Section ── */}
                <Card className="glow-bg" style={{ border: "none", padding: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
                        <div>
                            <h2 style={{ letterSpacing: "1px", marginBottom: "1.2rem", textTransform: "uppercase", fontSize: "1rem" }}>Details</h2>
                            <div style={{ fontSize: "1.1rem", color: "var(--primary-dark)", lineHeight: 2 }}>
                                <div>Number of active patients in ICU: <strong>{stats.icu}</strong></div>
                                <div>Number of active patients in Wards: <strong>{stats.wards}</strong></div>
                                <div>Number of patients in MICU: <strong>{stats.micu}</strong></div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "300px" }}>
                            {[
                                { name: "Dr. Armaan Syed", status: "On Leave" },
                                { name: "Dr. Sakshi Mohapatra", status: "On Leave" },
                            ].map((dr, idx) => (
                                <div key={idx} className="flex-between" style={{ backgroundColor: "rgba(255,255,255,0.75)", padding: "0.9rem 1rem", borderRadius: "10px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                                        <div style={{
                                            width: "34px", height: "34px", borderRadius: "50%",
                                            backgroundColor: "#e8f5e9", color: "var(--accent-green)",
                                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold"
                                        }}>A</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{dr.name}</div>
                                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{dr.status}</div>
                                        </div>
                                    </div>
                                    <CalendarPlus size={18} color="#aaa" style={{ cursor: "pointer" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

            </div>
        </>
    );
};

export default AdminDashboard;
