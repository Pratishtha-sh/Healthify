import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CalendarWidget from "../components/CalendarWidget";

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [myAppointments, setMyAppointments]   = useState([]);
    const [myPrescriptions, setMyPrescriptions] = useState([]);
    const [loading, setLoading]                 = useState(true);

    const patientId   = localStorage.getItem("userId")   || "patient_guest";
    const patientName = localStorage.getItem("userName") || "Patient";

    // Fetch appointments + prescriptions
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [apptRes, presRes] = await Promise.all([
                    fetch("http://localhost:5000/api/appointments"),
                    fetch(`http://localhost:5000/api/prescriptions/patient/${patientId}`)
                ]);
                const apptData = await apptRes.json();
                const presData = await presRes.json();

                if (Array.isArray(apptData)) {
                    setMyAppointments(apptData.filter(a => a.patient === patientId && a.status === "scheduled"));
                }
                if (Array.isArray(presData)) setMyPrescriptions(presData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [patientId]);

    // Pharmacy-ready notifications (confirmed but patient not yet notified)
    const pharmacyReady = myPrescriptions.filter(p => p.pharmacyConfirmed && !p.patientNotified);

    const dismissNotification = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/prescriptions/${id}/patient-notified`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }
            });
            setMyPrescriptions(prev => prev.map(p => p._id === id ? { ...p, patientNotified: true } : p));
        } catch (err) { console.error(err); }
    };

    const latest = myAppointments[0] || null;

    const navLinks = [
        { label: "Home",        path: "/patient" },
        { label: "Appointment", path: "/patient/book" },
        { label: "Billing",     path: "#" },
    ];

    return (
        <>
            <Navbar links={navLinks} />

            {/* ── Pharmacy-ready notification banner ── */}
            {pharmacyReady.map(p => (
                <div key={p._id} style={{
                    background: "linear-gradient(90deg, #004d40, #00897b)",
                    color: "white", padding: "1rem 2rem",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}>
                    <div>
                        <strong>💊 Your medicines are ready for pickup!</strong>
                        <p style={{ margin: "4px 0 0", fontSize: "0.9rem", opacity: 0.9 }}>
                            📍 Hospital Pharmacy — Ground Floor, Opposite Hospital Reception
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "0.82rem", opacity: 0.8 }}>
                            Prescribed by: {p.doctorName || p.doctorId} &nbsp;|&nbsp; {p.medications?.map(m => m.name).join(", ")}
                        </p>
                    </div>
                    <button onClick={() => dismissNotification(p._id)} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "white", padding: "0.5rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
                        Got it ✓
                    </button>
                </div>
            ))}

            <div className="page-content">

                {/* ── Hero Row ── */}
                <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", alignItems: "stretch" }}>
                    <div className="glow-bg" style={{ flex: 1, padding: "2.5rem 2rem", borderRadius: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h1 style={{ fontSize: "3rem", color: "var(--primary-dark)", marginBottom: "0.5rem", lineHeight: 1.1 }}>
                            Hello, {patientName} 👋
                        </h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                            Get your appointments booked and billing done within a few clicks!
                        </p>
                        <button className="btn-primary" onClick={() => navigate("/patient/book")}
                            style={{ padding: "0.9rem 2rem", fontSize: "1rem", width: "fit-content" }}>
                            📅 Book Appointment
                        </button>
                    </div>
                    <div style={{ width: "340px", flexShrink: 0 }}>
                        <CalendarWidget />
                    </div>
                </div>

                {/* ── Action Cards ── */}
                <div className="grid-3" style={{ marginBottom: "2rem" }}>
                    <Card className="hover-lift" style={{ cursor: "pointer", border: "1px solid rgba(0,137,123,0.2)", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.2rem", backgroundColor: "#f0fdf8" }}>
                        <div style={{ fontSize: "2.8rem" }}>📋</div>
                        <div>
                            <h3 style={{ color: "var(--primary-dark)", fontSize: "1rem", marginBottom: "0.3rem" }}>Check Appointment Status</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                {loading ? "Loading…" : `${myAppointments.length} active appointment(s)`}
                            </p>
                        </div>
                    </Card>

                    <Card className="hover-lift" onClick={() => alert("Billing portal — coming soon!")} style={{ cursor: "pointer", border: "1px solid rgba(0,137,123,0.2)", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.2rem", backgroundColor: "#f0fdf8" }}>
                        <div style={{ fontSize: "2.8rem" }}>💳</div>
                        <div>
                            <h3 style={{ color: "var(--primary-dark)", fontSize: "1rem", marginBottom: "0.3rem" }}>Complete Billing</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>View and pay your medical bills</p>
                        </div>
                    </Card>

                    <Card className="hover-lift" onClick={() => navigate("/patient/records")} style={{ cursor: "pointer", border: "1px solid rgba(0,137,123,0.2)", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.2rem", backgroundColor: "#f0fdf8" }}>
                        <div style={{ fontSize: "2.8rem" }}>📂</div>
                        <div>
                            <h3 style={{ color: "var(--primary-dark)", fontSize: "1rem", marginBottom: "0.3rem" }}>Medical Record</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                {myPrescriptions.length > 0 ? `${myPrescriptions.length} record(s)` : "Prescriptions & test results"}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* ── DETAILS Section ── */}
                <Card className="glow-bg" style={{ border: "none", padding: "2rem" }}>
                    <h2 style={{ letterSpacing: "1px", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: 700, color: "var(--primary-dark)", textTransform: "uppercase" }}>
                        Details
                    </h2>

                    {loading ? (
                        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Loading appointment details…</p>
                    ) : latest ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <div style={{ fontSize: "1rem", color: "var(--primary-dark)", lineHeight: 2.2 }}>
                                <div><strong>Doctor Name:</strong> {latest.doctorName || latest.doctor || "To be assigned"}</div>
                                <div><strong>Room No.:</strong> 15B</div>
                                <div><strong>Timing:</strong> {latest.timeSlot}</div>
                                <div><strong>Date:</strong> {new Date(latest.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
                                <div><strong>Specialty:</strong> {latest.specialtyRequested}</div>
                            </div>
                            <div style={{ fontSize: "1rem", color: "var(--primary-dark)", lineHeight: 2.2 }}>
                                <div><strong>Symptoms:</strong> {latest.symptoms || "NA"}</div>
                                <div><strong>Recommended Tests:</strong> NA</div>
                                <div><strong>Suggested Medicines:</strong> NA</div>
                                <div><strong>XRAY requirement:</strong> NA</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <div style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 2.2 }}>
                                {["Doctor Name", "Room No.", "Timing", "Date"].map(l => (
                                    <div key={l}>{l}: <span style={{ color: "#bbb" }}>—</span></div>
                                ))}
                            </div>
                            <div style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 2.2 }}>
                                {["Recommended Tests", "Suggested Medicines", "XRAY requirement"].map(l => (
                                    <div key={l}>{l}: <span style={{ color: "#bbb" }}>NA</span></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All approved appointments */}
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
                                                {app.doctorName && ` | ${app.doctorName}`}
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
