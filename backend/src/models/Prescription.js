const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    patientId:   { type: String, required: true },
    doctorId:    { type: String, required: true },
    doctorName:  { type: String, default: "" },
    medications: [{
        name:     { type: String, required: true },
        dosage:   { type: String, required: true },
        quantity: { type: Number, required: true }
    }],
    tips:              { type: String, default: "" },
    recommendations:   { type: String, default: "" },
    status: {
        type: String,
        enum: ["pending", "fulfilled", "confirmed"],
        default: "pending",
    },
    pharmacyConfirmed: { type: Boolean, default: false },
    patientNotified:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
