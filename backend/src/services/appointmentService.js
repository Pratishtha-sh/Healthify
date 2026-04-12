const repo = require("../repositories/appointmentRepository");

exports.bookAppointment = async (data) => {
    if (!data.patient || !data.date || !data.timeSlot) {
        throw new Error("Patient, date, and timeSlot are required");
    }
    // Doctor is optional at booking time - assigned later by receptionist
    return repo.create(data);
};

exports.getAppointments = () => repo.findAll();

exports.getAppointmentsByDoctor = (doctorId) =>
    repo.findByDoctor(doctorId);

exports.getAppointmentsByPatient = (patientId) =>
    repo.findByPatient(patientId);

exports.updateAppointmentStatus = async (id, status) => {
    const validStatuses = ["scheduled", "completed", "cancelled", "emergency"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status value");
    }
    return repo.updateStatus(id, status);
};
