const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls
    staffId: { type: String, unique: true, sparse: true }, // for staff logins
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "receptionist", "doctor", "patient", "pharmacist"],
        required: true
    },
    specialization: String,
});

module.exports = mongoose.model("User", userSchema);
