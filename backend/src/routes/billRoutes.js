const express = require("express");
const router = express.Router();
const controller = require("../controllers/billController");

router.post("/", controller.createBill);
router.get("/", controller.getAllBills);
router.get("/patient/:patientId", controller.getBillsByPatient);

module.exports = router;
