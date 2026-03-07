const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicineController");

router.post("/", controller.addMedicine);
router.get("/", controller.getAllMedicines);
router.put("/:id", controller.updateMedicine);
router.delete("/:id", controller.deleteMedicine);

module.exports = router;
