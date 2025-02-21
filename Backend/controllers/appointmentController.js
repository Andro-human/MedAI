const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");

const createAppointmentController = async (req, res) => {
  try {
    const { doctor, userId, timeslot } = req.body;
    // Fetch doctor and patient from the userModel
    const doctorData = await userModel.findById(doctor);
    const patientData = await userModel.findById(userId);
    
    console.log("doctor, userId, timeslot", doctor, userId, timeslot);
    // Check if doctor and patient exist
    if (!doctorData || !patientData) {
      return res.status(404).send({
        success: false,
        message: "Doctor or patient not found",
      });
    }

    // Role validation
    if (doctorData.role !== "doctor") {
      return res.status(400).send({
        success: false,
        message: "The selected user is not a doctor",
      });
    }

    if (patientData.role !== "user") {
      return res.status(400).send({
        success: false,
        message: "The selected user is not a patient",
      });
    }

    // Check for existing appointments
    const existingAppointmentOfDoctor = await appointmentModel.findOne({
      doctor,
      timeslot,
    });

    const existingAppointmentOfUser = await appointmentModel.findOne({
      patient: userId,
      timeslot,
    });

    if (existingAppointmentOfDoctor) {
      return res.status(409).send({
        success: false,
        message: "The doctor is not available at the specified time",
      });
    }

    if (existingAppointmentOfUser) {
      return res.status(409).send({
        success: false,
        message: "You have another appointment at the specified time",
      });
    }

    // Create and save the appointment
    const appointment = new appointmentModel({
      doctor,
      patient: userId,
      date: timeslot,
    });

    await appointment.save();

    return res.status(201).send({
      success: true,
      message: "New appointment created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Appointment API",
      error,
    });
  }
};

const getAppointmentController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      patient: req.body.userId,
    });
    return res.status(200).send({
      success: true,
      message: "Successfully fetched all appointments",
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getAppointment API",
      error,
    });
  }
};

const getDoctorController = async (req, res) => {
  try {
    const doctors = await userModel.find({
      role: "doctor",
      specialisation: req.body.specialisation,
    });

    const appointments = await appointmentModel.find({
      timeslot: req.body.timeslot,
    });

    const bookedDoctorIds = new Set(
      appointments.map((appointment) => appointment.doctor.toString())
    );

    const availableDoctors = doctors.filter(
      (doctor) => !bookedDoctorIds.has(doctor._id.toString())
    );

    return res.status(200).send({
      success: true,
      message: "Successfully fetched the available doctors",
      availableDoctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getDoctor API",
      error,
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (user.role != 'admin') {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      })
    }
    
    const doctors = await userModel.find({role: "doctor"})
    return res.status(200).send({
      success: true,
      message: "Successfully fetched all the doctors",
      doctors
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getAllDoctors API",
      error
    })
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (user.role != 'admin') {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      })
    }
    const users = await userModel.find({role: "user"})
    return res.status(200).send({
      success: true,
      message: "Successfully fetched all the users",
      users
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getAllUsers API",
      error
    })
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (user.role != 'admin') {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      })
    }
    const appointments = await appointmentModel.find();
    return res.status(200).send({
      success: true,
      message: "Successfully fetched all the Appointments",
      appointments
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getAllAppointments API",
      error
    })
  }
};

module.exports = {
  createAppointmentController,
  getAppointmentController,
  getDoctorController,
  getAllDoctors,
  getAllUsers,
  getAllAppointments,
};
