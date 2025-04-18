const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");

// Available timeslots
const AVAILABLE_TIMESLOTS = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

// Check if patient has existing appointment at the specified time
const isPatientAvailable = async (patientId, date, timeslot) => {
  // Format date to YYYY-MM-DD for comparison

  // Check if patient has another appointment at the same time
  const existingAppointment = await appointmentModel.findOne({
    patient: patientId,
    date: {
      $gte: new Date(`${date}T00:00:00.000Z`),
      $lt: new Date(`${date}T23:59:59.999Z`),
    },
    timeslot,
  });

  // Return true if patient has no existing appointment
  return !existingAppointment;
};

const isDoctorAvailable = async (doctorId, date, time) => {
  const existingAppointment = await appointmentModel.findOne({
    doctor: doctorId,
    date: {
      $gte: new Date(`${date}T00:00:00.000Z`),
      $lt: new Date(`${date}T23:59:59.999Z`),
    },
    timeslot: time,
  });

  return !existingAppointment;
};

const createAppointmentController = async (req, res) => {
  try {
    const { doctor, userId, date, time } = req.body;
    console.log("print", req.body);
    console.log("available timeslots", AVAILABLE_TIMESLOTS);

    // Validate the time against available timeslots
    if (!AVAILABLE_TIMESLOTS.includes(time)) {
      return res.status(400).send({
        success: false,
        message:
          "Invalid appointment time. Please select from available timeslots.",
      });
    }

    // Fetch doctor and patient from the userModel
    const doctorData = await userModel.findById(doctor);
    const patientData = await userModel.findById(userId);

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

    // Check if patient is available
    const patientAvailable = await isPatientAvailable(userId, date, time);
    if (!patientAvailable) {
      return res.status(409).send({
        success: false,
        message: "You have another appointment at the specified time",
      });
    }

    const doctorAvailable = await isDoctorAvailable(doctor, date, time);
    if (!doctorAvailable) {
      return res.status(409).send({
        success: false,
        message: "The doctor is not available at the specified time",
      });
    }

    // Convert date string to Date object
    const appointmentDate = new Date(`${date}T00:00:00.000Z`);

    // Create and save the appointment
    const appointment = new appointmentModel({
      doctor,
      patient: userId,
      date: appointmentDate,
      timeslot: time,
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

// Get available timeslots for a doctor on a specific date
const getAvailableTimeslotsController = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    // Validate doctor existence
    const doctor = await userModel.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    // Find all appointments for the doctor on the specified date
    const bookedAppointments = await appointmentModel.find({
      doctor: doctorId,
      date: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lt: new Date(`${date}T23:59:59.999Z`),
      },
    });

    // Get all booked timeslots
    const bookedTimeslots = bookedAppointments.map(
      (appointment) => appointment.timeslot
    );

    // Filter available timeslots
    const availableTimeslots = AVAILABLE_TIMESLOTS.filter(
      (timeslot) => !bookedTimeslots.includes(timeslot)
    );

    return res.status(200).send({
      success: true,
      message: "Successfully fetched available timeslots",
      availableTimeslots,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getAvailableTimeslots API",
      error,
    });
  }
};

const getPatientAppointmentController = async (req, res) => {
  try {
    // Find appointments for the patient with populated doctor information
    const appointments = await appointmentModel
      .find({
        patient: req.body.userId,
      })
      .populate("doctor", "name specialization email phone");

    return res.status(200).send({
      success: true,
      message: "Successfully fetched all appointments",
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getPatientAppointment API",
      error,
    });
  }
};

const getDoctorAppointmentController = async (req, res) => {
  try {
    // Find appointments for the doctor with populated patient information
    const appointments = await appointmentModel
      .find({
        doctor: req.body.userId,
      })
      .populate("patient", "name email phone age gender");

    return res.status(200).send({
      success: true,
      message: "Successfully fetched all appointments",
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getDoctorAppointment API",
      error,
    });
  }
};

const getDoctorController = async (req, res) => {
  try {
    const { specialization } = req.body;

    // Find doctors with the specified specialization
    const doctors = await userModel.find({
      role: "doctor",
      specialization,
    });

    // Get IDs of all doctors with the specified specialization
    // const doctorIds = doctors.map((doctor) => doctor._id);

    return res.status(200).send({
      success: true,
      message: "Successfully fetched the available doctors",
      doctors: doctors,
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
      .populate("doctor", "name email phone specialization")
      .populate("patient", "name email phone");

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

// Get all available timeslots
const getAllTimeslotsController = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Successfully fetched all timeslots",
      timeslots: AVAILABLE_TIMESLOTS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getAllTimeslots API",
      error,
    });
  }
};

// Cancel appointment function
const cancelAppointmentController = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;

    // Find the appointment
    const appointment = await appointmentModel.findById(appointmentId);

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the user is the patient who booked the appointment
    if (appointment.patient.toString() !== userId) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to cancel this appointment",
      });
    }

    // Delete the appointment
    await appointmentModel.findByIdAndDelete(appointmentId);

    return res.status(200).send({
      success: true,
      message: "Appointment canceled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in cancelAppointment API",
      error,
    });
  }
};

// Reschedule appointment function
const rescheduleAppointmentController = async (req, res) => {
  try {
    const { appointmentId, userId, date, time } = req.body;

    // Validate the time against available timeslots
    if (!AVAILABLE_TIMESLOTS.includes(time)) {
      return res.status(400).send({
        success: false,
        message:
          "Invalid appointment time. Please select from available timeslots.",
      });
    }

    // Find the appointment
    const appointment = await appointmentModel.findById(appointmentId);

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the user is the patient who booked the appointment
    if (appointment.patient.toString() !== userId) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to reschedule this appointment",
      });
    }

    // Check if doctor is available at the new time
    const doctorAvailable = await isDoctorAvailable(
      appointment.doctor,
      date,
      time
    );
    if (!doctorAvailable) {
      return res.status(409).send({
        success: false,
        message: "The doctor is not available at the specified time",
      });
    }

    // Check if patient has another appointment at the new time
    const patientAvailable = await isPatientAvailable(userId, date, time);
    if (!patientAvailable) {
      return res.status(409).send({
        success: false,
        message: "You have another appointment at the specified time",
      });
    }

    // Update the appointment with new date and time
    const appointmentDate = new Date(`${date}T00:00:00.000Z`);

    appointment.date = appointmentDate;
    appointment.timeslot = time;
    await appointment.save();

    return res.status(200).send({
      success: true,
      message: "Appointment rescheduled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in rescheduleAppointment API",
      error,
    });
  }
};

module.exports = {
  createAppointmentController,
  getPatientAppointmentController,
  getDoctorAppointmentController,
  getDoctorController,
  getAllDoctors,
  getAllUsers,
  getAllAppointments,
  getAvailableTimeslotsController,
  getAllTimeslotsController,
  cancelAppointmentController,
  rescheduleAppointmentController,
};
