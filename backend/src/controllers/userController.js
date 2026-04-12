const service = require("../services/userService");

exports.register = async (req, res) => {
    try {
        const user = await service.register(req.body);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, email, staffId, password } = req.body;
        const id = identifier || email || staffId;
        const result = await service.login(id, password);
        res.json(result);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await service.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUsersByRole = async (req, res) => {
    try {
        const users = await service.getUsersByRole(req.params.role);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await service.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.manualRegisterPatient = async (req, res) => {
    try {
        const patient = await service.manualRegisterPatient(req.body);
        res.status(201).json({ message: "Patient registered", patient });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
