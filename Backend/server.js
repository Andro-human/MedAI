const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const socketAuth = require("./middlewares/socketAuth");
const { createServer } = require("http");
const { v4: uuid } = require("uuid");
const messageModel = require("./models/messageModel");

const app = express();
dotenv.config();

connectDB();
const userSocketIDs = new Map();

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "https://medai-backend-kmqb.onrender.com/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// app.use(cors());

const server = createServer(app, {});
app.use(cors(corsOptions)); // Enable CORS

const io = new Server(server, {
  cors: corsOptions,
});
app.options("*", cors(corsOptions));
app.set("io", io);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/appointment", require("./routes/appointmentRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

io.use((socket, next) => {
  socketAuth(null, socket, next); // 'err' is null by default here
});

io.on("connection", (socket) => {
  const user = socket.user;
  "A user Connected", user;
  userSocketIDs.set(user._id.toString(), socket.id);

  io.emit("onlineUsers", { userIDs: Array.from(userSocketIDs.keys()) });
  socket.on("sendMessage", async ({ conversationId, message, members }) => {
    const newMessage = {
      message,
      _id: uuid(),
      senderId: { _id: user._id, name: user.name },
      conversation: conversationId,
      createdAt: new Date().toISOString(),
    };

    const messageForDb = {
      message,
      senderId: user._id,
      conversationId,
    };
    // Emit event to all members of the conversation
    const memberSocket = members.map((member) => userSocketIDs.get(member));
    io.to(memberSocket).emit("newMessage", {
      conversationId,
      message: newMessage,
    });

    try {
      await messageModel.create(messageForDb);
    } catch (error) {
      console.error("Error in saving message to db:", error);
    }
  });

  socket.on("disconnect", () => {
    // ("A user disconnected");
    userSocketIDs.delete(user._id.toString());
    io.emit("onlineUsers", { userIDs: Array.from(userSocketIDs.keys()) });
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  `The server is running on PORT: ${PORT}`;
});
