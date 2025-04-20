const express = require("express");
const {
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  deleteUser,
  getAnalytics,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/getAllUsers", authMiddleware, getAllUsers);
router.get("/getAllDoctors", authMiddleware, getAllDoctors);
router.get("/getAllAppointments", authMiddleware, getAllAppointments);
router.post("/deleteUser", authMiddleware, deleteUser);

// Analytics routes
router.get("/get-analytics", authMiddleware, getAnalytics);

module.exports = router;
