const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");

const socketAuth = async (err, socket, next) => {
    try {
        if (err) {
            return next(err);
        }
        const token = socket.request.cookies["Login-token"];
        if (!token) {
            return next(new Error("Please Login to access"));
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.userId);
        // console.log("User connected: ", user.name);
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.user = user;
        return next();
    } catch (error) {
        return next(new Error("Authentication error"), 401);
    }
    
}

module.exports = socketAuth;