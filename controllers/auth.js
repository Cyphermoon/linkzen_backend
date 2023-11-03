const User = require("../models/User");
const UnAunthenticatedError = require("../errors/unauthenticated");
const BadRequestError = require("../errors/bad_request");
const crypto = require("node:crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const {
  attachTokenToResponse,
  removeTokenFromResponse,
} = require("../utils/handleCookies");
const { StatusCodes } = require("http-status-codes");
const { createHash } = require("node:crypto");

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

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAunthenticatedError("invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAunthenticatedError("please enter correct login details");
  }

  if (!user.isVerified) {
    throw new UnAunthenticatedError("please verify your email");
  }

  // create jwt for user
  const token = await user.createJWT();

  // add token to response as a cookie
  attachTokenToResponse(res, token);
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "login successful",
    user: { id: user._id, username: user.username, accessToken: token },
  });
};

// TODO: add conditional to check for Bearer {{token}}
const logout = (req, res) => {
  removeTokenFromResponse(res);
  res.status(StatusCodes.OK).json({ msg: "logged out successful" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAunthenticatedError("no user found with this email");
  }

  //generate reset password token
  const forgotPasswordToken = crypto.randomBytes(70).toString("hex");

  // send password reset mail
  await sendResetPasswordEmail({
    email: user.email,
    origin: process.env.ORIGIN,
    username: user.username,
    token: forgotPasswordToken,
  });

  const tenMinutes = 1000 * 60 * 10;
  const forgotPasswordTokenExpirationDate = new Date(Date.now() + tenMinutes);
  user.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotPasswordToken)
    .digest("hex");

  user.forgotPasswordTokenExpirationDate = forgotPasswordTokenExpirationDate;
  await user.save();

  // send verification token back only while testing in postman!!!
  res.status(StatusCodes.OK).json({
    msg: "Please check your email for reset password link",
    token: forgotPasswordToken,
  });
};

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  if (!token) {
    throw new BadRequestError("invalid token");
  }

  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();

    if (
      user.forgotPasswordToken ===
        crypto.createHash("sha256").update(token).digest("hex") &&
      user.forgotPasswordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.forgotPasswordToken = null;
      user.forgotPasswordTokenExpiration = null;
      await user.save();
    } else {
      throw new BadRequestError("invalid token");
    }
  }

  res.status(StatusCodes.OK).json({
    msg: "password reset successful",
  });
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
