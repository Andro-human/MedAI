const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

const socketAuth = async (err, socket, next) => {
  try {
    const token = socket.handshake.query.token;
    if (!token) return next(new Error("Please login to access"));

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);

    if (!user) return next(new Error("User not found"));

    socket.user = user;
    next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
};

module.exports = socketAuth;
