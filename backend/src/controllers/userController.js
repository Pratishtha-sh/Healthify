const service = require("../services/userService");

exports.register = async (req, res) => {
    try {
        const user = await service.register(req.body);
        res.status(201).json({ message: "User registered", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await service.login(email, password);
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
