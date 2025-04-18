const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["admin", "user", "doctor"],
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: function () {
        if (this.role === "user" || this.role === "doctor") return true;
        return false;
      },
      min: 0,
    },
    gender: {
      type: String,
      required: function () {
        if (this.role === "user" || this.role === "doctor") return true;
        return false;
      },
      enum: ["male", "female"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
      min: 8,
    },

    phone: {
      type: String,
      required: function () {
        if (this.role === "user" || this.role === "doctor") return true;
        return false;
      },
      min: 10,
    },
    specialization: {
      type: String,
      required: function () {
        if (this.role === "doctor") return true;
        return false;
      },
      enum: [
        "General Medicine",
        "Cardiology",
        "Dermatology",
        "Orthopedics",
        "Neurology",
        "Pediatrics",
        "Gynecology",
        "Ophthalmology",
        "ENT specialist",
        "Psychiatry",
        "Dentistry",
      ],
    },

    education: {
      type: String,
      required: function () {
        if (this.role === "doctor") return true;
        return false;
      },
    },
    experience: {
      type: Number,
      required: function () {
        if (this.role === "doctor") return true;
        return false;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
