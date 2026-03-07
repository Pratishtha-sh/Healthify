const repo = require("../repositories/medicineRepository");

exports.addMedicine = (data) => repo.create(data);

exports.getAllMedicines = () => repo.findAll();

exports.getMedicineById = (id) => repo.findById(id);

exports.updateMedicine = (id, data) => {
    if (!id) throw new Error("Medicine ID required");
    return repo.update(id, data);
};

exports.deleteMedicine = (id) => repo.remove(id);
