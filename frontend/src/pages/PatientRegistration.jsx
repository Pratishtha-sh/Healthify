import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputStyle = {
    width: "100%", padding: "0.8rem 1rem", borderRadius: "10px",
    border: "1.5px solid #e0e0e0", outline: "none", fontSize: "0.93rem",
};

const PatientRegistration = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "", email: "", phone: "", gender: "", bloodGroup: "",
        dateOfBirth: "", address: "", password: "healthify123",
    });
    const [loading,  setLoading]  = useState(false);
    const [status,   setStatus]   = useState("");
    const [isError,  setIsError]  = useState(false);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name) { setIsError(true); setStatus("Patient name is required."); return; }
        setLoading(true); setStatus("");
        try {
            const res = await fetch("http://localhost:5000/api/users/manual-patient", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, role: "patient" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setIsError(false);
            setStatus(`✅ Patient "${data.patient?.name}" registered successfully! Default password: healthify123`);
            setForm({ name: "", email: "", phone: "", gender: "", bloodGroup: "", dateOfBirth: "", address: "", password: "healthify123" });
        } catch (err) {
            setIsError(true);
            setStatus(`❌ ${err.message}`);
        } finally { setLoading(false); }
    };

    const navLinks = [{ label: "← Back to Dashboard", path: "/admin" }];

    return (
        <>
            <Navbar links={navLinks} />
            <div className="page-content" style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: "720px" }}>
                    <button onClick={() => navigate("/admin")} style={{ background: "none", border: "none", color: "var(--primary-teal)", fontWeight: 600, cursor: "pointer", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                        ← Back to Dashboard
                    </button>

                    <h1 style={{ color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Patient Registration</h1>
                    <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Register a new patient and add them to the database.</p>

                    <Card style={{ padding: "2.5rem" }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>

                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Full Name *</label>
                                    <input type="text" placeholder="Patient's full name" value={form.name} onChange={e => set("name", e.target.value)} required style={inputStyle} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Email</label>
                                    <input type="email" placeholder="patient@email.com" value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Phone</label>
                                    <input type="tel" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={e => set("phone", e.target.value)} style={inputStyle} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Gender</label>
                                    <select value={form.gender} onChange={e => set("gender", e.target.value)} style={{ ...inputStyle, background: "white" }}>
                                        <option value="">Select…</option>
                                        {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Blood Group</label>
                                    <select value={form.bloodGroup} onChange={e => set("bloodGroup", e.target.value)} style={{ ...inputStyle, background: "white" }}>
                                        <option value="">Select…</option>
                                        {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Date of Birth</label>
                                    <input type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} style={inputStyle} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Initial Password</label>
                                    <input type="text" value={form.password} onChange={e => set("password", e.target.value)} style={inputStyle} />
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>Patient can change this after first login.</p>
                                </div>

                                <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.4rem" }}>Address</label>
                                    <textarea value={form.address} onChange={e => set("address", e.target.value)} rows={2} placeholder="House no., Street, City, State"
                                        style={{ ...inputStyle, resize: "vertical" }} />
                                </div>
                            </div>

                            {status && (
                                <div style={{ margin: "1.2rem 0", padding: "0.9rem 1.2rem", borderRadius: "8px", backgroundColor: isError ? "rgba(211,47,47,0.08)" : "rgba(0,137,123,0.08)", color: isError ? "var(--danger-red)" : "var(--primary-teal)", fontWeight: 600, fontSize: "0.9rem" }}>
                                    {status}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "0.9rem 2.5rem", fontSize: "1rem" }}>
                                    {loading ? "Registering…" : "Register Patient"}
                                </button>
                                <button type="button" onClick={() => navigate("/admin")} style={{ padding: "0.9rem 1.5rem", borderRadius: "10px", border: "1.5px solid #ddd", background: "white", cursor: "pointer", fontSize: "0.95rem" }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default PatientRegistration;
