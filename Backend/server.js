const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const socketAuth = require("./middlewares/socketAuth");
const { createServer } = require("http");

const app = express();
dotenv.config();

connectDB();
const userSocketIDs = new Map();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://chat-app.animeshsinha.info",
    "https://chat-app.animeshsinha.dev",
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

io.use((socket, next) => {
  socket.request,
    socket.request.res,
    async (err) => {
      await socketAuth(err, socket, next);
    };
  // next();
});

io.on("connection", (socket) => {
  const user = socket.user;
  // console.log("A user Connected", user);
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

    // console.log("New message:", members);
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

  socket.on("typing", ({ conversationId, members }) => {
    const memberSocket = members.map((member) => userSocketIDs.get(member));
    socket.to(memberSocket).emit("typing", { conversationId });
  });
  socket.on("stopTyping", ({ conversationId, members }) => {
    const memberSocket = members.map((member) => userSocketIDs.get(member));
    socket.to(memberSocket).emit("stopTyping", { conversationId });
  });

  socket.on("disconnect", () => {
    // console.log("A user disconnected");
    userSocketIDs.delete(user._id.toString());
    io.emit("onlineUsers", { userIDs: Array.from(userSocketIDs.keys()) });
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`The server is running on PORT: ${PORT}`);
});
