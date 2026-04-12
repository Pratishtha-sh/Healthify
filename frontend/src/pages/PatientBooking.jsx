import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const HOURS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const SPECIALTIES = ["General Physician", "Cardiologist", "Dermatologist", "Pediatrician", "Orthopedic", "Neurologist", "ENT Specialist"];

const PatientBooking = () => {
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState("");
    const [specialty, setSpecialty] = useState("General Physician");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [isEmergency, setIsEmergency] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [statusType, setStatusType] = useState("success"); // success | error
    const [existingAppointments, setExistingAppointments] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const patientId = localStorage.getItem("userId") || "patient_guest";

    // Fetch slots whenever date changes
    useEffect(() => {
        if (!date) return;
        fetch("http://localhost:5000/api/appointments")
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) return;
                const bookedOnDate = data.filter(a => {
                    const appDate = new Date(a.date).toLocaleDateString("en-CA"); // YYYY-MM-DD
                    return appDate === date && a.status !== "cancelled";
                });
                setExistingAppointments(bookedOnDate);
            })
            .catch(err => console.error(err));
    }, [date]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!timeSlot) { setStatusText("Please select a time slot."); setStatusType("error"); return; }
        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:5000/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patient: patientId,
                    doctor: "Unassigned",
                    date: date,
                    timeSlot: timeSlot,
                    symptoms: symptoms,
                    specialtyRequested: specialty,
                    isEmergency: isEmergency,
                    status: isEmergency ? "emergency" : "pending"
                })
            });
            if (!res.ok) throw new Error("Server error");
            setStatusType("success");
            setStatusText(
                isEmergency
                    ? "🚨 Emergency appointment flagged! Receptionist will be alerted immediately."
                    : "✅ Appointment requested! Waiting for Receptionist approval."
            );
            setTimeout(() => navigate("/patient"), 2500);
        } catch (err) {
            console.error(err);
            setStatusType("error");
            setStatusText("❌ Failed to book appointment. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const navLinks = [
        { label: "Home", path: "/patient" },
        { label: "Book Appointment", path: "/patient/book" },
        { label: "Billing", path: "#" },
    ];

    const today = new Date().toISOString().split("T")[0];

    return (
        <>
            <Navbar links={navLinks} />
            <div className="page-content" style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: "860px" }}>

                    {/* Page header */}
                    <div style={{ marginBottom: "2rem" }}>
                        <h1 style={{ fontSize: "2.2rem", color: "var(--primary-dark)" }}>Book an Appointment</h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>
                            Select your symptoms, specialty, and preferred time slot below.
                        </p>
                    </div>

                    <Card style={{ padding: "2.5rem" }}>
                        <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                            {/* Symptoms */}
                            <div>
                                <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.5rem" }}>
                                    Describe Your Symptoms *
                                </label>
                                <textarea
                                    value={symptoms}
                                    onChange={e => setSymptoms(e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="e.g. Persistent headache and fever since 2 days..."
                                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "8px", border: "1.5px solid #ddd", outline: "none", resize: "vertical", fontSize: "0.95rem", transition: "border-color 0.2s" }}
                                    onFocus={e => e.target.style.borderColor = "var(--primary-teal)"}
                                    onBlur={e => e.target.style.borderColor = "#ddd"}
                                />
                            </div>

                            {/* Specialty */}
                            <div>
                                <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.5rem" }}>
                                    Doctor Specialty *
                                </label>
                                <select
                                    value={specialty}
                                    onChange={e => setSpecialty(e.target.value)}
                                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "8px", border: "1.5px solid #ddd", outline: "none", fontSize: "0.95rem", backgroundColor: "white" }}
                                >
                                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.5rem" }}>
                                    Select Date *
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    min={today}
                                    onChange={e => { setDate(e.target.value); setTimeSlot(""); }}
                                    required
                                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "8px", border: "1.5px solid #ddd", outline: "none", fontSize: "0.95rem" }}
                                />
                            </div>

                            {/* Time Slot Visualizer */}
                            {date && (
                                <div>
                                    <label style={{ display: "block", fontWeight: 600, color: "var(--primary-dark)", marginBottom: "0.75rem" }}>
                                        Select Time Slot *
                                    </label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "0.5rem" }}>
                                        {HOURS.map(h => {
                                            const isOccupied = existingAppointments.some(a => a.timeSlot === h);
                                            const isSelected = timeSlot === h;
                                            let cls = "slot-btn ";
                                            if (isOccupied) cls += "slot-booked";
                                            else if (isSelected) cls += "slot-selected";
                                            else cls += "slot-free";

                                            return (
                                                <button
                                                    type="button"
                                                    key={h}
                                                    disabled={isOccupied}
                                                    onClick={() => setTimeSlot(h)}
                                                    className={cls}
                                                >
                                                    {h} {isOccupied ? "🔴" : isSelected ? "✓" : "🟢"}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                        🟢 Available &nbsp; 🔴 Booked
                                    </p>
                                </div>
                            )}

                            {/* Emergency Toggle */}
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.2rem", borderRadius: "10px", backgroundColor: isEmergency ? "rgba(211,47,47,0.08)" : "rgba(0,137,123,0.06)", border: `1.5px solid ${isEmergency ? "var(--danger-red)" : "#ddd"}`, transition: "all 0.2s" }}>
                                <input
                                    type="checkbox"
                                    id="emergency-toggle"
                                    checked={isEmergency}
                                    onChange={e => setIsEmergency(e.target.checked)}
                                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--danger-red)" }}
                                />
                                <label htmlFor="emergency-toggle" style={{ fontWeight: 600, color: isEmergency ? "var(--danger-red)" : "var(--primary-dark)", cursor: "pointer", fontSize: "0.95rem" }}>
                                    🚨 Mark as Emergency — I need immediate attention
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!date || !timeSlot || !symptoms || submitting}
                                className={isEmergency ? "btn-danger" : "btn-primary"}
                                style={{ padding: "1rem", fontSize: "1.05rem", opacity: (!date || !timeSlot || !symptoms) ? 0.55 : 1 }}
                            >
                                {submitting ? "Sending..." : isEmergency ? "🚨 Request Emergency Appointment" : "📅 Request Appointment"}
                            </button>

                            {statusText && (
                                <div style={{
                                    textAlign: "center", padding: "0.9rem", borderRadius: "8px",
                                    backgroundColor: statusType === "success" ? "rgba(0,137,123,0.1)" : "rgba(211,47,47,0.1)",
                                    color: statusType === "success" ? "var(--primary-teal)" : "var(--danger-red)",
                                    fontWeight: 600, fontSize: "0.95rem"
                                }}>
                                    {statusText}
                                </div>
                            )}

                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default PatientBooking;
