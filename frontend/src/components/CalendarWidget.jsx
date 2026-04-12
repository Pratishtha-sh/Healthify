import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CalendarWidget = ({ onDateSelect }) => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
    const [selectedDate, setSelectedDate] = useState(today.getDate());

    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const handleDateClick = (day) => {
        setSelectedDate(day);
        if (onDateSelect) {
            const d = new Date(viewYear, viewMonth, day);
            onDateSelect(d);
        }
    };

    // Build grid cells
    const cells = [];
    // Leading empty / prev-month days
    for (let i = 0; i < firstDay; i++) {
        cells.push({ day: daysInPrev - firstDay + 1 + i, type: "prev" });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, type: "cur" });
    }
    // Trailing next-month days to fill grid
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
        cells.push({ day: d, type: "next" });
    }

    const isToday = (day, type) =>
        type === "cur" &&
        viewYear === today.getFullYear() &&
        viewMonth === today.getMonth() &&
        day === today.getDate();

    return (
        <Card style={{ backgroundColor: "#dcedc8", padding: "1.2rem", border: "none", width: "100%", maxWidth: "360px" }}>
            {/* Header */}
            <div className="flex-between" style={{ marginBottom: "0.8rem" }}>
                <ChevronLeft size={18} style={{ cursor: "pointer", color: "#555" }} onClick={prevMonth} />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <select
                        value={viewMonth}
                        onChange={e => setViewMonth(Number(e.target.value))}
                        style={{ padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.85rem" }}
                    >
                        {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                    </select>
                    <select
                        value={viewYear}
                        onChange={e => setViewYear(Number(e.target.value))}
                        style={{ padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.85rem" }}
                    >
                        {[...Array(6)].map((_, i) => {
                            const y = today.getFullYear() - 1 + i;
                            return <option key={y} value={y}>{y}</option>;
                        })}
                    </select>
                </div>
                <ChevronRight size={18} style={{ cursor: "pointer", color: "#555" }} onClick={nextMonth} />
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "0.78rem", color: "#555", marginBottom: "4px" }}>
                {DAYS.map(d => <div key={d} style={{ fontWeight: 600 }}>{d}</div>)}
            </div>

            {/* Date cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
                {cells.map((cell, idx) => {
                    const isSel = cell.type === "cur" && cell.day === selectedDate && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                    const iTod = isToday(cell.day, cell.type);
                    return (
                        <div
                            key={idx}
                            onClick={() => cell.type === "cur" && handleDateClick(cell.day)}
                            style={{
                                padding: "0.35rem 0",
                                fontSize: "0.82rem",
                                borderRadius: "4px",
                                cursor: cell.type === "cur" ? "pointer" : "default",
                                color: cell.type !== "cur" ? "#bbb" : isSel ? "white" : iTod ? "white" : "inherit",
                                backgroundColor: isSel ? "#333" : iTod ? "var(--primary-teal)" : "transparent",
                                fontWeight: (isSel || iTod) ? "bold" : "normal",
                                transition: "background-color 0.15s",
                            }}
                        >
                            {cell.day}
                        </div>
                    );
                })}
            </div>
            <div style={{ textAlign: "center", marginTop: "0.8rem", color: "var(--primary-teal)", fontWeight: "bold", fontStyle: "italic", fontSize: "0.88rem" }}>
                Upcoming Appointments
            </div>
        </Card>
    );
};

export default CalendarWidget;
