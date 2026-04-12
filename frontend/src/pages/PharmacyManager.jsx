import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";

const MedicineCard = ({ title, imgPlaceholder, qty, comp }) => (
    <div className="glow-bg" style={{ padding: "1.5rem", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 style={{ color: "#004d40", fontSize: "1.4rem", marginBottom: "1rem" }}>{title}</h3>
        <div style={{ width: "100%", height: "200px", backgroundColor: "#fff", border: "1px solid #ddd", marginBottom: "1rem", display: "flex", justifyContent: "center", alignItems: "center", color: "#ccc" }}>
            Image Placeholder
        </div>
        <div className="flex-between" style={{ width: "100%", color: "#004d40", fontSize: "0.9rem", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "0.2rem" }}>Quantity-</div>
                <div>{qty} units</div>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "0.2rem" }}>Composition-</div>
                <div style={{ lineHeight: 1.2 }}>{comp}</div>
            </div>
        </div>
    </div>
);

const PharmacyManager = () => {
    const [inventory, setInventory] = useState([
        { title: "Atorvastatin(10mg)", qty: 300, comp: "dihydroxy monocarboxylic" },
    ]);
    const [prescriptions, setPrescriptions] = useState([]);

    const fetchData = async () => {
        try {
            const medRes = await fetch("http://localhost:5000/api/medicines");
            const medData = await medRes.json();
            if (Array.isArray(medData) && medData.length > 0) {
                setInventory(medData.map(m => ({ title: m.name, qty: m.quantity, comp: m.composition })));
            }
            const presRes = await fetch("http://localhost:5000/api/prescriptions/pending");
            const presData = await presRes.json();
            setPrescriptions(Array.isArray(presData) ? presData : []);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => { fetchData() }, []);

    const fulfillPrescription = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/prescriptions/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "fulfilled" })
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar
                links={[
                    { label: "Home", path: "/" },
                    { label: "Stock", path: "/pharmacy" },
                    { label: "Order", path: "/order" },
                ]}
            />
            <div className="page-content">
                <div className="flex-between" style={{ marginBottom: "3rem" }}>
                    <h1 style={{ color: "#004d40", fontSize: "2.5rem" }}>Pharmacy Manager</h1>

                    <div style={{
                        display: "flex", alignItems: "center",
                        backgroundColor: "#dcedc8",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "24px",
                        width: "350px"
                    }}>
                        <Search size={18} color="#004d40" />
                        <input
                            type="text"
                            placeholder="Search"
                            style={{
                                border: "none", backgroundColor: "transparent",
                                marginLeft: "0.8rem", width: "100%", outline: "none",
                                color: "#004d40", fontSize: "1rem"
                            }}
                        />
                    </div>
                </div>

                {/* Pending Prescriptions Section */}
                <div style={{ marginBottom: "3rem" }}>
                    <h2 style={{ color: "#004d40", marginBottom: "1rem" }}>Pending Prescriptions</h2>
                    {prescriptions.length === 0 ? <p>No pending prescriptions from doctors.</p> : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                            {prescriptions.map(p => (
                                <div key={p._id} className="glow-bg" style={{ padding: "1rem", borderRadius: "8px", minWidth: "300px" }}>
                                    <p><strong>Patient:</strong> {p.patientId}</p>
                                    <ul style={{ margin: "10px 0" }}>
                                        {p.medications.map((m, i) => <li key={i}>{m.name} ({m.dosage}) - Qty: {m.quantity}</li>)}
                                    </ul>
                                    <button onClick={() => fulfillPrescription(p._id)} className="btn-primary" style={{ padding: "0.5rem 1rem" }}>Mark Fulfilled</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid-3" style={{ rowGap: "3rem", columnGap: "2rem" }}>
                    {inventory.map((item, idx) => (
                        <MedicineCard key={idx} title={item.title} qty={item.qty} comp={item.comp} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default PharmacyManager;
