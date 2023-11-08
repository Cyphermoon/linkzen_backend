const BadRequestError = require("../errors/bad_request");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { uploadImage, createImageTag } = require("../utils/handleImageUpload");
const Link = require("../models/Link");

// TODO: fix empty profile field return data
// TODO: create controller for dashboard request
const getProfile = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  const links = Link.find({createdBy:req.user.id})
  
  res.status(StatusCodes.OK).json({ success: true, user: user.profile, links });
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
