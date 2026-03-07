const Medicine = require("../models/Medicine");

exports.create = (data) => Medicine.create(data);

exports.findAll = () => Medicine.find();

exports.findById = (id) => Medicine.findById(id);

exports.update = (id, data) =>
    Medicine.findByIdAndUpdate(id, data, { new: true });

exports.remove = (id) => Medicine.findByIdAndDelete(id);
