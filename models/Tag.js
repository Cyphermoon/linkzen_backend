const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [20, "tag name should not be more than 20 characters"],
    required: [true, "name is required"],
    lowercae: [true, "tag name must be lowercase"],
  },
  links: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Link",
    },
  ],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "invalid authentication credentials"],
  },
});

module.exports = mongoose.model("Tag", TagSchema);
