const express = require("express");
const { getMessages } = require("../controllers/messageController");

const authMiddleware = require("../middlewares/authMiddleware");

const app = express.Router();

// Get messages
app.get("/:id", authMiddleware, getMessages);

module.exports = app;
