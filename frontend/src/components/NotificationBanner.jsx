import { AlertTriangle } from "lucide-react";

const NotificationBanner = ({ message, type = "urgent" }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                margin: "1rem 0",
                color: type === "urgent" ? "#d32f2f" : "#004d40",
            }}
        >
            <AlertTriangle size={24} strokeWidth={2.5} />
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "inherit" }}>{message}</h3>
        </div>
    );
};

export default NotificationBanner;
