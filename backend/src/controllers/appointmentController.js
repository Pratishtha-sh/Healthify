const service = require("../services/appointmentService");

exports.createAppointment = async (req, res) => {
    try {
        const result = await service.bookAppointment(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const data = await service.getAppointments();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAppointmentsByDoctor = async (req, res) => {
    try {
        const data = await service.getAppointmentsByDoctor(req.params.doctorId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const data = await service.getAppointmentsByPatient(req.params.patientId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const result = await service.updateAppointmentStatus(
            req.params.id,
            req.body.status
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
