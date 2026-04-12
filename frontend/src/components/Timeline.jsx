const HOURS = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const Timeline = ({ appointments = [] }) => {
    return (
        <div style={{
            background: "linear-gradient(135deg, rgba(232,245,233,0.9) 0%, rgba(224,242,241,0.6) 100%)",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid rgba(0,137,123,0.15)",
            backdropFilter: "blur(10px)"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ color: "var(--primary-dark)" }}>📅 Today's Schedule</h2>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.82rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "var(--primary-teal)", display: "inline-block" }}></span>
                        Booked
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid #ccc", display: "inline-block" }}></span>
                        Available
                    </span>
                </div>
            </div>

            {/* Timeline */}
            <div style={{ position: "relative", paddingLeft: "50px" }}>
                {/* Vertical Line */}
                <div style={{
                    position: "absolute", top: 0, bottom: 0, left: "20px",
                    width: "3px",
                    background: "linear-gradient(to bottom, var(--primary-teal), rgba(0,137,123,0.2))",
                    borderRadius: "2px"
                }} />

                {HOURS.map((hour, index) => {
                    const app = appointments.find(a => a.timeSlot === hour);
                    const isLast = index === HOURS.length - 1;

                    return (
                        <div key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: isLast ? 0 : "1rem", position: "relative" }}>
                            {/* Circle marker */}
                            <div style={{
                                position: "absolute", left: "-40px", top: "14px",
                                width: "16px", height: "16px", borderRadius: "50%",
                                backgroundColor: app ? "var(--primary-teal)" : "white",
                                border: "3px solid var(--primary-teal)",
                                boxShadow: app ? "0 0 0 3px rgba(0,137,123,0.2)" : "none",
                                zIndex: 1,
                                transition: "all 0.2s"
                            }} />

                            {/* Hour label */}
                            <div style={{
                                width: "88px", color: "var(--text-muted)",
                                fontWeight: 600, fontSize: "0.82rem",
                                paddingTop: "12px", flexShrink: 0
                            }}>
                                {hour}
                            </div>

                            {/* Content block */}
                            <div style={{
                                flex: 1,
                                marginLeft: "0.75rem",
                                padding: "0.85rem 1.1rem",
                                borderRadius: "10px",
                                backgroundColor: app ? "var(--primary-teal)" : "rgba(255,255,255,0.65)",
                                color: app ? "white" : "var(--text-main)",
                                boxShadow: app ? "0 4px 16px rgba(0,137,123,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
                                transition: "all 0.2s",
                                borderLeft: app ? "none" : "3px solid #e0e0e0"
                            }}>
                                {app ? (
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h4 style={{ margin: 0, color: "white", fontSize: "0.95rem" }}>
                                                Patient: {app.patient}
                                            </h4>
                                            <span style={{
                                                fontSize: "0.75rem", fontWeight: 600,
                                                backgroundColor: "rgba(255,255,255,0.25)",
                                                padding: "0.2rem 0.6rem", borderRadius: "20px"
                                            }}>
                                                Scheduled
                                            </span>
                                        </div>
                                        <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,0.85)" }}>
                                            🏥 {app.specialtyRequested || "General Checkup"}
                                        </p>
                                        {app.symptoms && (
                                            <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.75)" }}>
                                                Symptoms: {app.symptoms.substring(0, 60)}{app.symptoms.length > 60 ? "…" : ""}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p style={{ margin: 0, color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.88rem" }}>
                                        Available
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary footer */}
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(0,137,123,0.15)", display: "flex", gap: "2rem" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--primary-teal)" }}>
                        {appointments.length}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Appointments</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--accent-green)" }}>
                        {HOURS.length - appointments.length}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Free Slots</div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
