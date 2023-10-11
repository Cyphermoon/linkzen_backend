const User = require("../models/User");
const CustomError = require("../errors/custom_error");
const crypto = require("node:crypto");

const register = (req, res) => {
  const { username, email, password } = req.body;

  const emailExists = User.findOne({ email });
  if (emailExists) {
    throw new CustomError.BadRequestError(
      "sorry, user with this email already exist"
    );
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    username, email, password, verificationToken
  })

  // frontend origin
  const ORIGIN = process.env.ORIGIN

  // TODO: write logic to send verification mail
  
};

module.exports = register;
