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

module.exports = {
  getAllDoctors,
  getAllUsers,
  getAllAppointments,
  deleteUser,
};
