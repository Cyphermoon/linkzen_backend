const Tag = require("../models/Tag");
const { StatusCodes } = require("http-status-codes");

// TODO: add counts to tag
const getTags = async (req, res) => {
  const tags = await Tag.find({ createdBy: req.user.id });
  res.status(StatusCodes.OK).json({ success: true, data: tags });
};

const createTag = async (req, res) => {
  const { username } = req.params;
  if (username != req.user.username) {
    throw new BadRequestError("unable to create new link");
  }
  req.body.createdBy = req.user.id;
  const tag = await Tag.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "tag created successfully", data: tag });
};

const updateTagName = async (req, res) => {
  // tag's id
  const { id } = req.params;
  const { name } = req.body;

  const tag = await Tag.findOneAndUpdate(
    { _id: id, createdBy: req.user.id },
    { name, createdBy: req.user.id },
    { new: true, runValidators: true }
  );

  if (!tag) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "tag does not exist",
    });
  }

  res.status(StatusCodes.OK).json({ success: true, data: tag });
};

const deleteTag = async (req, res) => {
  // tag's id
  const { id } = req.params;
  req.body.createdBy = req.user.id;

  const tag = await Tag.findOneAndDelete({
    _id: id,
    createdBy: req.user.id,
  });

  if (!tag) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "tag does not exist" });
  }
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "tag has been deleted successfully" });
};
module.exports = { getTags, createTag, updateTagName, deleteTag };
