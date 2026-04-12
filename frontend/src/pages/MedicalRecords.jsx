import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const MedicalRecords = () => {
    const navigate   = useNavigate();
    const patientId  = localStorage.getItem("userId")   || "patient_guest";
    const patientName = localStorage.getItem("userName") || "Patient";

    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading]             = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/prescriptions/patient/${patientId}`)
            .then(r => r.json())
            .then(d => { if (Array.isArray(d)) setPrescriptions(d); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [patientId]);

    const navLinks = [
        { label: "Home",          path: "/patient" },
        { label: "Appointment",   path: "/patient/book" },
        { label: "Billing",       path: "#" },
    ];

    const statusColor = (s) => {
        if (s === "confirmed") return "#4caf50";
        if (s === "fulfilled") return "var(--primary-teal)";
        return "#f59e0b";
    };
    const statusLabel = (s) => {
        if (s === "confirmed") return "💊 Ready for Pickup";
        if (s === "fulfilled") return "✅ Fulfilled";
        return "⏳ Processing";
    };

    return (
        <>
            <Navbar links={navLinks} />
            <div className="page-content">

                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <button onClick={() => navigate("/patient")} style={{ background: "none", border: "none", color: "var(--primary-teal)", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        ← Back to Dashboard
                    </button>
                    <h1 style={{ fontSize: "2.2rem", color: "var(--primary-dark)" }}>📂 Medical Records</h1>
                    <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Your complete prescription history, {patientName}.</p>
                </div>

                {/* Pharmacy info banner */}
                <div style={{ background: "linear-gradient(90deg, rgba(0,77,64,0.08), rgba(0,137,123,0.06))", border: "1px solid rgba(0,137,123,0.2)", borderRadius: "12px", padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "1.8rem" }}>🏥</span>
                    <div>
                        <div style={{ fontWeight: 600, color: "var(--primary-dark)" }}>Hospital Pharmacy</div>
                        <div style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>Ground Floor, Opposite Hospital Reception &nbsp;|&nbsp; Timings: 8 AM – 8 PM</div>
                    </div>
                </div>

                {loading ? (
                    <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Loading records…</p>
                ) : prescriptions.length === 0 ? (
                    <Card style={{ textAlign: "center", padding: "4rem 2rem" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📋</div>
                        <h2 style={{ color: "var(--text-muted)", fontWeight: 400 }}>No medical records yet</h2>
                        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Records will appear here after your doctor submits a prescription.</p>
                    </Card>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {prescriptions.map((p, idx) => (
                            <Card key={p._id} style={{ padding: "1.8rem" }}>
                                {/* Card header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
                                    <div>
                                        <h3 style={{ color: "var(--primary-dark)", margin: "0 0 4px 0" }}>
                                            Prescription #{prescriptions.length - idx}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-muted)" }}>
                                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Date unknown"}
                                        </p>
                                    </div>
                                    <span style={{ backgroundColor: `${statusColor(p.status)}20`, color: statusColor(p.status), padding: "0.35rem 1rem", borderRadius: "20px", fontWeight: 600, fontSize: "0.85rem", border: `1px solid ${statusColor(p.status)}40` }}>
                                        {statusLabel(p.status)}
                                    </span>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                    {/* Doctor info */}
                                    <div>
                                        <p className="section-label">Prescribed By</p>
                                        <p style={{ color: "var(--primary-dark)", fontWeight: 600, fontSize: "1rem" }}>
                                            {p.doctorName || p.doctorId}
                                        </p>
                                    </div>

                                    {/* Tips */}
                                    {p.tips && (
                                        <div>
                                            <p className="section-label">Doctor's Notes</p>
                                            <p style={{ color: "var(--text-main)", fontSize: "0.9rem", fontStyle: "italic" }}>"{p.tips}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Medicines table */}
                                {p.medications?.length > 0 && (
                                    <div style={{ marginTop: "1.2rem" }}>
                                        <p className="section-label">Prescribed Medicines</p>
                                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0,137,123,0.15)" }}>
                                            {/* Header */}
                                            {["Medicine", "Dosage", "Quantity"].map(h => (
                                                <div key={h} style={{ backgroundColor: "var(--glass-glow)", padding: "0.6rem 0.9rem", fontWeight: 700, fontSize: "0.8rem", color: "var(--primary-dark)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
                                            ))}
                                            {/* Rows */}
                                            {p.medications.map((med, i) => (
                                                [
                                                    <div key={`n${i}`} style={{ padding: "0.7rem 0.9rem", fontSize: "0.92rem", borderTop: "1px solid rgba(0,137,123,0.1)", color: "var(--text-main)", backgroundColor: i % 2 === 0 ? "white" : "#fafffe" }}>{med.name}</div>,
                                                    <div key={`d${i}`} style={{ padding: "0.7rem 0.9rem", fontSize: "0.92rem", borderTop: "1px solid rgba(0,137,123,0.1)", color: "var(--text-muted)", backgroundColor: i % 2 === 0 ? "white" : "#fafffe" }}>{med.dosage}</div>,
                                                    <div key={`q${i}`} style={{ padding: "0.7rem 0.9rem", fontSize: "0.92rem", borderTop: "1px solid rgba(0,137,123,0.1)", color: "var(--text-muted)", backgroundColor: i % 2 === 0 ? "white" : "#fafffe" }}>{med.quantity}</div>,
                                                ]
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pickup notice */}
                                {p.pharmacyConfirmed && (
                                    <div style={{ marginTop: "1.2rem", padding: "0.9rem 1.2rem", borderRadius: "8px", background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.3)", color: "#2e7d32", fontWeight: 600, fontSize: "0.9rem" }}>
                                        💊 Your medicines are ready! &nbsp;·&nbsp; 📍 Ground Floor, Opposite Hospital Reception
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MedicalRecords;
