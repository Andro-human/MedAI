const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getMyConversations,
  getConversationDetails,
  createConversation,
  deleteConversation,
} = require("../controllers/conversationController");

const app = express.Router();

// Get all conversations for the sideBar
app.use("/my", authMiddleware, getMyConversations); 

// Create a new conversation
app.post("/create/", authMiddleware, createConversation);



// Get conversation details and delete conversation
app
  .route("/:id")
  .all(authMiddleware)
  .get(getConversationDetails)
  .delete(deleteConversation); 

module.exports = app;
