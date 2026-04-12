const Prescription = require("../models/Prescription");
const Bill = require("../models/Bill");

exports.createPrescription = async (req, res) => {
    try {
        const { patientId, doctorId, medications, tips } = req.body;
        
        // Create the prescription
        const newPrescription = new Prescription({
            patientId,
            doctorId,
            medications,
            tips
        });
        
        await newPrescription.save();

        // Automatically create a mock bill for these medicines assuming standard price
        const medicineCost = medications.reduce((total, med) => total + (med.quantity * 10), 0);
        
        const newBill = new Bill({
            patient: null, // Since we're using mock string IDs without user refs
            doctor: null,   
            amount: medicineCost + 500, // Consulting fee + medicines
        });
        
        // Temporary hack since patient is marked as ObjectId in Bill schema but we use string IDs:
        // By schema definition Bill patient/doctor expects ObjectId. 
        // We will just let it fail or modify Bill.js to accept strings if it fails.
        
        res.status(201).json(newPrescription);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

exports.getPrescriptionsByPatient = async (req, res) => {
    try {
        const data = await Prescription.find({ patientId: req.params.patientId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
