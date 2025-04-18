const { model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const registerController = async (req, res) => {
  try {
    const {
      name,
      age,
      email,
      password,
      phone,
      role,
      gender,
      specialization,
      experience,
      education,
    } = req.body;
    console.log("name, age, email", req.body);
    // Basic field validation
    if (!name || !email || !password || !role) {
      return res.status(400).send({
        success: false,
        message: "Name, Email, Password, and Role are required.",
      });
    }

    // Role-based validations
    if ((role === "user" || role === "doctor") && (!age || !gender || !phone)) {
      return res.status(400).send({
        success: false,
        message: "Age, Gender, and Phone are required for users and doctors.",
      });
    }

    if (role === "doctor" && (!specialization || !experience || !education)) {
      return res.status(400).send({
        success: false,
        message: "Specialization, Experience, and Education are required for doctors.",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists!",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const user = new userModel({
      name,
      age,
      email,
      password: hashedPassword,
      phone,
      role,
      gender,
      specialization,
      experience,
      education,
    });

    // Save the user
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
      token
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Register API",
      error: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    // const user = req.body;
    const user = await userModel.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });

    if (user.role !== req.body.role) {
      return res.status(401).send({
        success: false,
        message: "Role doesn't match",
      });
    }

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    console.log("reached", user.password);
    if (!comparePassword) {
      return res.status(401).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).send({
      success: true,
      message: "Logged in Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

const getUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    // console.log(req.body.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // console.log(user);
    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getUser API",
      error,
    });
  }
};

const deleteController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (user?.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }
    
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: " Record Deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while deleting ",
      error,
    });
  }
};

module.exports = { registerController, loginController, getUserController, deleteController };
