import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CalendarWidget from "../components/CalendarWidget";
import Card from "../components/Card";
import Timeline from "../components/Timeline";

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [meds, setMeds] = useState([{ name: "", dosage: "", quantity: 1 }]);
    const [tips, setTips] = useState("");
    const [stats, setStats] = useState({ patients: 500, operations: 150, hours: 1500 });
    const [activeTab, setActiveTab] = useState("home");
    const [prescribeStatus, setPrescribeStatus] = useState("");

    const doctorId   = localStorage.getItem("userId")   || "";
    const doctorName = localStorage.getItem("userName")  || "Doctor";
    const doctorSpecialty = localStorage.getItem("userSpecialty") || "";

    const fetchAppointments = () => {
        fetch("http://localhost:5000/api/appointments")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Only show appointments assigned to this doctor
                    setAppointments(data.filter(a =>
                        a.doctor === doctorId && (a.status === "scheduled" || a.status === "emergency")
                    ));
                }
            })
            .catch(err => console.error("Error fetching appointments:", err));
    };

    useEffect(() => { fetchAppointments(); }, [doctorId]);

    const simulateOperation = () => {
        setStats(prev => ({
            patients: prev.patients + 1,
            operations: prev.operations + 1,
            hours: prev.hours + 3
        }));
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            fetchAppointments();
        } catch (err) {
            console.error(err);
        }
    };

    const submitPrescription = async (e) => {
        e.preventDefault();
        const payload = {
            patientId:   selectedApp.patient || "UnknownPatient",
            doctorId:    doctorId,
            doctorName:  doctorName,
            medications: meds,
            tips:        tips
        };
        try {
            await fetch("http://localhost:5000/api/prescriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            await updateStatus(selectedApp._id, "completed");
            setSelectedApp(null);
            setMeds([{ name: "", dosage: "", quantity: 1 }]);
            setTips("");
            setPrescribeStatus("Prescription submitted & appointment marked complete!");
            setTimeout(() => setPrescribeStatus(""), 3000);
            simulateOperation();
        } catch (err) {
            console.error(err);
        }
    };

    const scheduledApps = appointments.filter(a => a.status === "scheduled");
    const allUpcoming = appointments.filter(a => ["scheduled", "pending"].includes(a.status));

    const navLinks = [
        { label: "Home", tabKey: "home", onClick: () => setActiveTab("home") },
        { label: "Appointment", tabKey: "appointment", onClick: () => setActiveTab("appointment") },
        { label: "Schedule", tabKey: "schedule", onClick: () => setActiveTab("schedule") },
    ];

    return (
        <>
            <Navbar links={navLinks} activeTab={activeTab} />
            <div className="page-content">

                {/* ── Top Hero Row ── */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem", marginBottom: "2rem", alignItems: "stretch" }}>
                    <div className="glow-bg" style={{ flex: 1, padding: "2.5rem 2rem", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h1 style={{ fontSize: "3.2rem", color: "var(--primary-dark)", marginBottom: "0.5rem", lineHeight: 1.1 }}>
                            {doctorName}
                        </h1>
                        <p style={{ fontSize: "1.3rem", color: "var(--primary-teal)", lineHeight: 1.5 }}>
                            MD of General Medicine<br />
                            (MBBS AIIMS Delhi)
                        </p>
                        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
                            <span className="badge badge-teal">Active</span>
                            <span className="badge badge-gray">{scheduledApps.length} Appointments Today</span>
                        </div>
                    </div>
                    <div style={{ width: "340px", flexShrink: 0 }}>
                        <CalendarWidget />
                    </div>
                </div>

                {/* ── HOME TAB ── */}
                {activeTab === "home" && (
                    <>
                        {/* Scheduled appointments + Notifications */}
                        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>

                            {/* Scheduled appointments */}
                            <Card style={{ flex: 2, border: "2px solid var(--primary-teal)" }}>
                                <h2 style={{ color: "var(--primary-dark)", marginBottom: "1rem" }}>My Scheduled Appointments</h2>
                                {scheduledApps.length === 0 ? (
                                    <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No scheduled appointments yet.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                        {scheduledApps.map(app => (
                                            <div key={app._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1rem", backgroundColor: "var(--glass-glow)", borderRadius: "10px", borderLeft: "4px solid var(--primary-teal)" }}>
                                                <div>
                                                    <strong style={{ color: "var(--primary-dark)" }}>Patient: {app.patient}</strong>
                                                    <p style={{ margin: "3px 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                                        {new Date(app.date).toLocaleDateString()} &nbsp;|&nbsp; {app.timeSlot} &nbsp;|&nbsp; {app.specialtyRequested}
                                                    </p>
                                                    {app.symptoms && <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#666" }}>Symptoms: {app.symptoms}</p>}
                                                </div>
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => { setSelectedApp(app); setActiveTab("home"); }}
                                                    style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", flexShrink: 0 }}
                                                >
                                                    Prescribe
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Prescription Form */}
                                {selectedApp && (
                                    <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "2px dashed var(--primary-teal)" }}>
                                        <h3 style={{ color: "var(--primary-dark)", marginBottom: "1rem" }}>
                                            ✏️ Prescription for Patient: {selectedApp.patient}
                                        </h3>
                                        <form onSubmit={submitPrescription}>
                                            {meds.map((m, idx) => (
                                                <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                                    <input
                                                        type="text" placeholder="Medicine name" value={m.name}
                                                        onChange={e => { const n = [...meds]; n[idx].name = e.target.value; setMeds(n); }}
                                                        required style={{ flex: 2, padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" }}
                                                    />
                                                    <input
                                                        type="text" placeholder="Dosage" value={m.dosage}
                                                        onChange={e => { const n = [...meds]; n[idx].dosage = e.target.value; setMeds(n); }}
                                                        required style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" }}
                                                    />
                                                    <input
                                                        type="number" placeholder="Qty" value={m.quantity} min={1}
                                                        onChange={e => { const n = [...meds]; n[idx].quantity = Number(e.target.value); setMeds(n); }}
                                                        required style={{ width: "70px", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" }}
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setMeds([...meds, { name: "", dosage: "", quantity: 1 }])}
                                                style={{ marginBottom: "10px", background: "none", border: "1px dashed var(--primary-teal)", color: "var(--primary-teal)", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" }}
                                            >
                                                + Add Medicine
                                            </button>
                                            <div style={{ marginBottom: "10px" }}>
                                                <input
                                                    type="text" placeholder="Doctor's tips / notes"
                                                    value={tips} onChange={e => setTips(e.target.value)}
                                                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" }}
                                                />
                                            </div>
                                            <div style={{ display: "flex", gap: "1rem" }}>
                                                <button type="submit" className="btn-primary">Submit to Pharmacy</button>
                                                <button type="button" onClick={() => setSelectedApp(null)} style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "1px solid #ccc", background: "white", cursor: "pointer" }}>Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                {prescribeStatus && <p style={{ marginTop: "0.75rem", color: "var(--accent-green)", fontWeight: 600 }}>{prescribeStatus}</p>}
                            </Card>

                            {/* Notification Centre */}
                            <Card className="glow-bg" style={{ border: "none", flex: 1 }}>
                                <p className="section-label">Notification Centre</p>
                                <div className="notification-urgent">
                                    <span>⚠️</span>
                                    <span>Urgent requirement at Room no. 23A Bed no. 9, Patient name- Rohan Sharma</span>
                                </div>
                                <div className="notification-urgent">
                                    <span>⚠️</span>
                                    <span>Surgery in room no. 12, floor -1 in next 30 minutes, Patient name- Mohan Kumar</span>
                                </div>
                                <div className="notification-normal">
                                    <span>ℹ️</span>
                                    <span>New appointment request pending receptionist approval</span>
                                </div>
                            </Card>
                        </div>

                        {/* Stats Row */}
                        <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
                            <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "2.5rem 1rem", border: "none" }}>
                                <div className="stat-number">{stats.patients}+</div>
                                <p style={{ fontSize: "1rem", color: "var(--text-main)", fontWeight: 500 }}>Patients treated</p>
                            </Card>
                            <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "2.5rem 1rem", border: "none" }}>
                                <div className="stat-number">{stats.operations}+</div>
                                <p style={{ fontSize: "1rem", color: "var(--text-main)", fontWeight: 500 }}>Successful Operations</p>
                            </Card>
                            <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "2.5rem 1rem", border: "none" }}>
                                <div className="stat-number">{(stats.hours / 1000).toFixed(1)}K+</div>
                                <p style={{ fontSize: "1rem", color: "var(--text-main)", fontWeight: 500 }}>Hours worked</p>
                            </Card>
                        </div>

                        {/* Simulate Button */}
                        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                            <button className="btn-primary" onClick={simulateOperation} style={{ padding: "0.9rem 2.5rem", fontSize: "1rem" }}>
                                ✅ Simulate Treatment Completed
                            </button>
                        </div>
                    </>
                )}

                {/* ── APPOINTMENT TAB ── */}
                {activeTab === "appointment" && (
                    <Card>
                        <h2 style={{ color: "var(--primary-dark)", marginBottom: "1.5rem" }}>All Upcoming Appointments</h2>
                        {allUpcoming.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No upcoming appointments found.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {allUpcoming.map(app => (
                                    <div key={app._id} style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        padding: "1rem 1.2rem", backgroundColor: "var(--glass-glow)", borderRadius: "10px",
                                        borderLeft: app.status === "scheduled"
                                            ? "4px solid var(--primary-teal)"
                                            : app.status === "emergency"
                                            ? "4px solid var(--danger-red)"
                                            : "4px solid #90a4ae"
                                    }}>
                                        <div>
                                            <strong style={{ color: "var(--primary-dark)" }}>Patient: {app.patient}</strong>
                                            <p style={{ margin: "4px 0 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                                                📅 {new Date(app.date).toLocaleDateString()} &nbsp;|&nbsp; 🕐 {app.timeSlot} &nbsp;|&nbsp; 🏥 {app.specialtyRequested}
                                            </p>
                                            {app.symptoms && <p style={{ margin: "3px 0 0 0", fontSize: "0.82rem", color: "#666" }}>Symptoms: {app.symptoms}</p>}
                                        </div>
                                        <span className={`badge ${app.status === "scheduled" ? "badge-teal" : app.status === "emergency" ? "badge-red" : "badge-gray"}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                )}

                {/* ── SCHEDULE TAB ── */}
                {activeTab === "schedule" && (
                    <Timeline appointments={scheduledApps} />
                )}

            </div>
        </>
    );
};

export default DoctorDashboard;
