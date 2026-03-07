const repo = require("../repositories/appointmentRepository");

exports.bookAppointment = async (data) => {
    if (!data.patient || !data.doctor || !data.date) {
        throw new Error("Patient, doctor, and date are required");
    }
    return repo.create(data);
};

exports.getAppointments = () => repo.findAll();

exports.getAppointmentsByDoctor = (doctorId) =>
    repo.findByDoctor(doctorId);

exports.getAppointmentsByPatient = (patientId) =>
    repo.findByPatient(patientId);

exports.updateAppointmentStatus = async (id, status) => {
    const validStatuses = ["scheduled", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status value");
    }
    return repo.updateStatus(id, status);
};
