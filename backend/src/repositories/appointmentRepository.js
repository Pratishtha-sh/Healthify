const Appointment = require("../models/Appointment");

exports.create = (data) => Appointment.create(data);

exports.findAll = () =>
    Appointment.find().populate("patient doctor");

exports.findByDoctor = (doctorId) =>
    Appointment.find({ doctor: doctorId }).populate("patient");

exports.findByPatient = (patientId) =>
    Appointment.find({ patient: patientId }).populate("doctor");

exports.findById = (id) =>
    Appointment.findById(id).populate("patient doctor");

exports.updateStatus = (id, status) =>
    Appointment.findByIdAndUpdate(id, { status }, { new: true });
