const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // ── Common fields ──────────────────────────────────────────
    name:     { type: String, required: true },
    email:    { type: String, unique: true, sparse: true },
    staffId:  { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "receptionist", "doctor", "patient", "pharmacist"],
        required: true
    },
    phone:    { type: String, default: "" },

    // ── Doctor-specific ────────────────────────────────────────
    specialty:     { type: String, default: "" },   // General Physician, Cardiologist…
    qualification: { type: String, default: "" },   // MBBS, MD, DM…
    department:    { type: String, default: "" },
    experience:    { type: Number, default: 0 },    // years
    roomNumber:    { type: String, default: "" },   // consulting room

    // ── Patient-specific ───────────────────────────────────────
    dateOfBirth: { type: Date },
    gender:      { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    bloodGroup:  { type: String, default: "" },
    address:     { type: String, default: "" },

    // ── Receptionist / Admin / Pharmacist ─────────────────────
    employeeDept: { type: String, default: "" },

    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
