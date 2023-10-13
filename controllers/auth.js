const User = require("../models/User");
const UnAunthenticatedError = require("../errors/unauthenticated");
const crypto = require("node:crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    username,
    email,
    password,
    verificationToken,
  });

  // frontend url
  const origin = process.env.ORIGIN;

  await sendVerificationEmail({
    username: user.username,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: origin,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "Success! Please check your email to verify account",
    token: verificationToken, //only for postman testing!
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAunthenticatedError("invalid credentials");
  }

  if (verificationToken != user.verificationToken) {
    throw new UnAunthenticatedError("invalid credentials");
  }
  (user.isVerified = true), (user.active = true);
  user.verified = Date.now();
  user.verificationToken = "";

  // save the user
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

module.exports = { register, verifyEmail };
