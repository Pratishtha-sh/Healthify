import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";

const CalendarWidget = () => {
    // A simple static calendar UI to match the mocks
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const dates = [
        [null, null, null, null, null, null, null],
        [null, 1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12, 13],
        [14, 15, 16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25, 26, 27],
        [28, 29, 30, "1", "2", "3", "4"],
    ];

    return (
        <Card
            style={{
                backgroundColor: "#dcedc8", // Light green background from the mock
                padding: "1.5rem",
                border: "none",
                width: "100%",
                maxWidth: "350px"
            }}
        >
            <div className="flex-between" style={{ marginBottom: "1rem" }}>
                <ChevronLeft size={18} style={{ cursor: "pointer" }} />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <select style={{ padding: "0.2rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                        <option>Sep</option>
                    </select>
                    <select style={{ padding: "0.2rem", borderRadius: "4px", border: "1px solid #ccc" }}>
                        <option>2025</option>
                    </select>
                </div>
                <ChevronRight size={18} style={{ cursor: "pointer" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", textAlign: "center", fontSize: "0.8rem", color: "#555" }}>
                {days.map((day) => (
                    <div key={day}>{day}</div>
                ))}
                {dates.flat().map((date, idx) => {
                    if (date === null) return <div key={idx}></div>;
                    const isSelected = date === 9 || date === 13;
                    const isNextMonth = typeof date === "string";

                    return (
                        <div
                            key={idx}
                            style={{
                                padding: "0.4rem 0",
                                backgroundColor: isSelected ? "#333" : "transparent",
                                color: isSelected ? "white" : isNextMonth ? "#aaa" : "inherit",
                                borderRadius: isSelected ? "4px" : "0",
                                cursor: "pointer",
                                fontWeight: isSelected ? "bold" : "normal",
                            }}
                        >
                            {date}
                        </div>
                    );
                })}
            </div>
            <div style={{ textAlign: "center", marginTop: "1rem", color: "#00897b", fontWeight: "bold", fontStyle: "italic", fontSize: "0.9rem" }}>
                Upcoming Appointments
            </div>
        </Card>
    );
};

export default CalendarWidget;
