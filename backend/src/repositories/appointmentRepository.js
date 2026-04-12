const Appointment = require("../models/Appointment");

exports.create = (data) => Appointment.create(data);

exports.findAll = () =>
    Appointment.find().sort({ createdAt: -1 });

exports.findByDoctor = (doctorId) =>
    Appointment.find({ doctor: doctorId }).sort({ date: 1 });

exports.findByPatient = (patientId) =>
    Appointment.find({ patient: patientId }).sort({ date: 1 });

exports.findById = (id) =>
    Appointment.findById(id);

exports.updateStatus = (id, status) =>
    Appointment.findByIdAndUpdate(id, { status }, { new: true });

