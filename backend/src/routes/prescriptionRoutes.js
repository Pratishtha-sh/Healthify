const express = require("express");
const router = express.Router();
const controller = require("../controllers/prescriptionController");

router.post("/",                             controller.createPrescription);
router.get("/",                              controller.getAllPrescriptions);
router.get("/pending",                       controller.getPendingPrescriptions);
router.get("/patient/:patientId",            controller.getPrescriptionsByPatient);
router.patch("/:id/status",                  controller.updateStatus);
router.patch("/:id/confirm",                 controller.confirmPrescription);
router.patch("/:id/patient-notified",        controller.markPatientNotified);

module.exports = router;
