const bcrypt  = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require("../models/User");

// ── Role prefix validator ────────────────────────────────────────────────────
const ROLE_PREFIXES = {
    DOC: "doctor",
    REC: "receptionist",
    ADM: "admin",
    PHA: "pharmacist",
};

function detectRoleFromStaffId(staffId) {
    if (!staffId) return null;
    const prefix = staffId.toUpperCase().substring(0, 3);
    return ROLE_PREFIXES[prefix] || null;
}

// ── Register ─────────────────────────────────────────────────────────────────
exports.register = async (data) => {
    const { name, email, password, role, staffId } = data;

    if (!name || !password) throw new Error("Name and password are required");

    // Patients need email
    if (role === "patient" && !email) throw new Error("Email is required for patients");

    // Staff need staffId and the prefix must match role
    if (role !== "patient") {
        if (!staffId) throw new Error("Staff ID is required for staff accounts");
        const detectedRole = detectRoleFromStaffId(staffId);
        if (detectedRole && detectedRole !== role) {
            throw new Error(`Staff ID prefix doesn't match role. Expected prefix for ${role.toUpperCase()}`);
        }
    }

    // Doctors need specialty
    if (role === "doctor" && !data.specialty) throw new Error("Specialty is required for doctors");

    // Duplicate checks
    if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) throw new Error("Email is already registered");
    }
    if (staffId) {
        const existingStaff = await User.findOne({ staffId });
        if (existingStaff) throw new Error("Staff ID already registered");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name, email, password: hashed, role, staffId,
        specialty:     data.specialty     || "",
        qualification: data.qualification || "",
        department:    data.department    || "",
        experience:    data.experience    || 0,
        roomNumber:    data.roomNumber    || "",
        phone:         data.phone         || "",
        dateOfBirth:   data.dateOfBirth   || null,
        gender:        data.gender        || "",
        bloodGroup:    data.bloodGroup    || "",
        address:       data.address       || "",
        employeeDept:  data.employeeDept  || "",
    });

    // Return safe user object (no password)
    return safeUser(user);
};

// ── Login ─────────────────────────────────────────────────────────────────────
exports.login = async (identifier, password) => {
    const user = await User.findOne({
        $or: [{ email: identifier }, { staffId: identifier }]
    });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
        {
            id:        user._id,
            role:      user.role,
            name:      user.name,
            staffId:   user.staffId,
            specialty: user.specialty,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { token, user: safeUser(user) };
};

// ── Helpers ───────────────────────────────────────────────────────────────────
exports.getAllUsers  = () => User.find({}, "-password").sort({ createdAt: -1 });
exports.getUsersByRole = (role) => User.find({ role }, "-password").sort({ name: 1 });
exports.getUserById  = (id) => User.findById(id, "-password");

// Manual patient registration by receptionist
exports.manualRegisterPatient = async (data) => {
    if (!data.name) throw new Error("Patient name is required");

    // Check if email already exists (if provided)
    if (data.email) {
        const existing = await User.findOne({ email: data.email });
        if (existing) throw new Error("Email is already registered");
    }

    const hashed = await bcrypt.hash(data.password || "healthify123", 10);

    const patient = await User.create({
        name:        data.name,
        email:       data.email  || "",
        phone:       data.phone  || "",
        role:        "patient",
        password:    hashed,
        gender:      data.gender      || "",
        bloodGroup:  data.bloodGroup  || "",
        dateOfBirth: data.dateOfBirth || null,
        address:     data.address     || "",
    });

    return safeUser(patient);
};

function safeUser(user) {
    const obj = user.toObject ? user.toObject() : user;
    const { password: _pw, ...safe } = obj;
    return safe;
}
