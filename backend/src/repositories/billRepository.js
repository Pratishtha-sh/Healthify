const Bill = require("../models/Bill");

exports.create = (data) => Bill.create(data);

exports.findAll = () => Bill.find().populate("patient doctor");

exports.findByPatient = (patientId) =>
    Bill.find({ patient: patientId }).populate("doctor");
