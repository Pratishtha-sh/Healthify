import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const HOURS = ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"];
const today = new Date().toISOString().split("T")[0];

const ScheduleAppointment = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState(""); // "" | "web" | "manual"

    // Web confirmations state
    const [pendingApps, setPendingApps] = useState([]);
    const [doctors,     setDoctors]     = useState([]);
    const [approving,   setApproving]   = useState(null);
    const [pickerApp,   setPickerApp]   = useState(null);
    const [selDocId,    setSelDocId]    = useState("");
    const [toast,       setToast]       = useState("");

    // Manual schedule form
    const [form, setForm] = useState({ patientId: "", patientName: "", doctorId: "", date: today, timeSlot: "", symptoms: "", specialtyRequested: "", isEmergency: false });
    const [patients,  setPatients]  = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState("");

    const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

    // Filtered doctor options for manual form
    const doctorsForSpecialty = doctors.filter(d => !form.specialtyRequested || d.specialty === form.specialtyRequested);

    useEffect(() => {
        // Fetch pending appointments
        fetch("http://localhost:5000/api/appointments")
            .then(r => r.json())
            .then(d => Array.isArray(d) && setPendingApps(d.filter(a => a.status === "pending")))
            .catch(console.error);

        // Fetch real doctors from DB
        fetch("http://localhost:5000/api/users/role/doctor")
            .then(r => r.json())
            .then(d => Array.isArray(d) && setDoctors(d))
            .catch(console.error);

        // Fetch patients
        fetch("http://localhost:5000/api/users/role/patient")
            .then(r => r.json())
            .then(d => Array.isArray(d) && setPatients(d))
            .catch(console.error);
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

    // Open doctor picker for web confirmation
    const openPicker = (app) => {
        const filtered = doctors.filter(d => d.specialty === app.specialtyRequested || !app.specialtyRequested);
        setPickerApp({ ...app, _doctors: filtered });
        setSelDocId(filtered[0]?._id || "");
    };

    const confirmWeb = async () => {
        if (!pickerApp || !selDocId) return;
        const doc = pickerApp._doctors.find(d => d._id === selDocId);
        setApproving(pickerApp._id);
        try {
            await fetch(`http://localhost:5000/api/appointments/${pickerApp._id}/assign-doctor`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "scheduled", doctor: doc._id, doctorName: doc.name }),
            });
            showToast(`✅ Assigned to ${doc.name}`);
            setPendingApps(prev => prev.filter(a => a._id !== pickerApp._id));
            setPickerApp(null);
        } catch (err) { console.error(err); }
        finally { setApproving(null); }
    };

    const submitManual = async (e) => {
        e.preventDefault();
        if (!form.timeSlot) { setFormStatus("Please select a time slot."); return; }
        const doc = doctors.find(d => d._id === form.doctorId);
        setSubmitting(true);
        try {
            await fetch("http://localhost:5000/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patient:            form.patientId || form.patientName,
                    doctor:             doc?._id || "",
                    doctorName:         doc?.name || "",
                    date:               form.date,
                    timeSlot:           form.timeSlot,
                    symptoms:           form.symptoms,
                    specialtyRequested: form.specialtyRequested || doc?.specialty || "",
                    isEmergency:        form.isEmergency,
                    status:             form.isEmergency ? "emergency" : "scheduled",
                }),
            });
            setFormStatus(`✅ Appointment scheduled for ${form.patientName || form.patientId} with ${doc?.name || "doctor"}`);
            setForm({ patientId: "", patientName: "", doctorId: "", date: today, timeSlot: "", symptoms: "", specialtyRequested: "", isEmergency: false });
        } catch (err) {
            setFormStatus(`❌ Failed: ${err.message}`);
        } finally { setSubmitting(false); }
    };

    return (
        <>
            <Navbar links={[{ label: "← Dashboard", path: "/admin" }]} />

            {toast && (
                <div style={{ position: "fixed", top: "80px", right: "2rem", zIndex: 999, background: "var(--primary-teal)", color: "white", padding: "1rem 1.8rem", borderRadius: "10px", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                    {toast}
                </div>
            )}

            {/* Doctor picker modal */}
            {pickerApp && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "white", borderRadius: "16px", padding: "2.5rem", width: "480px", maxWidth: "95vw" }}>
                        <h2 style={{ color: "var(--primary-dark)", marginBottom: "1rem" }}>Assign Doctor</h2>
                        <div style={{ background: "var(--glass-glow)", borderRadius: "10px", padding: "1rem", marginBottom: "1.2rem", fontSize: "0.9rem", color: "var(--primary-dark)" }}>
                            <strong>Patient:</strong> {pickerApp.patient}<br />
                            <strong>Specialty:</strong> {pickerApp.specialtyRequested} &nbsp;|&nbsp; {pickerApp.timeSlot} &nbsp;|&nbsp; {pickerApp.date ? new Date(pickerApp.date).toLocaleDateString() : ""}
                        </div>
                        {pickerApp._doctors.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No {pickerApp.specialtyRequested} doctors registered yet.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
                                {pickerApp._doctors.map(doc => (
                                    <label key={doc._id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer", border: `2px solid ${selDocId === doc._id ? "var(--primary-teal)" : "#e0e0e0"}`, background: selDocId === doc._id ? "var(--glass-glow)" : "white" }}>
                                        <input type="radio" name="doc-picker" value={doc._id} checked={selDocId === doc._id} onChange={() => setSelDocId(doc._id)} style={{ accentColor: "var(--primary-teal)" }} />
                                        <div>
                                            <div style={{ fontWeight: 600, color: "var(--primary-dark)" }}>{doc.name}</div>
                                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{doc.qualification} · {doc.specialty}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button className="btn-primary" onClick={confirmWeb} disabled={!selDocId || approving} style={{ flex: 1, padding: "0.85rem" }}>
                                {approving ? "Confirming…" : "✓ Confirm"}
                            </button>
                            <button onClick={() => setPickerApp(null)} style={{ padding: "0.85rem 1.2rem", borderRadius: "10px", border: "1.5px solid #ddd", background: "white", cursor: "pointer" }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-content">
                <button onClick={() => navigate("/admin")} style={{ background: "none", border: "none", color: "var(--primary-teal)", fontWeight: 600, cursor: "pointer", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                    ← Back to Dashboard
                </button>
                <h1 style={{ color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Schedule Appointment</h1>
                <p style={{ color: "var(--text-muted)", marginBottom: "2.5rem" }}>Review web bookings or manually schedule an appointment.</p>

                {/* Mode selection if not chosen */}
                {!mode && (
                    <div className="grid-3" style={{ maxWidth: "700px" }}>
                        <Card className="hover-lift" style={{ padding: "2.5rem", textAlign: "center", cursor: "pointer", border: "2px solid transparent" }} onClick={() => setMode("web")}>
                            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🌐</div>
                            <h3 style={{ color: "var(--primary-dark)", marginBottom: "0.5rem" }}>Confirm Web Appointments</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Review and approve appointments submitted by patients online</p>
                            <span className="badge badge-yellow" style={{ marginTop: "1rem", display: "inline-block" }}>{pendingApps.length} pending</span>
                        </Card>

                        <Card className="hover-lift" style={{ padding: "2.5rem", textAlign: "center", cursor: "pointer", border: "2px solid transparent" }} onClick={() => setMode("manual")}>
                            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📝</div>
                            <h3 style={{ color: "var(--primary-dark)", marginBottom: "0.5rem" }}>Schedule Manually</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Schedule for a walk-in patient present at the hospital</p>
                        </Card>
                    </div>
                )}

                {/* Web Confirmations */}
                {mode === "web" && (
                    <>
                        <button onClick={() => setMode("")} style={{ background: "none", border: "none", color: "var(--primary-teal)", cursor: "pointer", fontWeight: 600, marginBottom: "1.5rem" }}>← Back to options</button>
                        <h2 style={{ color: "var(--primary-dark)", marginBottom: "1.5rem" }}>Pending Web Appointments ({pendingApps.length})</h2>
                        {pendingApps.length === 0 ? (
                            <Card style={{ textAlign: "center", padding: "3rem" }}>
                                <div style={{ fontSize: "3rem" }}>🎉</div>
                                <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>All web appointments have been confirmed!</p>
                            </Card>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {pendingApps.map(app => (
                                    <Card key={app._id} style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                                        <div>
                                            <strong style={{ color: "var(--primary-dark)" }}>{app.patient}</strong>
                                            <p style={{ margin: "3px 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                                                {app.specialtyRequested} &nbsp;|&nbsp; {app.date ? new Date(app.date).toLocaleDateString() : ""} &nbsp;|&nbsp; {app.timeSlot}
                                            </p>
                                            {app.symptoms && <p style={{ margin: "3px 0 0", fontSize: "0.82rem", color: "#666", fontStyle: "italic" }}>"{app.symptoms}"</p>}
                                        </div>
                                        <button className="btn-primary" onClick={() => openPicker(app)} style={{ padding: "0.6rem 1.5rem" }}>
                                            👤 Assign Doctor
                                        </button>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Manual Schedule */}
                {mode === "manual" && (
                    <>
                        <button onClick={() => setMode("")} style={{ background: "none", border: "none", color: "var(--primary-teal)", cursor: "pointer", fontWeight: 600, marginBottom: "1.5rem" }}>← Back to options</button>
                        <Card style={{ padding: "2.5rem", maxWidth: "760px" }}>
                            <h2 style={{ color: "var(--primary-dark)", marginBottom: "1.5rem" }}>Manual Appointment Form</h2>
                            <form onSubmit={submitManual} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

                                {/* Patient */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Patient (from DB)</label>
                                        <select value={form.patientId} onChange={e => { const p = patients.find(p => p._id === e.target.value); setF("patientId", e.target.value); setF("patientName", p?.name || ""); }}
                                            style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", fontSize: "0.93rem", background: "white" }}>
                                            <option value="">Select registered patient…</option>
                                            {patients.map(p => <option key={p._id} value={p._id}>{p.name} — {p.email || p.phone}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Or enter name (walk-in)</label>
                                        <input type="text" placeholder="Walk-in patient name" value={form.patientName} onChange={e => setF("patientName", e.target.value)}
                                            style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", fontSize: "0.93rem" }} />
                                    </div>
                                </div>

                                {/* Specialty + Doctor */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Specialty Required</label>
                                        <select value={form.specialtyRequested} onChange={e => { setF("specialtyRequested", e.target.value); setF("doctorId", ""); }}
                                            style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", background: "white", fontSize: "0.93rem" }}>
                                            <option value="">Any Specialty</option>
                                            {[...new Set(doctors.map(d => d.specialty))].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Select Doctor *</label>
                                        <select value={form.doctorId} onChange={e => setF("doctorId", e.target.value)} required
                                            style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", background: "white", fontSize: "0.93rem" }}>
                                            <option value="">Choose doctor…</option>
                                            {doctorsForSpecialty.map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Date + Slots */}
                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Date *</label>
                                    <input type="date" value={form.date} min={today} onChange={e => setF("date", e.target.value)} required
                                        style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", fontSize: "0.93rem" }} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.55rem" }}>Time Slot *</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                        {HOURS.map(h => (
                                            <button type="button" key={h} onClick={() => setF("timeSlot", h)}
                                                className={`slot-btn ${form.timeSlot === h ? "slot-selected" : "slot-free"}`}>
                                                {h}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Symptoms / Reason</label>
                                    <textarea value={form.symptoms} onChange={e => setF("symptoms", e.target.value)} rows={2}
                                        placeholder="Brief description of symptoms…"
                                        style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e0e0e0", outline: "none", resize: "vertical", fontSize: "0.93rem" }} />
                                </div>

                                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.8rem 1rem", borderRadius: "10px", background: form.isEmergency ? "rgba(211,47,47,0.07)" : "#f9fafb", border: `1.5px solid ${form.isEmergency ? "var(--danger-red)" : "#e0e0e0"}` }}>
                                    <input type="checkbox" checked={form.isEmergency} onChange={e => setF("isEmergency", e.target.checked)} style={{ width: "17px", height: "17px", accentColor: "var(--danger-red)" }} />
                                    <span style={{ fontWeight: 600, color: form.isEmergency ? "var(--danger-red)" : "var(--primary-dark)" }}>🚨 Mark as Emergency</span>
                                </label>

                                {formStatus && (
                                    <div style={{ padding: "0.9rem 1.2rem", borderRadius: "8px", backgroundColor: formStatus.includes("✅") ? "rgba(0,137,123,0.08)" : "rgba(211,47,47,0.08)", color: formStatus.includes("✅") ? "var(--primary-teal)" : "var(--danger-red)", fontWeight: 600, fontSize: "0.9rem" }}>
                                        {formStatus}
                                    </div>
                                )}

                                <button type="submit" className={form.isEmergency ? "btn-danger" : "btn-primary"} disabled={submitting} style={{ padding: "1rem", fontSize: "1rem" }}>
                                    {submitting ? "Scheduling…" : "Schedule Appointment"}
                                </button>
                            </form>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
};

export default ScheduleAppointment;
