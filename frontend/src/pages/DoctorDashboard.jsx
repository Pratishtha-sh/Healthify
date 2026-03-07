import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CalendarWidget from "../components/CalendarWidget";
import Card from "../components/Card";
import NotificationBanner from "../components/NotificationBanner";

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Replace with real doctor ID when Auth is implemented
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
                    { label: "Schedule", path: "/schedule" },
                ]}
            />
            <div className="page-content">

                {/* Header Section */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem", marginBottom: "2rem" }}>
                    <div className="glow-bg" style={{ flex: 1, padding: "3rem 2rem", borderRadius: "12px" }}>
                        <h1 style={{ fontSize: "3.5rem", color: "var(--primary-dark)", marginBottom: "0.5rem", lineHeight: 1.1 }}>
                            Dr. Sachdev Kumar
                        </h1>
                        <p style={{ fontSize: "1.5rem", color: "var(--primary-teal)", lineHeight: 1.3 }}>
                            MD of General Medicine<br />
                            (MBBS AIIMS Delhi)
                        </p>
                    </div>

                    <div style={{ width: "350px" }}>
                        <CalendarWidget />
                    </div>
                </div>

                {/* Highlight Stats */}
                <div className="grid-3" style={{ marginBottom: "2rem" }}>
                    <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "3rem 1rem", border: "none" }}>
                        <h2 style={{ fontSize: "4rem", color: "#002b5e", marginBottom: "0.5rem", lineHeight: 1 }}>500+</h2>
                        <p style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>Patients treated</p>
                    </Card>

                    <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "3rem 1rem", border: "none" }}>
                        <h2 style={{ fontSize: "4rem", color: "#002b5e", marginBottom: "0.5rem", lineHeight: 1 }}>150+</h2>
                        <p style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>Successful Operations</p>
                    </Card>

                    <Card className="flex-center glow-bg" style={{ flexDirection: "column", padding: "3rem 1rem", border: "none" }}>
                        <h2 style={{ fontSize: "4rem", color: "#002b5e", marginBottom: "0.5rem", lineHeight: 1 }}>1.5K+</h2>
                        <p style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>Hours worked</p>
                    </Card>
                </div>

                {/* Notifications */}
                <Card className="glow-bg" style={{ border: "none" }}>
                    <h3 style={{ color: "var(--primary-teal)", fontWeight: "bold", marginBottom: "1rem" }}>
                        NOTIFICATION CENTRE
                    </h3>
                    <NotificationBanner
                        type="urgent"
                        message="Urgent requirement at Room no. 23A Bed no. 9, Patient name- Rohan sharma"
                    />
                    <NotificationBanner
                        type="normal"
                        message="Surgery in room no -12 floor -1 in next 30 minutes, Patient name- Mohan Kumar"
                    />
                </Card>

            </div>
        </>
    );
};

export default DoctorDashboard;
