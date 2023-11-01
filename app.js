require("dotenv").config();
require("express-async-errors");

// third party
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const isUserAuthenticated = require("./middlewares/isAuthenticated");

// cloudinary
const cloudinary = require("cloudinary").v2;

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

// environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/v1/auth", authRouter);
app.use("api/v1/profile", isUserAuthenticated, profileRouter);

app.use(errorHandlerMiddleware);

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
