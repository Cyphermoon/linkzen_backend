const BadRequestError = require("../errors/bad_request");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { uploadImage, createImageTag } = require("../utils/handleImageUpload");

// TODO: fix empty profile field return data
const getProfile = async (req, res) => {
  const { username } = req.params;
  if (username != req.user.username) {
    throw new BadRequestError("invalid credentials");
  }
  const user = await User.findOne({ username });
  res.status(StatusCodes.OK).json({ success: true, user: user.profile });
};

const updateProfile = async (req, res) => {
  const { username } = req.params;
  const { firstname, lastname, bio, avatar, socials } = req.body;
  if (username != req.user.username) {
    throw new BadRequestError("invalid credentials");
  }
  const user = await User.findOne({ username });

  // upload to cloudinary
  const public_id = await uploadImage(avatar);
  const avatar_url = await createImageTag(public_id);

  (user.profile.firstName = firstname),
    (user.profile.lastName = lastname),
    (user.profile.bio = bio),
    (user.profile.avatar = avatar_url),
    (user.profile.socials = socials);

  await user.save();
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { updateProfile, getProfile };
