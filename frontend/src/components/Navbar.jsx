import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = ({ links, activeTab }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.8rem 2rem",
            backgroundColor: "var(--primary-teal)",
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                    src={logo}
                    alt="Healthify Logo"
                    style={{ height: "40px", backgroundColor: "white", borderRadius: "20px", padding: "2px 10px", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                {links.map((link, idx) => {
                    const isActive = activeTab && link.tabKey && activeTab === link.tabKey;
                    return link.onClick ? (
                        <button
                            key={idx}
                            onClick={link.onClick}
                            style={{
                                background: "none",
                                border: "none",
                                color: "white",
                                fontWeight: isActive ? 700 : 500,
                                fontSize: "1.05rem",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                padding: "0.3rem 0",
                                borderBottom: isActive ? "2px solid white" : "2px solid transparent",
                                transition: "all 0.2s",
                                opacity: isActive ? 1 : 0.9,
                            }}
                            onMouseOver={e => e.currentTarget.style.opacity = 1}
                            onMouseOut={e => e.currentTarget.style.opacity = isActive ? 1 : 0.9}
                        >
                            {link.label}
                        </button>
                    ) : (
                        <Link
                            key={idx}
                            to={link.path}
                            style={{
                                color: "white",
                                fontWeight: 500,
                                fontSize: "1.05rem",
                                transition: "opacity 0.2s",
                                opacity: 0.9,
                            }}
                            onMouseOver={e => e.target.style.opacity = 1}
                            onMouseOut={e => e.target.style.opacity = 0.9}
                        >
                            {link.label}
                        </Link>
                    );
                })}
                <div
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        cursor: "pointer", opacity: 0.85, transition: "opacity 0.2s",
                        fontSize: "0.9rem"
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                    onMouseOut={e => e.currentTarget.style.opacity = 0.85}
                >
                    <LogOut size={18} />
                </div>
                <Menu style={{ cursor: "pointer", opacity: 0.85 }} size={22} />
            </div>
        </nav>
    );
};

export default Navbar;
