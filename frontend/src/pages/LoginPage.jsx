import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import hospitalImg from "../assets/hospital.png";
import logo from "../assets/logo.png";

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState("patient"); // 'patient' or 'staff'

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [staffId, setStaffId] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("doctor"); // Default staff role
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const endpoint = isLogin ? "/api/users/login" : "/api/users/register";

        // Construct payload based on type
        const payload = {};
        if (isLogin) {
            payload.email = userType === "patient" ? email : staffId; // login handles either
            payload.password = password;
        } else {
            payload.name = name;
            payload.password = password;
            payload.role = userType === "patient" ? "patient" : role;
            if (userType === "patient") payload.email = email;
            else payload.staffId = staffId;
        }

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed request");

            // Save token
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userRole", data.user.role);

                // Redirect based on role
                switch (data.user.role) {
                    case "admin":
                    case "receptionist":
                        navigate("/admin");
                        break;
                    case "doctor":
                        navigate("/doctor");
                        break;
                    case "pharmacist":
                        navigate("/pharmacy");
                        break;
                    case "patient":
                        navigate("/patient");
                        break;
                    default:
                        navigate("/");
                }
            } else {
                // Successful signup, switch to login
                setIsLogin(true);
                setError("Account created successfully. Please login.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "var(--bg-light)" }}>
            {/* Left Form Section */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>

                <img src={logo} alt="Healthify" style={{ width: "200px", marginBottom: "3rem" }} />

                <Card style={{ width: "100%", maxWidth: "450px", padding: "2.5rem" }}>
                    <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "var(--primary-dark)" }}>
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                        {isLogin ? "Please login to your account" : "Sign up to get started"}
                    </p>

                    <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                        <button
                            onClick={() => setUserType("patient")}
                            style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", border: userType === "patient" ? "2px solid var(--primary-teal)" : "1px solid #ddd", backgroundColor: userType === "patient" ? "var(--glass-glow)" : "white", color: userType === "patient" ? "var(--primary-dark)" : "#666", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                        >
                            Patient
                        </button>
                        <button
                            onClick={() => setUserType("staff")}
                            style={{ flex: 1, padding: "0.8rem", borderRadius: "8px", border: userType === "staff" ? "2px solid var(--primary-teal)" : "1px solid #ddd", backgroundColor: userType === "staff" ? "var(--glass-glow)" : "white", color: userType === "staff" ? "var(--primary-dark)" : "#666", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                        >
                            Staff
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                        {!isLogin && (
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                        )}

                        {userType === "patient" ? (
                            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                        ) : (
                            <input type="text" placeholder="Staff ID" value={staffId} onChange={(e) => setStaffId(e.target.value)} required style={inputStyle} />
                        )}

                        {userType === "staff" && !isLogin && (
                            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
                                <option value="doctor">Doctor</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="pharmacist">Pharmacist</option>
                                <option value="admin">Admin</option>
                            </select>
                        )}

                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

                        {error && <div style={{ color: error.includes("success") ? "green" : "red", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

                        <button type="submit" className="btn-primary" style={{ marginTop: "1rem", padding: "1rem", fontSize: "1.1rem" }}>
                            {isLogin ? "Login" : "Sign Up"}
                        </button>
                    </form>

                    <div style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-muted)" }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setIsLogin(!isLogin)} style={{ color: "var(--primary-teal)", fontWeight: 600, cursor: "pointer" }}>
                            {isLogin ? "Sign Up" : "Login"}
                        </span>
                    </div>

                </Card>
            </div>

            {/* Right Image Section */}
            <div style={{ flex: 1, display: "none", "@media (min-width: 768px)": { display: "block" }, position: "relative", backgroundColor: "var(--primary-teal)" }}>
                <img src={hospitalImg} alt="Hospital" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "1rem"
};

export default LoginPage;
