const express = require("express");
const {
  createAppointmentControler,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-appointment", authMiddleware, createAppointmentControler);

module.exports = router;
