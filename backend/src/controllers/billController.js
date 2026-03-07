const service = require("../services/billService");

exports.createBill = async (req, res) => {
    try {
        const bill = await service.createBill(req.body);
        res.status(201).json(bill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllBills = async (req, res) => {
    try {
        const bills = await service.getAllBills();
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBillsByPatient = async (req, res) => {
    try {
        const bills = await service.getBillsByPatient(req.params.patientId);
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
