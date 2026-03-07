const repo = require("../repositories/billRepository");

exports.createBill = (data) => {
    if (!data.patient || !data.amount) {
        throw new Error("Patient and amount are required");
    }
    return repo.create(data);
};

exports.getAllBills = () => repo.findAll();

exports.getBillsByPatient = (patientId) => repo.findByPatient(patientId);
