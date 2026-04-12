const express = require("express");
const router = express.Router();
const controller = require("../controllers/prescriptionController");

router.post("/", controller.createPrescription);
router.get("/pending", controller.getPendingPrescriptions);
router.patch("/:id/status", controller.updateStatus);
router.get("/patient/:patientId", controller.getPrescriptionsByPatient);

module.exports = router;
