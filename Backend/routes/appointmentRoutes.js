const express = require("express");
const {
  createAppointmentController,
  getAppointmentController,
  getDoctorController,
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  getPatientAppointmentController,
  getDoctorAppointmentController,
  getAvailableTimeslotsController,
  getAllTimeslotsController,
  cancelAppointmentController,
  rescheduleAppointmentController,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-appointment", authMiddleware, createAppointmentController);
router.get(
  "/get-patient-appointment",
  authMiddleware,
  getPatientAppointmentController
);
router.get(
  "/get-doctor-appointment",
  authMiddleware,
  getDoctorAppointmentController
);
router.post("/get-doctor", authMiddleware, getDoctorController);
router.post(
  "/get-available-timeslots",
  authMiddleware,
  getAvailableTimeslotsController
);
router.get("/get-all-timeslots", authMiddleware, getAllTimeslotsController);
router.post("/cancel-appointment", authMiddleware, cancelAppointmentController);
router.post(
  "/reschedule-appointment",
  authMiddleware,
  rescheduleAppointmentController
);

// admin routes
router.get("/getAllUser", authMiddleware, getAllUsers);
router.get("/getAllDoctor", authMiddleware, getAllDoctors);
router.get("/getAllAppointment", authMiddleware, getAllAppointments);
module.exports = router;
