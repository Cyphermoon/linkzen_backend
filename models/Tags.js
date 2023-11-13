const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [20,"tag name should not be more than 20 characters"],
      required: [true, "name is required"],
    },
    links: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Link"
      }
    ]
  },
);

module.exports = mongoose.model("Tag", TagSchema);
