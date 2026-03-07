const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");

router.post("/", controller.createAppointment);
router.get("/", controller.getAppointments);
router.get("/doctor/:doctorId", controller.getAppointmentsByDoctor);
router.get("/patient/:patientId", controller.getAppointmentsByPatient);
router.patch("/:id/status", controller.updateStatus);

module.exports = router;
