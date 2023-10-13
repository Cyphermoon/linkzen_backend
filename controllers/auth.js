const User = require("../models/User");
const CustomError = require("../errors/custom_error");
const crypto = require("node:crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new CustomError.BadRequestError(
      "sorry, user with this email already exist"
    );
  }

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
    token: user.verificationToken,
    origin: origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
    token: verificationToken, //only for postman testing!
  });
};

module.exports = register;
