const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/userController");

router.post("/register",              controller.register);
router.post("/login",                 controller.login);
router.post("/manual-patient",        controller.manualRegisterPatient);
router.get("/",                       controller.getAllUsers);
router.get("/role/:role",             controller.getUsersByRole);
router.get("/:id",                    controller.getUserById);

module.exports = router;
