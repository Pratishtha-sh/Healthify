const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    // Using String instead of ObjectId ref so mock IDs (DOC123, patient_xxx) work
    patient: { type: String, required: true },
    doctor: { type: String, default: "Unassigned" },
    doctorName: { type: String, default: "" },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    symptoms: { type: String, default: "" },
    specialtyRequested: { type: String, default: "General Physician" },
    isEmergency: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["pending", "scheduled", "completed", "cancelled", "emergency"],
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
