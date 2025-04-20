const express = require("express");
const {
  createAppointmentController,
  getDoctorController,
  getPatientAppointmentController,
  getDoctorAppointmentController,
  getAvailableTimeslotsController,
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
router.post("/cancel-appointment", authMiddleware, cancelAppointmentController);
router.post(
  "/reschedule-appointment",
  authMiddleware,
  rescheduleAppointmentController
);


module.exports = router;
