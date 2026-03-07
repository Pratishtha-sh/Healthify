import { useState, useEffect } from "react";
import { CheckSquare, Square, CalendarPlus, BedDouble, ClipboardList } from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CalendarWidget from "../components/CalendarWidget";

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Schedule Surgeries", count: "100+", done: true },
        { id: 2, title: "Appoint hospital rooms", count: "100+", done: true },
        { id: 3, title: "Alert Housekeeping", count: "100+", done: true },
    ]);

    const [stats, setStats] = useState({
        icu: 105,
        wards: 343,
        micu: 49,
    });

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/appointments")
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(err => console.error("Error fetching appointments:", err));
    }, []);

    return (
        <>
            <Navbar
                links={[
                    { label: "Home", path: "/" },
                    { label: "Appointment", path: "/appointment" },
                    { label: "Billing", path: "/billing" },
                ]}
            />

            <div className="page-content" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                {/* Top Section */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 350px", gap: "2rem", alignItems: "stretch" }}>

                    {/* Task List */}
                    <Card>
                        <h2 style={{ marginBottom: "0.5rem" }}>Task List</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Deadline - 8th Feb 2026</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {tasks.map(task => (
                                <div key={task.id} className="flex-between" style={{ padding: "0.8rem 0", borderBottom: "1px solid #eee" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{
                                            width: "32px", height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor: "var(--glass-glow)",
                                            color: "var(--primary-teal)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontWeight: "bold"
                                        }}>A</div>
                                        <span style={{ fontWeight: 500 }}>{task.title}</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-muted)" }}>
                                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{task.count}</span>
                                        {task.done ? <CheckSquare color="var(--primary-teal)" /> : <Square color="#ccc" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ textAlign: "right", marginTop: "1rem", color: "var(--primary-teal)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                            Add Task
                        </div>
                    </Card>

                    {/* Operational Summary */}
                    <Card style={{
                        border: "2px solid var(--primary-teal)",
                        display: "flex", flexDirection: "column",
                        justifyContent: "center", alignItems: "center",
                        textAlign: "center", padding: "2rem"
                    }}>
                        <ClipboardList size={32} color="var(--primary-teal)" style={{ marginBottom: "1rem" }} />
                        <h2 style={{ color: "var(--primary-teal)", marginBottom: "1rem" }}>Operational Summary</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "80%" }}>
                            Please review today's scheduled appointments, room allocations, and pending patient registrations.
                            Ensure all appointments are confirmed and billing is initiated for completed consultations.
                        </p>
                        <div style={{ textAlign: "right", width: "100%", marginTop: "2rem", color: "var(--primary-teal)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                            Goto Billing
                        </div>
                    </Card>

                    {/* Calendar Widget */}
                    <CalendarWidget />
                </div>

                {/* Action Cards Section */}
                <div className="grid-3" style={{ marginTop: "1rem" }}>

                    <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "2rem 1rem", border: "none" }}>
                        <CalendarPlus size={80} strokeWidth={1.5} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.4rem", marginBottom: "1.5rem", lineHeight: 1.2 }}>
                            Schedule<br />Appointments
                        </h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1.1rem" }}>Proceed</button>
                    </Card>

                    <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "2rem 1rem", border: "none" }}>
                        <BedDouble size={80} strokeWidth={1.5} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.4rem", marginBottom: "1.5rem", lineHeight: 1.2 }}>
                            Appoint<br />Rooms
                        </h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1.1rem" }}>Proceed</button>
                    </Card>

                    <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "2rem 1rem", border: "none" }}>
                        <ClipboardList size={80} strokeWidth={1.5} color="#111" style={{ marginBottom: "1rem" }} />
                        <h3 style={{ color: "var(--primary-teal)", textAlign: "center", fontSize: "1.4rem", marginBottom: "1.5rem", lineHeight: 1.2 }}>
                            Patient<br />Registration
                        </h3>
                        <button className="btn-primary" style={{ width: "80%", fontSize: "1.1rem" }}>Proceed</button>
                    </Card>

                </div>

                {/* Details Section */}
                <Card className="glow-bg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "none", padding: "2rem" }}>
                    <div>
                        <h2 style={{ letterSpacing: "1px", marginBottom: "1rem" }}>DETAILS</h2>
                        <div style={{ fontSize: "1.2rem", color: "var(--primary-dark)", lineHeight: 1.6 }}>
                            <div>Number of active patients in ICU: {stats.icu}</div>
                            <div>Number of active patients in Wards: {stats.wards}</div>
                            <div>Number of patients in MICU : {stats.micu}</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px" }}>
                        {[{ name: "Dr. Armaan Syed" }, { name: "Dr. Sakshi Mohapatra" }].map((dr, idx) => (
                            <div key={idx} className="flex-between" style={{ backgroundColor: "rgba(255,255,255,0.7)", padding: "1rem", borderRadius: "8px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#e8f5e9", color: "#4caf50", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>A</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{dr.name}</div>
                                        <div style={{ fontSize: "0.8rem", color: "#666" }}>On Leave</div>
                                    </div>
                                </div>
                                <div style={{ color: "#aaa" }}>
                                    <CalendarPlus size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </>
    );
};

export default AdminDashboard;
