import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CalendarWidget from "../components/CalendarWidget";

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [myAppointments, setMyAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const patientId = localStorage.getItem("userId") || "patient_guest";
    const patientName = localStorage.getItem("userName") || "Patient";

    useEffect(() => {
        fetch("http://localhost:5000/api/appointments")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filtered = data.filter(
                        a => a.patient === patientId && a.status === "scheduled"
                    );
                    setMyAppointments(filtered);
                }
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [patientId]);

    const navLinks = [
        { label: "Home", path: "/patient" },
        { label: "Appointment", path: "/patient/book" },
        { label: "Billing", path: "#" },
    ];

    // Latest approved appointment (for DETAILS section)
    const latest = myAppointments[0] || null;

    return (
        <>
            <Navbar links={navLinks} />
            <div className="page-content">

                {/* ── Hero Row ── */}
                <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", alignItems: "stretch" }}>

                    {/* Left: Greeting + Book button */}
                    <div className="glow-bg" style={{ flex: 1, padding: "2.5rem 2rem", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h1 style={{ fontSize: "3rem", color: "var(--primary-dark)", marginBottom: "0.5rem", lineHeight: 1.1 }}>
                            Hello, {patientName} 👋
                        </h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                            Get your appointments booked and billing done within a few clicks!
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate("/patient/book")}
                            style={{ padding: "0.9rem 2rem", fontSize: "1rem", width: "fit-content" }}
                        >
                            📅 Book Appointment
                        </button>
                    </div>

                    {/* Right: Calendar */}
                    <div style={{ width: "340px", flexShrink: 0 }}>
                        <CalendarWidget />
                    </div>
                </div>

                {/* ── Action Cards ── */}
                <div className="grid-3" style={{ marginBottom: "2rem" }}>

                    {/* Check Appointment Status */}
                    <Card
                        className="hover-lift"
                        style={{ cursor: "pointer", border: "1px solid rgba(0,137,123,0.2)", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.2rem", backgroundColor: "#f0fdf8" }}
                        onClick={() => {}}
                    >
                        <div style={{ fontSize: "2.8rem" }}>📋</div>
                        <div>
                            <h3 style={{ color: "var(--primary-dark)", fontSize: "1rem", marginBottom: "0.3rem" }}>Check Appointment Status</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                {loading ? "Loading..." : `${myAppointments.length} active appointment(s)`}
                            </p>
                        </div>
                    </Card>

                    {/* Complete Billing */}
                    <Card
                        className="hover-lift"
                        style={{ cursor: "pointer", border: "1px solid rgba(0,137,123,0.2)", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.2rem", backgroundColor: "#f0fdf8" }}
                        onClick={() => alert("Billing portal — coming soon!")}
                    >
                        <div style={{ fontSize: "2.8rem" }}>💳</div>
                        <div>
                            <h3 style={{ color: "var(--primary-dark)", fontSize: "1rem", marginBottom: "0.3rem" }}>Complete Billing</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>View and pay your medical bills</p>
                        </div>
                    </Card>

                    {/* Medical Record */}
                    <Card
                        className="hover-lift"
                        style={{ cursor: "pointer", border: "1px solid rgba(0,137,123,0.2)", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.2rem", backgroundColor: "#f0fdf8" }}
                        onClick={() => alert("Medical Records — coming soon!")}
                    >
                        <div style={{ fontSize: "2.8rem" }}>📂</div>
                        <div>
                            <h3 style={{ color: "var(--primary-dark)", fontSize: "1rem", marginBottom: "0.3rem" }}>Medical Record</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Prescriptions & test results</p>
                        </div>
                    </Card>
                </div>

                {/* ── DETAILS Section ── */}
                <Card className="glow-bg" style={{ border: "none", padding: "2rem" }}>
                    <h2 style={{ letterSpacing: "1px", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: 700, color: "var(--primary-dark)", textTransform: "uppercase" }}>
                        Details
                    </h2>

                    {loading ? (
                        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Loading appointment details...</p>
                    ) : latest ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <div style={{ fontSize: "1rem", color: "var(--primary-dark)", lineHeight: 2 }}>
                                <div><strong>Doctor Name:</strong> {latest.doctorName || latest.doctor || "To be assigned"}</div>
                                <div><strong>Room No.:</strong> 15B</div>
                                <div><strong>Timing:</strong> {latest.timeSlot}</div>
                                <div><strong>Date:</strong> {new Date(latest.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
                            </div>
                            <div style={{ fontSize: "1rem", color: "var(--primary-dark)", lineHeight: 2 }}>
                                <div><strong>Specialty:</strong> {latest.specialtyRequested || "General Physician"}</div>
                                <div><strong>Symptoms:</strong> {latest.symptoms || "NA"}</div>
                                <div><strong>Recommended Tests:</strong> NA</div>
                                <div><strong>Suggested Medicines:</strong> NA</div>
                                <div><strong>XRAY requirement:</strong> NA</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <div style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 2 }}>
                                <div>Doctor Name: <span style={{ color: "#aaa" }}>—</span></div>
                                <div>Room No.: <span style={{ color: "#aaa" }}>—</span></div>
                                <div>Timing: <span style={{ color: "#aaa" }}>—</span></div>
                                <div>Date: <span style={{ color: "#aaa" }}>—</span></div>
                            </div>
                            <div style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 2 }}>
                                <div>Recommended Tests: <span style={{ color: "#aaa" }}>NA</span></div>
                                <div>Suggested Medicines: <span style={{ color: "#aaa" }}>NA</span></div>
                                <div>XRAY requirement: <span style={{ color: "#aaa" }}>NA</span></div>
                            </div>
                        </div>
                    )}

                    {/* All approved appointments list */}
                    {myAppointments.length > 0 && (
                        <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(0,137,123,0.2)", paddingTop: "1.5rem" }}>
                            <p className="section-label">All Approved Appointments</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                {myAppointments.map(app => (
                                    <div key={app._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.7)", padding: "0.8rem 1rem", borderRadius: "8px", borderLeft: "3px solid var(--primary-teal)" }}>
                                        <div>
                                            <strong style={{ color: "var(--primary-dark)", fontSize: "0.95rem" }}>{app.specialtyRequested}</strong>
                                            <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                                {new Date(app.date).toLocaleDateString()} | {app.timeSlot}
                                            </p>
                                        </div>
                                        <span className="badge badge-teal">Approved</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

            </div>
        </>
    );
};

export default PatientDashboard;
