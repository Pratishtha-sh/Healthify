import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Package, Building2, ShoppingCart } from "lucide-react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

// ─── Static medicine image map (using public medicine images) ───────────────
const MEDICINE_IMAGES = {
    "Atorvastatin": "https://www.drugs.com/images/pills/fio/ABM03830.JPG",
    "Metformin":    "https://www.drugs.com/images/pills/fio/MYL07910.JPG",
    "Lisinopril":   "https://www.drugs.com/images/pills/fio/TEV10380.JPG",
    "Albuterol":    "https://www.drugs.com/images/pills/fio/IVX02350.JPG",
    "Omeprazole":   "https://www.drugs.com/images/pills/fio/DRL00980.JPG",
    "Losartan":     "https://www.drugs.com/images/pills/fio/APX04580.JPG",
};
const getFallbackImg = () => "https://placehold.co/180x140/dcedc8/004d40?text=Medicine";
const getImg = (name) => {
    const key = Object.keys(MEDICINE_IMAGES).find(k => name?.toLowerCase().includes(k.toLowerCase()));
    return key ? MEDICINE_IMAGES[key] : getFallbackImg();
};

// ─── Medicine companies for Home page ───────────────────────────────────────
const COMPANIES = [
    { name: "Sun Pharma",   specialty: "Cardiology & Diabetes",  contact: "1800-221-8888", logo: "☀️" },
    { name: "Cipla",        specialty: "Respiratory & Oncology", contact: "1800-222-6386", logo: "🔵" },
    { name: "Dr Reddy's",   specialty: "Gastro & CNS",           contact: "040-49002900",  logo: "🟢" },
    { name: "Mankind",      specialty: "Antibiotics & Pain",     contact: "011-66116000",  logo: "🟠" },
    { name: "Lupin",        specialty: "CV & Anti-infective",    contact: "022-66402000",  logo: "🟣" },
    { name: "Torrent",      specialty: "CNS & Diabetology",      contact: "079-26583060",  logo: "🔴" },
];

// ─── Default stock (seeded if DB is empty) ──────────────────────────────────
const DEFAULT_STOCK = [
    { name: "Atorvastatin(10mg)",  quantity: 300, composition: "dihydroxy monocarboxylic" },
    { name: "Metformin",           quantity: 455, composition: "Metformin Hydrochloride" },
    { name: "Lisinopril (20mg)",   quantity: 348, composition: "Lisinopril dihydrate" },
    { name: "Albuterol",           quantity: 276, composition: "albuterol sulphate" },
    { name: "Omeprazole (20mg)",   quantity: 598, composition: "Omeprazole" },
    { name: "Losartan (50mg)",     quantity: 390, composition: "Losartan Potassium" },
];

