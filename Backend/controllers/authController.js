const { model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (existingUser)
      return res.status(409).send({
        success: false,
        message: "User already exists!",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;


    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    // const user = req.body;
    const user = await userModel.findOne({ email: req.body.email });
    console.log(user.role, user.role.length);
    console.log("BREAK");
    console.log(req.body.role, req.body.role.length);
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

module.exports = { registerController, loginController, getUserController };
