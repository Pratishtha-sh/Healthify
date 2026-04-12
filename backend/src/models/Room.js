const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    ward:        { type: String, required: true },           // e.g. "General", "ICU", "MICU", "Private"
    floor:       { type: Number, default: 1 },
    roomNumber:  { type: String, required: true },           // e.g. "G-101"
    bedNumber:   { type: String, required: true },           // e.g. "A", "B"
    status:      { type: String, enum: ["free", "occupied"], default: "free" },
    patientId:   { type: String, default: "" },
    patientName: { type: String, default: "" },
    admissionDate: { type: Date },
    notes:       { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
