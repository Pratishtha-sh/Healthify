import { useState, useEffect } from "react";
import { CheckSquare, Square, CalendarPlus, BedDouble, ClipboardList, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CalendarWidget from "../components/CalendarWidget";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([
        { id: 1, title: "Schedule Surgeries",    count: "100+", done: true },
        { id: 2, title: "Appoint hospital rooms", count: "100+", done: true },
        { id: 3, title: "Alert Housekeeping",    count: "100+", done: true },
    ]);
    const [stats]           = useState({ icu: 105, wards: 343, micu: 49 });
    const [appointments, setAppointments] = useState([]);
    const [approving, setApproving]       = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [showAddTask, setShowAddTask]   = useState(false);
    const [notification, setNotification] = useState("");

    // Doctor-picker modal state
    const [pickerApp,         setPickerApp]         = useState(null); // appointment awaiting doctor choice
    const [pickerStatus,      setPickerStatus]      = useState("scheduled");
    const [doctorOptions,     setDoctorOptions]     = useState([]);
    const [selectedDoctorId,  setSelectedDoctorId]  = useState("");

    const [allDoctors, setAllDoctors] = useState([]); // real doctors from DB

    const fetchAppointments = () => {
        fetch("http://localhost:5000/api/appointments")
            .then(r => r.json())
            .then(d => setAppointments(Array.isArray(d) ? d : []))
            .catch(console.error);
    };

    useEffect(() => {
        fetchAppointments();
        // Fetch real doctors from DB
        fetch("http://localhost:5000/api/users/role/doctor")
            .then(r => r.json())
            .then(d => Array.isArray(d) && setAllDoctors(d))
            .catch(console.error);
    }, []);

    // Open modal: filter real DB doctors by specialty
    const openDoctorPicker = (app, status) => {
        const docs = allDoctors.filter(d =>
            !app.specialtyRequested || d.specialty === app.specialtyRequested
        );
        // If no match for specialty, show all doctors
        const finalDocs = docs.length > 0 ? docs : allDoctors;
        setDoctorOptions(finalDocs);
        setSelectedDoctorId(finalDocs[0]?._id || "");
        setPickerApp(app);
        setPickerStatus(status);
    };

    // Confirm assignment (using real MongoDB _id)
    const confirmAssignment = async () => {
        if (!pickerApp || !selectedDoctorId) return;
        const doc = doctorOptions.find(d => d._id === selectedDoctorId);
        if (!doc) return;
        setApproving(pickerApp._id);
        try {
            await fetch(`http://localhost:5000/api/appointments/${pickerApp._id}/assign-doctor`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: pickerStatus,
                    doctor: doc._id,
                    doctorName: doc.name,
                })
            });
            setNotification(
                pickerStatus === "emergency"
                    ? `🚨 Emergency assigned to ${doc.name}!`
                    : `✅ Appointment approved — assigned to ${doc.name}`
            );
            setTimeout(() => setNotification(""), 4000);
            fetchAppointments();
        } catch (err) {
            console.error(err);
        } finally {
            setApproving(null);
            setPickerApp(null);
        }
    };

    const addTask = () => {
        if (!newTaskTitle.trim()) return;
        setTasks(p => [...p, { id: Date.now(), title: newTaskTitle.trim(), count: "1", done: false }]);
        setNewTaskTitle("");
        setShowAddTask(false);
    };
    const toggleTask = id => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));

    const pendingApps   = appointments.filter(a => a.status === "pending" || a.status === "emergency");
    const scheduledCount = appointments.filter(a => a.status === "scheduled").length;

    const navLinks = [
        { label: "Home",        path: "/admin" },
        { label: "Appointment", path: "/admin" },
        { label: "Billing",     path: "/billing" },
    ];

    return (
        <>
            <Navbar links={navLinks} />

            {/* Toast notification */}
            {notification && (
                <div style={{
                    position: "fixed", top: "80px", right: "2rem", zIndex: 1100,
                    background: notification.includes("Emergency") ? "var(--danger-red)" : "var(--primary-teal)",
                    color: "white", padding: "1rem 1.8rem", borderRadius: "12px",
                    fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", maxWidth: "380px"
                }}>
                    {notification}
                </div>
            )}

            {/* ── Doctor Picker Modal ── */}
            {pickerApp && (
                <div style={{
                    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{
                        background: "white", borderRadius: "16px", padding: "2.5rem",
                        width: "480px", maxWidth: "95vw", boxShadow: "0 24px 64px rgba(0,0,0,0.3)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2 style={{ color: "var(--primary-dark)", margin: 0 }}>Assign Doctor</h2>
                            <X size={22} style={{ cursor: "pointer", color: "#888" }} onClick={() => setPickerApp(null)} />
                        </div>

                        {/* Patient summary */}
                        <div style={{ background: "var(--glass-glow)", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
                            <p style={{ margin: 0, fontWeight: 600, color: "var(--primary-dark)" }}>Patient: {pickerApp.patient}</p>
                            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                Specialty Required: <strong>{pickerApp.specialtyRequested}</strong>
                            </p>
                            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                {pickerApp.date ? new Date(pickerApp.date).toLocaleDateString() : ""} | {pickerApp.timeSlot}
                            </p>
                            {pickerApp.symptoms && (
                                <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#666", fontStyle: "italic" }}>
                                    "{pickerApp.symptoms}"
                                </p>
                            )}
                        </div>

                        {/* Doctor options */}
                        <p style={{ fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.75rem" }}>
                            Select Doctor ({pickerApp.specialtyRequested}):
                        </p>

                        {doctorOptions.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                                No doctors available for this specialty.
                            </p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
                                {doctorOptions.length === 0 ? (
                                        <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "1rem" }}>
                                            No {pickerApp?.specialtyRequested} doctors registered yet. Showing all available doctors.
                                        </p>
                                    ) : null}
                                    {doctorOptions.map(doc => (
                                    <label
                                        key={doc._id}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "1rem",
                                            padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer",
                                            border: `2px solid ${selectedDoctorId === doc._id ? "var(--primary-teal)" : "#e0e0e0"}`,
                                            background: selectedDoctorId === doc._id ? "var(--glass-glow)" : "white",
                                            transition: "all 0.15s"
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="doctor"
                                            value={doc._id}
                                            checked={selectedDoctorId === doc._id}
                                            onChange={() => setSelectedDoctorId(doc._id)}
                                            style={{ accentColor: "var(--primary-teal)" }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 600, color: "var(--primary-dark)" }}>{doc.name}</div>
                                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                                {doc.qualification && `${doc.qualification} · `}{doc.specialty}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button
                                className="btn-primary"
                                onClick={confirmAssignment}
                                disabled={!selectedDoctorId || approving}
                                style={{ flex: 1, padding: "0.85rem" }}
                            >
                                {approving ? "Assigning…" : "✓ Confirm & Approve"}
                            </button>
                            {pickerStatus !== "emergency" && (
                                <button
                                    className="btn-danger"
                                    onClick={() => { setPickerStatus("emergency"); confirmAssignment(); }}
                                    disabled={!selectedDoctorId || approving}
                                    style={{ padding: "0.85rem 1.2rem" }}
                                >
                                    🚨 Emergency
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="page-content" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                {/* ── Top 4-col grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 320px", gap: "1.5rem", alignItems: "stretch" }}>

                    {/* Task List */}
                    <Card>
                        <h2 style={{ marginBottom: "0.3rem" }}>Task List</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.2rem" }}>Deadline — 8th Feb 2026</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {tasks.map(task => (
                                <div key={task.id} className="flex-between" style={{ padding: "0.6rem 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }} onClick={() => toggleTask(task.id)}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "var(--glass-glow)", color: "var(--primary-teal)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>A</div>
                                        <span style={{ fontWeight: 500, fontSize: "0.9rem", textDecoration: task.done ? "line-through" : "none", color: task.done ? "var(--text-muted)" : "var(--text-main)" }}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)" }}>
                                        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{task.count}</span>
                                        {task.done ? <CheckSquare size={18} color="var(--primary-teal)" /> : <Square size={18} color="#ccc" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showAddTask ? (
                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
                                <input type="text" placeholder="Task name…" value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addTask()}
                                    style={{ flex: 1, padding: "0.5rem 0.8rem", borderRadius: "6px", border: "1px solid #ddd", outline: "none", fontSize: "0.88rem" }} />
                                <button className="btn-primary" onClick={addTask} style={{ padding: "0.5rem 0.9rem", fontSize: "0.85rem" }}>Add</button>
                            </div>
                        ) : (
                            <div onClick={() => setShowAddTask(true)} style={{ textAlign: "right", marginTop: "0.75rem", color: "var(--primary-teal)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                                + Add Task
                            </div>
                        )}
                    </Card>

                    {/* Web Bookings */}
                    <Card style={{ border: "2px solid var(--primary-teal)", display: "flex", flexDirection: "column" }}>
                        <div className="flex-between" style={{ marginBottom: "1rem" }}>
                            <h2 style={{ color: "var(--primary-teal)" }}>Web Bookings</h2>
                            <span className="badge badge-gray">{pendingApps.length} pending</span>
                        </div>
                        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {pendingApps.length === 0 ? (
                                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontStyle: "italic" }}>No pending requests 🎉</p>
                            ) : (
                                pendingApps.map(app => (
                                    <div key={app._id} style={{
                                        padding: "0.8rem", borderRadius: "8px",
                                        backgroundColor: app.status === "emergency" ? "rgba(211,47,47,0.07)" : "#f9fafb",
                                        border: app.status === "emergency" ? "1.5px solid var(--danger-red)" : "1px solid #eee"
                                    }}>
                                        <div style={{ marginBottom: "0.5rem" }}>
                                            <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--primary-dark)" }}>
                                                {app.status === "emergency" && "🚨 "}{app.specialtyRequested}
                                            </span>
                                            <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                                {app.date ? new Date(app.date).toLocaleDateString() : ""} | {app.timeSlot}
                                            </p>
                                            <p style={{ margin: "2px 0 0", fontSize: "0.8rem" }}>Patient: <strong>{app.patient}</strong></p>
                                            {app.symptoms && (
                                                <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                                                    "{app.symptoms.substring(0, 45)}{app.symptoms.length > 45 ? "…" : ""}"
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", gap: "0.4rem" }}>
                                            <button
                                                className="btn-primary"
                                                onClick={() => openDoctorPicker(app, "scheduled")}
                                                style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem" }}
                                            >
                                                👤 Assign & Approve
                                            </button>
                                            <button
                                                className="btn-danger"
                                                onClick={() => openDoctorPicker(app, "emergency")}
                                                style={{ padding: "0.35rem 0.7rem", fontSize: "0.8rem" }}
                                            >
                                                🚨
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Operational Summary */}
                    <Card style={{ border: "2px solid var(--primary-teal)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "2rem 1.5rem" }}>
                        <ClipboardList size={36} color="var(--primary-teal)" style={{ marginBottom: "1rem" }} />
                        <h2 style={{ color: "var(--primary-teal)", marginBottom: "1rem" }}>Operational Summary</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "85%" }}>
                            Review scheduled appointments, room allocations, and pending registrations.
                            Confirm billing is initiated for completed consultations.
                        </p>
                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                            <span className="badge badge-teal">{scheduledCount} Scheduled</span>
                            <span className="badge badge-yellow">{pendingApps.length} Pending</span>
                        </div>
                        <div onClick={() => navigate("/billing")} style={{ marginTop: "1.5rem", color: "var(--primary-teal)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", textDecoration: "underline" }}>
                            Goto Billing →
                        </div>
                    </Card>

                    {/* Calendar */}
                    <CalendarWidget />
                </div>

                {/* ── Action Cards ── */}
                <div className="grid-3">
                    <Card className="flex-center glow-bg hover-lift" onClick={() => navigate("/admin/schedule")} style={{ flexDirection: "column", padding: "2rem 1rem", border: "none", cursor: "pointer" }}>
                        <CalendarPlus size={72} strokeWidth={1.2} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.3rem", marginBottom: "1.2rem" }}>Schedule<br />Appointments</h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1rem" }} onClick={e => { e.stopPropagation(); navigate("/admin/schedule"); }}>Proceed</button>
                    </Card>
                    <Card className="flex-center glow-bg hover-lift" onClick={() => navigate("/admin/rooms")} style={{ flexDirection: "column", padding: "2rem 1rem", border: "none", cursor: "pointer" }}>
                        <BedDouble size={72} strokeWidth={1.2} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.3rem", marginBottom: "1.2rem" }}>Appoint<br />Rooms</h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1rem" }} onClick={e => { e.stopPropagation(); navigate("/admin/rooms"); }}>Proceed</button>
                    </Card>
                    <Card className="flex-center glow-bg hover-lift" onClick={() => navigate("/admin/register-patient")} style={{ flexDirection: "column", padding: "2rem 1rem", border: "none", cursor: "pointer" }}>
                        <ClipboardList size={72} strokeWidth={1.2} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.3rem", marginBottom: "1.2rem" }}>Patient<br />Registration</h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1rem" }} onClick={e => { e.stopPropagation(); navigate("/admin/register-patient"); }}>Proceed</button>
                    </Card>
                </div>

                {/* ── Details ── */}
                <Card className="glow-bg" style={{ border: "none", padding: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
                        <div>
                            <h2 style={{ letterSpacing: "1px", marginBottom: "1.2rem", textTransform: "uppercase", fontSize: "1rem" }}>Details</h2>
                            <div style={{ fontSize: "1.1rem", color: "var(--primary-dark)", lineHeight: 2 }}>
                                <div>ICU active patients: <strong>{stats.icu}</strong></div>
                                <div>Active patients in Wards: <strong>{stats.wards}</strong></div>
                                <div>Patients in MICU: <strong>{stats.micu}</strong></div>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "300px" }}>
                            {[{ name: "Dr. Armaan Syed", status: "On Leave" }, { name: "Dr. Sakshi Mohapatra", status: "On Leave" }].map((dr, i) => (
                                <div key={i} className="flex-between" style={{ backgroundColor: "rgba(255,255,255,0.75)", padding: "0.9rem 1rem", borderRadius: "10px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#e8f5e9", color: "var(--accent-green)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>A</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{dr.name}</div>
                                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{dr.status}</div>
                                        </div>
                                    </div>
                                    <CalendarPlus size={18} color="#aaa" />
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
