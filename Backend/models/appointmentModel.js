const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Patient is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  timeslot: {
    type: String,
    required: [true, "Timeslot is required"],
    enum: [
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
    ],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "doctor is required"],
  },
});
module.exports = mongoose.model("appointment", appointmentSchema);
