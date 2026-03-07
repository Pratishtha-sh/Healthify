import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = ({ links }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 2rem",
                backgroundColor: "var(--primary-teal)",
                color: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src={logo}
                    alt="Healthify Logo"
                    style={{ height: "40px", backgroundColor: "white", borderRadius: "20px", padding: '2px 10px' }}
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                {links.map((link, idx) => (
                    <Link
                        key={idx}
                        to={link.path}
                        style={{
                            color: "white",
                            fontWeight: 500,
                            fontSize: "1.1rem",
                            transition: "opacity 0.2s",
                        }}
                        onMouseOver={(e) => (e.target.style.opacity = 0.8)}
                        onMouseOut={(e) => (e.target.style.opacity = 1)}
                    >
                        {link.label}
                    </Link>
                ))}
                <LogOut onClick={handleLogout} style={{ cursor: "pointer", marginLeft: "1rem", opacity: 0.9 }} title="Logout" />
                <Menu style={{ cursor: "pointer", marginLeft: "1rem" }} />
            </div>
        </nav>
    );
};

export default Navbar;
