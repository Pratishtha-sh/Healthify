const express = require("express");
const cors    = require("cors");

const appointmentRoutes  = require("./routes/appointmentRoutes");
const userRoutes         = require("./routes/userRoutes");
const billRoutes         = require("./routes/billRoutes");
const medicineRoutes     = require("./routes/medicineRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const roomRoutes         = require("./routes/roomRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/appointments",  appointmentRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/bills",         billRoutes);
app.use("/api/medicines",     medicineRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/rooms",         roomRoutes);

app.get("/", (_req, res) => res.send("Healthify Backend API is running"));

module.exports = app;