// ═══════════════════════════════════════════════════════════════════════════
const PharmacyManager = () => {
    const [activeTab, setActiveTab]       = useState("home");
    const [inventory, setInventory]       = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [searchTerm, setSearchTerm]     = useState("");
    const [searchResult, setSearchResult] = useState(null); // null | found | notfound
    const [confirming, setConfirming]     = useState(null);
    const [notification, setNotification] = useState("");

    // Add-medicine form
    const [showAddForm, setShowAddForm]   = useState(false);
    const [newMed, setNewMed]             = useState({ name: "", quantity: "", composition: "" });

    // ── Fetch data ──────────────────────────────────────────────────────────
    const fetchData = async () => {
        try {
            const [medRes, presRes] = await Promise.all([
                fetch("http://localhost:5000/api/medicines"),
                fetch("http://localhost:5000/api/prescriptions")
            ]);
            const medData  = await medRes.json();
            const presData = await presRes.json();

            setInventory(Array.isArray(medData) && medData.length > 0
                ? medData
                : DEFAULT_STOCK.map(d => ({ ...d, _id: d.name })));

            setPrescriptions(Array.isArray(presData)
                ? presData.filter(p => p.status === "pending")
                : []);
        } catch (err) {
            console.error(err);
            setInventory(DEFAULT_STOCK.map(d => ({ ...d, _id: d.name })));
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Stock: search ───────────────────────────────────────────────────────
    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        const found = inventory.find(m => m.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        setSearchResult(found ? { ...found, found: true } : { found: false });
    };

    // ── Stock: add medicine ─────────────────────────────────────────────────
    const addMedicine = async () => {
        if (!newMed.name || !newMed.quantity) return;
        try {
            const res = await fetch("http://localhost:5000/api/medicines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newMed.name, quantity: Number(newMed.quantity), composition: newMed.composition })
            });
            await fetchData();
            setNewMed({ name: "", quantity: "", composition: "" });
            setShowAddForm(false);
            setNotification(`✅ ${newMed.name} added to stock`);
            setTimeout(() => setNotification(""), 3000);
        } catch (err) { console.error(err); }
    };

    // ── Stock: delete medicine ──────────────────────────────────────────────
    const deleteMedicine = async (id, name) => {
        if (!window.confirm(`Remove "${name}" from stock?`)) return;
        try {
            if (id && !DEFAULT_STOCK.find(d => d.name === id)) {
                await fetch(`http://localhost:5000/api/medicines/${id}`, { method: "DELETE" });
            }
            setInventory(prev => prev.filter(m => (m._id || m.name) !== id));
            setNotification(`🗑️ ${name} removed from stock`);
            setTimeout(() => setNotification(""), 3000);
        } catch (err) { console.error(err); }
    };

    // ── View Prescription: confirm ──────────────────────────────────────────
    const confirmPrescription = async (id, patientId, medications) => {
        setConfirming(id);
        try {
            await fetch(`http://localhost:5000/api/prescriptions/${id}/confirm`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }
            });
            setNotification(`💊 Medicines confirmed ready for patient ${patientId}`);
            setTimeout(() => setNotification(""), 5000);
            await fetchData();
        } catch (err) { console.error(err); }
        finally { setConfirming(null); }
    };

    const filteredStock = searchTerm
        ? inventory.filter(m => m.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        : inventory;

    const navLinks = [
        { label: "Home",              tabKey: "home",         onClick: () => setActiveTab("home") },
        { label: "Stock",             tabKey: "stock",        onClick: () => setActiveTab("stock") },
        { label: "View Prescription", tabKey: "prescription", onClick: () => setActiveTab("prescription") },
    ];

    return (
        <>
            <Navbar links={navLinks} activeTab={activeTab} />

            {/* Toast */}
            {notification && (
                <div style={{ position: "fixed", top: "80px", right: "2rem", zIndex: 999, backgroundColor: "var(--primary-teal)", color: "white", padding: "1rem 1.8rem", borderRadius: "10px", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", maxWidth: "400px" }}>
                    {notification}
                </div>
            )}

            <div className="page-content">

                {/* ══════════ HOME TAB ══════════ */}
                {activeTab === "home" && (
                    <>
                        <div className="flex-between" style={{ marginBottom: "2.5rem" }}>
                            <div>
                                <h1 style={{ color: "var(--primary-dark)", fontSize: "2.5rem" }}>Pharmacy Manager</h1>
                                <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Manage stock, orders, and prescriptions</p>
                            </div>
                            <button className="btn-primary" onClick={() => setActiveTab("stock")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.8rem" }}>
                                <Package size={18} /> View Stock
                            </button>
                        </div>

                        {/* Quick stats */}
                        <div className="grid-3" style={{ marginBottom: "2.5rem" }}>
                            <Card className="glow-bg" style={{ border: "none", textAlign: "center", padding: "1.8rem" }}>
                                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary-teal)" }}>{inventory.length}</div>
                                <div style={{ color: "var(--text-muted)", marginTop: "0.3rem" }}>Medicine Types</div>
                            </Card>
                            <Card className="glow-bg" style={{ border: "none", textAlign: "center", padding: "1.8rem" }}>
                                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary-teal)" }}>{prescriptions.length}</div>
                                <div style={{ color: "var(--text-muted)", marginTop: "0.3rem" }}>Pending Prescriptions</div>
                            </Card>
                            <Card className="glow-bg" style={{ border: "none", textAlign: "center", padding: "1.8rem" }}>
                                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary-teal)" }}>
                                    {inventory.reduce((s, m) => s + (Number(m.quantity) || 0), 0)}
                                </div>
                                <div style={{ color: "var(--text-muted)", marginTop: "0.3rem" }}>Total Units in Stock</div>
                            </Card>
                        </div>

                        {/* Medicine Companies */}
                        <h2 style={{ color: "var(--primary-dark)", marginBottom: "1.5rem" }}>
                            <Building2 size={22} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                            Medicine Companies
                        </h2>
                        <div className="grid-3" style={{ marginBottom: "2rem" }}>
                            {COMPANIES.map((co, i) => (
                                <Card key={i} className="hover-lift" style={{ padding: "1.5rem", border: "1px solid rgba(0,137,123,0.15)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                                        <div style={{ fontSize: "2.5rem" }}>{co.logo}</div>
                                        <div>
                                            <h3 style={{ color: "var(--primary-dark)", margin: 0, fontSize: "1.1rem" }}>{co.name}</h3>
                                            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{co.specialty}</p>
                                        </div>
                                    </div>
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>📞 {co.contact}</p>
                                    <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                                        <ShoppingCart size={15} /> Place Order
                                    </button>
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {/* ══════════ STOCK TAB ══════════ */}
                {activeTab === "stock" && (
                    <>
                        {/* Header + search + add */}
                        <div className="flex-between" style={{ marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                            <h1 style={{ color: "var(--primary-dark)", fontSize: "2.2rem" }}>Pharmacy Stock</h1>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                                {/* Search bar */}
                                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#dcedc8", padding: "0.6rem 1.2rem", borderRadius: "24px", width: "260px" }}>
                                    <Search size={17} color="var(--primary-dark)" />
                                    <input
                                        type="text"
                                        placeholder="Search medicines…"
                                        value={searchTerm}
                                        onChange={e => { setSearchTerm(e.target.value); setSearchResult(null); }}
                                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                                        style={{ border: "none", background: "transparent", marginLeft: "0.7rem", width: "100%", outline: "none", color: "var(--primary-dark)", fontSize: "0.95rem" }}
                                    />
                                    <button onClick={handleSearch} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-dark)" }}>🔍</button>
                                </div>
                                <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Plus size={16} /> Add Medicine
                                </button>
                            </div>
                        </div>

                        {/* Search result callout */}
                        {searchResult && (
                            <div style={{ marginBottom: "1.5rem", padding: "1rem 1.5rem", borderRadius: "10px", backgroundColor: searchResult.found ? "rgba(76,175,80,0.1)" : "rgba(211,47,47,0.1)", border: `1.5px solid ${searchResult.found ? "#4caf50" : "var(--danger-red)"}`, color: searchResult.found ? "#2e7d32" : "var(--danger-red)", fontWeight: 600 }}>
                                {searchResult.found
                                    ? `✅ "${searchResult.name}" found — ${searchResult.quantity} units in stock`
                                    : `❌ "${searchTerm}" not found in stock`}
                            </div>
                        )}

                        {/* Add medicine form */}
                        {showAddForm && (
                            <Card style={{ marginBottom: "2rem", padding: "1.5rem", border: "2px solid var(--primary-teal)" }}>
                                <h3 style={{ marginBottom: "1rem", color: "var(--primary-dark)" }}>+ Add New Medicine</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr auto", gap: "0.75rem", alignItems: "end" }}>
                                    <div>
                                        <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>Medicine Name *</label>
                                        <input value={newMed.name} onChange={e => setNewMed(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. Paracetamol (500mg)"
                                            style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1.5px solid #ddd", outline: "none", fontSize: "0.9rem" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>Quantity *</label>
                                        <input type="number" value={newMed.quantity} onChange={e => setNewMed(p => ({ ...p, quantity: e.target.value }))}
                                            placeholder="Units"
                                            style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1.5px solid #ddd", outline: "none", fontSize: "0.9rem" }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>Composition</label>
                                        <input value={newMed.composition} onChange={e => setNewMed(p => ({ ...p, composition: e.target.value }))}
                                            placeholder="Active ingredient"
                                            style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1.5px solid #ddd", outline: "none", fontSize: "0.9rem" }} />
                                    </div>
                                    <button className="btn-primary" onClick={addMedicine} style={{ padding: "0.7rem 1.5rem" }}>Add</button>
                                </div>
                            </Card>
                        )}

                        {/* Medicine grid */}
                        <div className="grid-3" style={{ rowGap: "2rem", columnGap: "1.5rem" }}>
                            {filteredStock.map((item, idx) => {
                                const id = item._id || item.name;
                                return (
                                    <div key={idx} className="glow-bg" style={{ padding: "1.2rem", borderRadius: "12px", position: "relative" }}>
                                        {/* Delete button */}
                                        <button
                                            onClick={() => deleteMedicine(id, item.name)}
                                            style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "rgba(211,47,47,0.1)", border: "none", borderRadius: "6px", padding: "0.3rem", cursor: "pointer", color: "var(--danger-red)", display: "flex", alignItems: "center" }}
                                            title="Remove from stock"
                                        >
                                            <Trash2 size={15} />
                                        </button>

                                        <h3 style={{ color: "var(--primary-dark)", fontSize: "1.2rem", marginBottom: "0.8rem", paddingRight: "1.5rem" }}>{item.name}</h3>

                                        {/* Medicine image */}
                                        <div style={{ width: "100%", height: "160px", backgroundColor: "white", border: "1px solid #e0e0e0", borderRadius: "8px", marginBottom: "0.8rem", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <img
                                                src={getImg(item.name)}
                                                alt={item.name}
                                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                                onError={e => { e.target.src = getFallbackImg(); }}
                                            />
                                        </div>

                                        <div className="flex-between" style={{ color: "var(--primary-dark)", fontSize: "0.88rem" }}>
                                            <div>
                                                <div style={{ marginBottom: "0.2rem", fontWeight: 500 }}>Quantity</div>
                                                <div style={{ fontWeight: 700, color: item.quantity < 50 ? "var(--danger-red)" : "inherit" }}>
                                                    {item.quantity} units
                                                    {item.quantity < 50 && " ⚠️"}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{ marginBottom: "0.2rem", fontWeight: 500 }}>Composition</div>
                                                <div style={{ lineHeight: 1.3, maxWidth: "120px", textAlign: "right" }}>{item.composition || "—"}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredStock.length === 0 && (
                            <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                                No medicines match your search.
                            </div>
                        )}
                    </>
                )}

                {/* ══════════ VIEW PRESCRIPTION TAB ══════════ */}
                {activeTab === "prescription" && (
                    <>
                        <div style={{ marginBottom: "2rem" }}>
                            <h1 style={{ color: "var(--primary-dark)", fontSize: "2.2rem" }}>Incoming Prescriptions</h1>
                            <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Prescriptions submitted by doctors awaiting pharmacy fulfilment</p>
                        </div>

                        {prescriptions.length === 0 ? (
                            <Card style={{ textAlign: "center", padding: "4rem" }}>
                                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📋</div>
                                <h2 style={{ color: "var(--text-muted)", fontWeight: 400 }}>No pending prescriptions</h2>
                                <p style={{ color: "var(--text-muted)" }}>All done! New prescriptions from doctors will appear here.</p>
                            </Card>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {prescriptions.map(p => (
                                    <Card key={p._id} style={{ padding: "1.8rem", border: "1.5px solid rgba(0,137,123,0.2)" }}>
                                        {/* Header */}
                                        <div className="flex-between" style={{ marginBottom: "1.2rem" }}>
                                            <div>
                                                <h3 style={{ margin: 0, color: "var(--primary-dark)" }}>
                                                    Patient: <span style={{ color: "var(--primary-teal)" }}>{p.patientId}</span>
                                                </h3>
                                                <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                                                    Prescribed by: {p.doctorName || p.doctorId} &nbsp;·&nbsp;
                                                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
                                                </p>
                                            </div>
                                            <span className="badge badge-yellow">⏳ Pending</span>
                                        </div>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.2rem" }}>
                                            {/* Medicines */}
                                            <div>
                                                <p className="section-label">Prescribed Medicines</p>
                                                <div style={{ border: "1px solid rgba(0,137,123,0.15)", borderRadius: "8px", overflow: "hidden" }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", backgroundColor: "var(--glass-glow)" }}>
                                                        {["Medicine", "Dosage", "Qty"].map(h => (
                                                            <div key={h} style={{ padding: "0.5rem 0.8rem", fontWeight: 700, fontSize: "0.78rem", color: "var(--primary-dark)", textTransform: "uppercase" }}>{h}</div>
                                                        ))}
                                                    </div>
                                                    {p.medications?.map((med, i) => {
                                                        const inStock = inventory.find(m => m.name?.toLowerCase().includes(med.name?.toLowerCase()));
                                                        return (
                                                            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", borderTop: "1px solid rgba(0,137,123,0.08)", backgroundColor: i % 2 === 0 ? "white" : "#fafffe" }}>
                                                                <div style={{ padding: "0.6rem 0.8rem", fontSize: "0.88rem" }}>
                                                                    {med.name}
                                                                    {inStock
                                                                        ? <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", color: "#4caf50" }}>✅ In stock</span>
                                                                        : <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", color: "var(--danger-red)" }}>⚠️ Low</span>
                                                                    }
                                                                </div>
                                                                <div style={{ padding: "0.6rem 0.8rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>{med.dosage}</div>
                                                                <div style={{ padding: "0.6rem 0.8rem", fontSize: "0.88rem", color: "var(--text-muted)" }}>{med.quantity}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Doctor notes */}
                                            <div>
                                                <p className="section-label">Doctor's Notes / Tips</p>
                                                <div style={{ background: "var(--glass-glow)", padding: "1rem", borderRadius: "8px", fontSize: "0.9rem", color: "var(--text-main)", fontStyle: p.tips ? "italic" : "normal", minHeight: "80px" }}>
                                                    {p.tips || <span style={{ color: "var(--text-muted)" }}>No additional notes.</span>}
                                                </div>

                                                {/* Pharmacy location reminder */}
                                                <div style={{ marginTop: "0.75rem", padding: "0.7rem 1rem", borderRadius: "8px", background: "rgba(0,137,123,0.06)", border: "1px solid rgba(0,137,123,0.15)", fontSize: "0.82rem", color: "var(--primary-dark)" }}>
                                                    📍 <strong>Pharmacy:</strong> Ground Floor, Opposite Hospital Reception
                                                </div>
                                            </div>
                                        </div>

                                        {/* Confirm button */}
                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <button
                                                className="btn-primary"
                                                onClick={() => confirmPrescription(p._id, p.patientId, p.medications)}
                                                disabled={confirming === p._id}
                                                style={{ padding: "0.8rem 2.5rem", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                                            >
                                                {confirming === p._id ? "Confirming…" : "💊 Confirm — Medicines Ready"}
                                            </button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default PharmacyManager;
