const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    medications: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        quantity: { type: Number, required: true }
    }],
    tips: { type: String },
    status: {
        type: String,
        enum: ["pending", "fulfilled"],
        default: "pending",
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
