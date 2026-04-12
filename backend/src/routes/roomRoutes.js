const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/roomController");

router.get("/",               ctrl.getAllRooms);
router.patch("/:id/assign",   ctrl.assignBed);
router.patch("/:id/free",     ctrl.freeBed);

module.exports = router;
