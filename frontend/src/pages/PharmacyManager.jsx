import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";

const MedicineCard = ({ title, imgPlaceholder, qty, comp }) => (
    <div className="glow-bg" style={{ padding: "1.5rem", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 style={{ color: "#004d40", fontSize: "1.4rem", marginBottom: "1rem" }}>{title}</h3>
        <div style={{ width: "100%", height: "200px", backgroundColor: "#fff", border: "1px solid #ddd", marginBottom: "1rem", display: "flex", justifyContent: "center", alignItems: "center", color: "#ccc" }}>
            {/* We will leave this as a white box since we don't have the actual pill images */}
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
        { title: "Metformin", qty: 455, comp: "Metformin Hydrochloride" },
        { title: "Lisinopril (20 mg)", qty: 348, comp: "Lisinopril dihydrate" },
        { title: "Albuterol", qty: 276, comp: "albuterol sulphate" },
        { title: "Omezaprole (20mg)", qty: 598, comp: "Omeprazole" },
        { title: "Losarton (50mg)", qty: 390, comp: "Losarton Potassium" },
    ]);

    useEffect(() => {
        fetch("http://localhost:5000/api/medicines")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const formatted = data.map(m => ({
                        title: m.name, qty: m.quantity, comp: m.composition
                    }));
                    setInventory(formatted);
                }
            })
            .catch(err => console.error("Error fetching medicines:", err));
    }, []);

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
