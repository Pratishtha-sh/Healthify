const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/", controller.getAllUsers);
router.get("/role/:role", controller.getUsersByRole);

module.exports = router;
