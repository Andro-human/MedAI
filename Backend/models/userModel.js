const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["admin", "user", "doctor"],
    },
    name: {
      String,
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
    email: {
      type: String,
      require: [true, "email is required"],
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
    },
    specialisation: {
      type: String,
      required: function () {
        if (this.role === "doctor") return true;
        return false;
      },
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
        if (this.rolee === "doctor") return true;
        return false;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
