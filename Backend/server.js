const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan")
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
dotenv.config();

connectDB();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

// app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`The server is running on PORT: ${PORT}`);
});
