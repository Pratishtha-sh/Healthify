import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import logo from "../assets/logo.png";

const API = "http://localhost:5000/api/users";

const SPECIALTIES = [
    "General Physician", "Cardiologist", "Dermatologist",
    "Pediatrician", "Orthopedic", "Neurologist", "ENT Specialist",
];

const inputStyle = {
    width: "100%", padding: "0.85rem 1rem", borderRadius: "10px",
    border: "1.5px solid #e0e0e0", outline: "none", fontSize: "0.95rem",
    transition: "border-color 0.2s", fontFamily: "inherit",
};

const focusInput = e => e.target.style.borderColor = "var(--primary-teal)";
const blurInput  = e => e.target.style.borderColor = "#e0e0e0";

const ROLE_PREFIX_MAP = { DOC: "doctor", REC: "receptionist", ADM: "admin", PHA: "pharmacist" };
const PREFIX_HINT = { doctor: "DOC", receptionist: "REC", admin: "ADM", pharmacist: "PHA" };

const LoginPage = () => {
    const navigate = useNavigate();

    const [isLogin,   setIsLogin]   = useState(true);
    const [userType,  setUserType]  = useState("patient"); // patient | staff
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState("");
    const [success,   setSuccess]   = useState("");

    // Shared
    const [name,     setName]     = useState("");
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    // Staff only
    const [staffId,       setStaffId]       = useState("");
    const [staffRole,     setStaffRole]     = useState("doctor");
    const [specialty,     setSpecialty]     = useState("General Physician");
    const [qualification, setQualification] = useState("");
    const [department,    setDepartment]    = useState("");
    const [experience,    setExperience]    = useState("");
    const [roomNumber,    setRoomNumber]    = useState("");
    const [phone,         setPhone]         = useState("");
    const [employeeDept,  setEmployeeDept]  = useState("");

    // Patient only (signup)
    const [gender,      setGender]      = useState("");
    const [bloodGroup,  setBloodGroup]  = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [address,     setAddress]     = useState("");

    // Auto-detect role from staffId prefix
    const detectRole = (id) => {
        const prefix = id.toUpperCase().substring(0, 3);
        return ROLE_PREFIX_MAP[prefix] || staffRole;
    };

    const buildPayload = () => {
        if (userType === "patient") {
            return {
                name, email, password, role: "patient",
                gender, bloodGroup, dateOfBirth, address, phone,
            };
        }
        const role = detectRole(staffId);
        return {
            name, email, password, role, staffId,
            specialty:     role === "doctor" ? specialty : "",
            qualification: role === "doctor" ? qualification : "",
            department,
            experience:    role === "doctor" ? Number(experience) : 0,
            roomNumber:    role === "doctor" ? roomNumber : "",
            phone,
            employeeDept,
        };
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (password !== confirmPw) { setError("Passwords do not match"); return; }
        setLoading(true);
        try {
            const res  = await fetch(`${API}/register`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildPayload()),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");
            setSuccess("Account created! You can now log in.");
            setIsLogin(true);
        } catch (err) {
            setError(err.message);
        } finally { setLoading(false); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        setLoading(true);
        try {
            const identifier = userType === "patient" ? email : staffId;
            const res  = await fetch(`${API}/login`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            const { token, user } = data;
            localStorage.setItem("token",    token);
            localStorage.setItem("userRole", user.role);
            localStorage.setItem("userId",   user._id);
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userSpecialty", user.specialty || "");
            localStorage.setItem("userData",  JSON.stringify(user));

            switch (user.role) {
                case "admin":
                case "receptionist": navigate("/admin");    break;
                case "doctor":       navigate("/doctor");   break;
                case "pharmacist":   navigate("/pharmacy"); break;
                case "patient":      navigate("/patient");  break;
                default:             navigate("/login");
            }
        } catch (err) {
            setError(err.message);
        } finally { setLoading(false); }
    };

    const detectedRole = staffId ? detectRole(staffId) : staffRole;
    const expectedPrefix = PREFIX_HINT[staffRole] || "";

    return (
        <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "linear-gradient(135deg, #e0f2f1 0%, #f1f8e9 100%)" }}>

            {/* ── Left panel ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
                <img src={logo} alt="Healthify" style={{ width: "180px", marginBottom: "2rem" }} />

                <Card style={{ width: "100%", maxWidth: "500px", padding: "2.5rem", overflowY: "auto", maxHeight: "90vh" }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "0.3rem", color: "var(--primary-dark)" }}>
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.92rem" }}>
                        {isLogin ? "Please sign in to your account" : "Fill in the details to register"}
                    </p>

                    {/* Patient / Staff toggle */}
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                        {["patient", "staff"].map(t => (
                            <button key={t} onClick={() => setUserType(t)} style={{
                                flex: 1, padding: "0.75rem", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "0.92rem",
                                border: userType === t ? "2px solid var(--primary-teal)" : "1.5px solid #e0e0e0",
                                background: userType === t ? "var(--glass-glow)" : "white",
                                color: userType === t ? "var(--primary-dark)" : "#888",
                                transition: "all 0.2s",
                            }}>
                                {t === "patient" ? "🧑‍⚕️ Patient" : "👔 Staff"}
                            </button>
                        ))}
                    </div>

                    {/* ── LOGIN FORM ── */}
                    {isLogin && (
                        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {userType === "patient" ? (
                                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
                                    required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                            ) : (
                                <input type="text" placeholder="Staff ID (e.g. DOC123, REC001)" value={staffId} onChange={e => setStaffId(e.target.value)}
                                    required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                            )}
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                                required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />

                            {error   && <div style={{ color: "var(--danger-red)", fontSize: "0.88rem", padding: "0.7rem", background: "rgba(211,47,47,0.07)", borderRadius: "8px" }}>{error}</div>}
                            {success && <div style={{ color: "var(--primary-teal)", fontSize: "0.88rem", padding: "0.7rem", background: "rgba(0,137,123,0.08)", borderRadius: "8px" }}>{success}</div>}

                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "0.5rem", padding: "1rem", fontSize: "1rem" }}>
                                {loading ? "Signing in…" : "Sign In"}
                            </button>
                        </form>
                    )}

                    {/* ── SIGNUP FORM ── */}
                    {!isLogin && (
                        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

                            <input type="text" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)}
                                required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />

                            {/* ── PATIENT fields ── */}
                            {userType === "patient" && (
                                <>
                                    <input type="email" placeholder="Email Address *" value={email} onChange={e => setEmail(e.target.value)}
                                        required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                    <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                        <select value={gender} onChange={e => setGender(e.target.value)} style={{ ...inputStyle, background: "white" }}>
                                            <option value="">Gender</option>
                                            {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
                                        </select>
                                        <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} style={{ ...inputStyle, background: "white" }}>
                                            <option value="">Blood Group</option>
                                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem", display: "block" }}>Date of Birth</label>
                                        <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
                                            style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                    </div>
                                    <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)}
                                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                </>
                            )}

                            {/* ── STAFF fields ── */}
                            {userType === "staff" && (
                                <>
                                    <div>
                                        <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.3rem", display: "block" }}>Role</label>
                                        <select value={staffRole} onChange={e => setStaffRole(e.target.value)} style={{ ...inputStyle, background: "white" }}>
                                            {["doctor", "receptionist", "pharmacist", "admin"].map(r => (
                                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <input type="text"
                                            placeholder={`Staff ID * (must start with ${PREFIX_HINT[staffRole] || "your prefix"})`}
                                            value={staffId} onChange={e => setStaffId(e.target.value)}
                                            required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                        {staffId && (
                                            <p style={{ fontSize: "0.78rem", marginTop: "0.3rem", color: detectedRole === staffRole ? "var(--primary-teal)" : "var(--danger-red)" }}>
                                                {detectedRole === staffRole ? `✅ Prefix matches ${detectedRole}` : `⚠️ Prefix should be ${PREFIX_HINT[staffRole]}`}
                                            </p>
                                        )}
                                    </div>
                                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
                                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                    <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />

                                    {/* Doctor-only fields */}
                                    {staffRole === "doctor" && (
                                        <>
                                            <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ ...inputStyle, background: "white" }}>
                                                {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                            <input type="text" placeholder="Qualification (e.g. MBBS, MD, AIIMS)" value={qualification}
                                                onChange={e => setQualification(e.target.value)} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                                                <input type="number" placeholder="Experience (years)" value={experience}
                                                    onChange={e => setExperience(e.target.value)} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                                <input type="text" placeholder="Consulting Room No." value={roomNumber}
                                                    onChange={e => setRoomNumber(e.target.value)} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                            </div>
                                        </>
                                    )}

                                    {staffRole !== "doctor" && (
                                        <input type="text" placeholder="Department" value={employeeDept}
                                            onChange={e => setEmployeeDept(e.target.value)} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                                    )}
                                </>
                            )}

                            {/* Password fields */}
                            <input type="password" placeholder="Create Password *" value={password} onChange={e => setPassword(e.target.value)}
                                required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                            <input type="password" placeholder="Confirm Password *" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                                required style={{ ...inputStyle, borderColor: confirmPw && confirmPw !== password ? "var(--danger-red)" : "#e0e0e0" }}
                                onFocus={focusInput} onBlur={blurInput} />

                            {error   && <div style={{ color: "var(--danger-red)", fontSize: "0.88rem", padding: "0.7rem", background: "rgba(211,47,47,0.07)", borderRadius: "8px" }}>{error}</div>}
                            {success && <div style={{ color: "var(--primary-teal)", fontSize: "0.88rem", padding: "0.7rem", background: "rgba(0,137,123,0.08)", borderRadius: "8px" }}>{success}</div>}

                            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "0.5rem", padding: "1rem", fontSize: "1rem" }}>
                                {loading ? "Creating account…" : "Create Account"}
                            </button>
                        </form>
                    )}

                    <div style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.92rem" }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
                            style={{ color: "var(--primary-teal)", fontWeight: 600, cursor: "pointer" }}>
                            {isLogin ? "Sign Up" : "Sign In"}
                        </span>
                    </div>
                </Card>
            </div>

            {/* ── Right decorative panel ── */}
            <div style={{ flex: 1, background: "linear-gradient(135deg, var(--primary-teal), var(--primary-dark))", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white", padding: "3rem" }}>
                <div style={{ fontSize: "5rem", marginBottom: "2rem" }}>🏥</div>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem", textAlign: "center" }}>Healthify</h1>
                <p style={{ fontSize: "1.1rem", opacity: 0.85, textAlign: "center", maxWidth: "340px", lineHeight: 1.7 }}>
                    Your complete hospital management system — connecting patients, doctors, receptionists and pharmacy in one place.
                </p>
                <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "320px" }}>
                    {[
                        { icon: "🧑‍⚕️", text: "Patients: use your email to sign up & book appointments" },
                        { icon: "👨‍⚕️", text: "Doctors: Staff ID starts with DOC (e.g. DOC123)" },
                        { icon: "📋", text: "Receptionist: Staff ID starts with REC (e.g. REC001)" },
                        { icon: "💊", text: "Pharmacy: Staff ID starts with PHA (e.g. PHA001)" },
                    ].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "rgba(255,255,255,0.12)", borderRadius: "10px", padding: "0.9rem 1rem" }}>
                            <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                            <span style={{ fontSize: "0.85rem", opacity: 0.9, lineHeight: 1.5 }}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
