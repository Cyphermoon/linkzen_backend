require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./db/connect");

// environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.PORT;

const app = express();

try {
  await connectDB(MONGODB_URI);
  app.listen((PORT) => {
    console.log(`server is listening on port ${PORT}`);
  });
} catch (error) {
  console.log(error.message);
}
