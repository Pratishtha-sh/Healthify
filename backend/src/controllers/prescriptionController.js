const Prescription = require("../models/Prescription");

// Doctor creates a prescription
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, doctorId, doctorName, medications, tips, recommendations } = req.body;
        const newPrescription = await Prescription.create({
            patientId, doctorId, doctorName: doctorName || "",
            medications, tips: tips || "", recommendations: recommendations || ""
        });
        res.status(201).json(newPrescription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// All prescriptions (for pharmacy View Prescription tab)
exports.getAllPrescriptions = async (req, res) => {
    try {
        const data = await Prescription.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Pending only
exports.getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Generic status update
exports.updateStatus = async (req, res) => {
    try {
        const result = await Prescription.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Pharmacy confirms medicines are ready → notifies patient
exports.confirmPrescription = async (req, res) => {
    try {
        const result = await Prescription.findByIdAndUpdate(
            req.params.id,
            { pharmacyConfirmed: true, status: "confirmed" },
            { new: true }
        );
        if (!result) return res.status(404).json({ message: "Prescription not found" });
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Patient marks the notification as seen
exports.markPatientNotified = async (req, res) => {
    try {
        const result = await Prescription.findByIdAndUpdate(
            req.params.id,
            { patientNotified: true },
            { new: true }
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get prescriptions by patient ID
exports.getPrescriptionsByPatient = async (req, res) => {
    try {
        const data = await Prescription.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
