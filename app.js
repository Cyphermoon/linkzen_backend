require("dotenv").config();
require("express-async-errors");

// third party
const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const authRouter = require("./routes/auth");

// environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());

app.use(errorHandlerMiddleware);

// routes
app.use("/api/v1/auth", authRouter);

const start = async () => {
  try {
    await connectDB(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

start();
