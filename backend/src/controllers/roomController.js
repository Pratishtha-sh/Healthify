const Room = require("../models/Room");

const DEFAULT_ROOMS = [
    // General Ward - Floor 1
    { ward: "General", floor: 1, roomNumber: "G-101", bedNumber: "A" },
    { ward: "General", floor: 1, roomNumber: "G-101", bedNumber: "B" },
    { ward: "General", floor: 1, roomNumber: "G-102", bedNumber: "A" },
    { ward: "General", floor: 1, roomNumber: "G-102", bedNumber: "B" },
    { ward: "General", floor: 1, roomNumber: "G-103", bedNumber: "A" },
    { ward: "General", floor: 1, roomNumber: "G-103", bedNumber: "B" },
    // Private - Floor 2
    { ward: "Private", floor: 2, roomNumber: "P-201", bedNumber: "A" },
    { ward: "Private", floor: 2, roomNumber: "P-202", bedNumber: "A" },
    { ward: "Private", floor: 2, roomNumber: "P-203", bedNumber: "A" },
    // ICU - Floor -1
    { ward: "ICU",     floor: -1, roomNumber: "ICU-01", bedNumber: "A" },
    { ward: "ICU",     floor: -1, roomNumber: "ICU-02", bedNumber: "A" },
    { ward: "ICU",     floor: -1, roomNumber: "ICU-03", bedNumber: "A" },
    // MICU - Floor -1
    { ward: "MICU",    floor: -1, roomNumber: "MICU-01", bedNumber: "A" },
    { ward: "MICU",    floor: -1, roomNumber: "MICU-02", bedNumber: "A" },
];

exports.getAllRooms = async (req, res) => {
    try {
        let rooms = await Room.find().sort({ ward: 1, roomNumber: 1, bedNumber: 1 });
        // Auto-seed if empty
        if (rooms.length === 0) {
            await Room.insertMany(DEFAULT_ROOMS);
            rooms = await Room.find().sort({ ward: 1, roomNumber: 1, bedNumber: 1 });
        }
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.assignBed = async (req, res) => {
    try {
        const { patientId, patientName, notes } = req.body;
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            {
                status: "occupied",
                patientId,
                patientName,
                admissionDate: new Date(),
                notes: notes || "",
            },
            { new: true }
        );
        if (!room) return res.status(404).json({ message: "Bed not found" });
        res.json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.freeBed = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            { status: "free", patientId: "", patientName: "", admissionDate: null, notes: "" },
            { new: true }
        );
        res.json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
