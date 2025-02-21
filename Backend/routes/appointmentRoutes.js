const express = require("express");
const {
  createAppointmentController,
  getAppointmentController,
  getDoctorController,
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-appointment", authMiddleware, createAppointmentController);
router.get("/get-appointment", authMiddleware, getAppointmentController)
router.post("/get-doctor", authMiddleware, getDoctorController)

router.get('/getAllUser', authMiddleware, getAllUsers)
router.get('/getAllDoctor', authMiddleware, getAllDoctors)
router.get('/getAllAppointment', authMiddleware, getAllAppointments)
module.exports = router;

