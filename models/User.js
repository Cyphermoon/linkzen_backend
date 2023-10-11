const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "please provide a username"],
      unique: [true, "sorry, this username has been taken"],
      match: [
        /^[a-zA-Z0-9]+$/,
        "sorry, username cannot contain special characters",
      ],
      minlength: [3, "username cannot be less than 3 characters"],
      maxlength: [20, "username cannot be more than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      unique: [true, "sorry, a user with this email already exist"],
      validate: {
        validator: validator.isEmail,
        message: "please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "password cannot be less than 6 characters"],
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String,
      socials: {
        instagram: String,
        youtube: String,
        Spotify: String,
        tiktok: String,
        facebook: String,
      },
    },
    active: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamp: true }
);

// other logics here
module.exports = mongoose.model("User", UserSchema);
