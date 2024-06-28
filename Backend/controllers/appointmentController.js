const appointmentModel = require("../models/appointmentModel");

const createAppointmentControler = async (req, res) => {
  try {
    const existingAppointment = await appointmentModel.findOne({
      doctor: req.body.doctor,
      timeSlot: req.body.timeSlot,
    });
    if (existingAppointment)
      return res.status(409).send({
        success: false,
        message: "An appointment already exists at the specified time!",
      });
    
    const appointment = new appointmentModel(req.body)
    await appointment.save()
    return res.status(201).send({
        success: true,
        message: 'New appointment created'
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Appointment API",
      error,
    });
  }
};

module.exports = { createAppointmentControler };
