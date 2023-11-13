const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "please provide a username"],
      unique: true,
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
      unique: true,
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
      firstName: {
        type: String,
        maxlength: [15, "firstname cannot be more than 15 characters"],
        default: "",
      },
      lastName: {
        type: String,
        maxlength: [15, "lastname cannot be more than 15 characters"],
        default: "",
      },

      //TODO: collect for the default avatar image url
      avatar: {
        type: String,
        default: "",
      },
      bio: {
        type: String,
        maxlength: [250, "bio cannot be more than 250 characters"],
        default: "",
      },
      socials: {
        instagram: {
          type: String,
          default: "",
        },
        youtube: {
          type: String,
          default: "",
        },
        spotify: {
          type: String,
          default: "",
        },
        tiktok: {
          type: String,
          default: "",
        },
        facebook: {
          type: String,
          default: "",
        },
      },
      layoutPreference: {
        type: String,
        enum: ["list", "grid"],
        default: "list",
      },
    },
    active: { type: Boolean, default: false },
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
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamp: true }
);

// hash password before saving to database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// login a user
UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_LIFETIME = process.env.JWT_LIFETIME;
// create jwt
UserSchema.methods.createJWT = async function () {
  return jwt.sign(
    { id: this._id, username: this.username, role: this.role },
    JWT_SECRET,
    {
      expiresIn: JWT_LIFETIME,
    }
  );
};
module.exports = mongoose.model("User", UserSchema);
