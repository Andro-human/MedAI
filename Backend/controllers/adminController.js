const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");

const getAllDoctors = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (user.role != "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const doctors = await userModel.find({ role: "doctor" });
    return res.status(200).send({
      success: true,
      message: "Successfully fetched all the doctors",
      doctors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getAllDoctors API",
      error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (user.role != "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const users = await userModel.find({ role: "user" });
    return res.status(200).send({
      success: true,
      message: "Successfully fetched all the users",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getAllUsers API",
      error,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (user.role != "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const appointments = await appointmentModel
      .find()
      .populate("doctor", "name email phone specialization experience")
      .populate("patient", "name email phone age gender");

    return res.status(200).send({
      success: true,
      message: "Successfully fetched all the Appointments",
      appointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getAllAppointments API",
      error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userToBeDeletedId } = req.body;
    const user = await userModel.findOne({ _id: req.body.userId });

    if (user.role != "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }
    await userModel.findByIdAndDelete(userToBeDeletedId);
    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deleteUser API",
      error,
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // Get current date and dates for last week
    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    // Get total counts
    const totalDoctors = await userModel.countDocuments({ role: "doctor" });
    const totalPatients = await userModel.countDocuments({ role: "user" });
    const totalAppointments = await appointmentModel.countDocuments();

    // Get new counts for the past week
    const newDoctors = await userModel.countDocuments({
      role: "doctor",
      createdAt: { $gte: oneWeekAgo },
    });

    const newPatients = await userModel.countDocuments({
      role: "user",
      createdAt: { $gte: oneWeekAgo },
    });

    const newAppointments = await appointmentModel.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    // Get weekly appointment data
    const weeklyAppointments = await appointmentModel.find({
      date: { $gte: oneWeekAgo, $lte: currentDate },
    });

    // Create daily trends
    const dailyTrends = {};

    // Initialize data structure for the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      dailyTrends[dateString] = 0;
    }

    // Count appointments per day
    weeklyAppointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date)
        .toISOString()
        .split("T")[0];
      if (dailyTrends[appointmentDate] !== undefined) {
        dailyTrends[appointmentDate]++;
      }
    });

    // Get all appointments with doctor data for specialty breakdown
    const appointments = await appointmentModel
      .find()
      .populate("doctor", "specialization");

    // Count appointments by specialty
    const specialtyCount = {};

    appointments.forEach((appointment) => {
      if (appointment.doctor && appointment.doctor.specialization) {
        const specialty = appointment.doctor.specialization;
        specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1;
      }
    });

    // Return all analytics data
    return res.status(200).send({
      success: true,
      message: "Successfully fetched complete analytics data",
      analytics: {
        totalCounts: {
          doctors: totalDoctors,
          patients: totalPatients,
          appointments: totalAppointments,
        },
        newThisWeek: {
          doctors: newDoctors,
          patients: newPatients,
          appointments: newAppointments,
        },
        appointmentTrends: dailyTrends,
        appointmentsBySpecialty: specialtyCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getCompleteAnalytics API",
      error,
    });
  }
};

module.exports = {
  getAllDoctors,
  getAllUsers,
  getAllAppointments,
  deleteUser,
  getAnalytics,
};
