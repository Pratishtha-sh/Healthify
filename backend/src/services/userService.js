const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const repo = require("../repositories/userRepository");
const User = require("../models/User");

exports.register = async (data) => {
    if (data.role !== "patient" && !data.staffId) {
        throw new Error("Staff members must provide a Staff ID");
    }
    if (data.role === "patient" && !data.email) {
        throw new Error("Patients must provide an email");
    }

    // Check existing
    if (data.email) {
        const existing = await User.findOne({ email: data.email });
        if (existing) throw new Error("Email already registered");
    }
    if (data.staffId) {
        const existing = await User.findOne({ staffId: data.staffId });
        if (existing) throw new Error("Staff ID already registered");
    }

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    return repo.create(data);
};

exports.login = async (identifier, password) => {
    // identifier can be email or staffId
    const user = await User.findOne({
        $or: [{ email: identifier }, { staffId: identifier }]
    });

    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { token, user: { id: user._id, name: user.name, role: user.role } };
};

exports.getAllUsers = () => repo.findAll();

exports.getUsersByRole = (role) => repo.findByRole(role);
