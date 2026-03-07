import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";

const BillingPage = () => {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/bills")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    // Format backend data to match UI
                    const formatted = data.map((b, i) => ({
                        id: b._id, sno: `${i + 1}).`, patient: b.patient?.name || "Unknown", doctor: b.doctor?.name || "Unknown", amount: `Rs. ${b.amount}`
                    }));
                    setBills(formatted);
                }
            })
            .catch(err => console.error("Error fetching bills:", err));
    }, []);

    return (
        <>
            <Navbar
                links={[
                    { label: "Home", path: "/" },
                    { label: "Stock", path: "/pharmacy" },
                    { label: "Bills", path: "/billing" },
                ]}
            />
            <div className="page-content">
                <div className="flex-between" style={{ marginBottom: "2rem" }}>
                    <h1 style={{ color: "#004d40" }}>Billing Page</h1>

                    <div style={{
                        display: "flex", alignItems: "center",
                        backgroundColor: "#dcedc8",
                        padding: "0.5rem 1rem",
                        borderRadius: "24px",
                        width: "300px"
                    }}>
                        <Search size={18} color="#004d40" />
                        <input
                            type="text"
                            placeholder="Search"
                            style={{
                                border: "none", backgroundColor: "transparent",
                                marginLeft: "0.5rem", width: "100%", outline: "none",
                                color: "#004d40"
                            }}
                        />
                    </div>
                </div>

                <div style={{ backgroundColor: "#dcedc8", borderRadius: "8px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.05)" }}>
                                <th style={{ padding: "1.5rem", textAlign: "left", color: "#004d40", fontWeight: 500, borderRight: "2px solid rgba(0,0,0,0.05)" }}>S.No</th>
                                <th style={{ padding: "1.5rem", textAlign: "left", color: "#004d40", fontWeight: 500, borderRight: "2px solid rgba(0,0,0,0.05)" }}>Patient Name</th>
                                <th style={{ padding: "1.5rem", textAlign: "left", color: "#004d40", fontWeight: 500, borderRight: "2px solid rgba(0,0,0,0.05)" }}>Doctor Name</th>
                                <th style={{ padding: "1.5rem", textAlign: "left", color: "#004d40", fontWeight: 500, borderRight: "2px solid rgba(0,0,0,0.05)" }}>Bill Amount</th>
                                <th style={{ padding: "1.5rem", textAlign: "center", color: "#004d40", fontWeight: 500 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill, idx) => (
                                <tr key={bill.id} style={{ borderBottom: idx !== bills.length - 1 ? "2px solid rgba(0,0,0,0.05)" : "none" }}>
                                    <td style={{ padding: "1.5rem", color: "#004d40", borderRight: "2px solid rgba(0,0,0,0.05)" }}>{bill.sno}</td>
                                    <td style={{ padding: "1.5rem", color: "#004d40", borderRight: "2px solid rgba(0,0,0,0.05)" }}>{bill.patient}</td>
                                    <td style={{ padding: "1.5rem", color: "#004d40", borderRight: "2px solid rgba(0,0,0,0.05)" }}>{bill.doctor}</td>
                                    <td style={{ padding: "1.5rem", color: "#004d40", borderRight: "2px solid rgba(0,0,0,0.05)" }}>{bill.amount}</td>
                                    <td style={{ padding: "1.5rem", textAlign: "center" }}>
                                        <button className="btn-primary" style={{ padding: "0.5rem 1.5rem", fontSize: "0.9rem" }}>
                                            Generate Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ minHeight: "200px" }}></div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                    <button className="btn-primary" style={{ padding: "0.8rem 3rem", fontSize: "1.1rem" }}>
                        Generate Summary
                    </button>
                </div>
            </div>
        </>
    );
};

export default BillingPage;
