const service = require("../services/medicineService");

exports.addMedicine = async (req, res) => {
    try {
        const medicine = await service.addMedicine(req.body);
        res.status(201).json(medicine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await service.getAllMedicines();
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMedicine = async (req, res) => {
    try {
        const medicine = await service.updateMedicine(req.params.id, req.body);
        res.json(medicine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMedicine = async (req, res) => {
    try {
        await service.deleteMedicine(req.params.id);
        res.json({ message: "Medicine deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
