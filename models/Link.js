const mongoose = require("mongoose");
const validator = require("validator");

const LinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 30,
      required: [true, "title is required"],
    },
    url: {
      type: String,
      validate: { validator: validator.isURL, message: "invalid url" },
      required: [true, "url is required"],
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    tags: {
      types: mongoose.Types.ObjectId,
      ref: "Tag",
    },
    accessType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "invalid authentication credentials"],
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Link", LinkSchema);
