const BadRequestError = require("../errors/bad_request");
const Link = require("../models/Link");
const Tag = require("../models/Tag");
const User = require("../models/User");
const applySort = require("../utils/applySortCriteria");
const { StatusCodes } = require("http-status-codes");

// dashboard links
const getLinks = async (req, res) => {
  const { sort, layoutOption } = req.query;

  const sortCriteria = applySort(sort);

  // update the user's layout preference
  if (layoutOption) {
    const user = await User.findById({ _id: req.user.id });
    user.profile.layoutPreference = layoutOption;
  }

  // get the links
  const links = await Link.find({ createdBy: req.user.id })
    .sort(sortCriteria)
    .populate("tags");
  if (links.length === 0) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "oops, seems you have not created any link yet",
      count: links.length,
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, data: links, count: links.length });
};

const getLinksByTag = async (req, res) => {
  const { sort, layoutOption } = req.query;
  const sortCriteria = applySort(sort);

  // update the user's layout preference
  if (layoutOption) {
    const user = await User.findById({ _id: req.user.id });
    user.profile.layoutPreference = layoutOption;
  }

  // tag's id
  const { id } = req.params;
  const links = await Link.find({ createdBy: req.user.id, tags: id }).sort(
    sortCriteria
  );

  res.status(StatusCodes.OK).json({ success: true, data: links });
};

const createNewLink = async (req, res) => {
  const { username } = req.params;

  if (username != req.user.username) {
    throw new BadRequestError("unable to create new link");
  }
  const tagNames = req.body.tags || [];

  let tagIds = [];

  for (const tagName of tagNames) {
    // check if tags exist
    let tag = await Tag.findOne({ name: tagName });

    // create new tags, if tags doesn't exist
    if (!tag) {
      tag = await Tag.create({ name: tagName });
    }

    // Add the tag to the array
    tagIds.push(tag._id);
  }

  req.body.tags = tagIds;

  req.body.createdBy = req.user.id;
  const link = await Link.create(req.body);

  // update the tags with the new link's ID
  await Tag.updateMany(
    { _id: { $in: tagIds } },
    { $push: { links: link._id } }
  );
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "link created successfully", data: link });
};

const updateLink = async (req, res) => {
  // id of the link
  const { id } = req.params;

  let existingLink = await Link.findOne({ _id: id, createdBy: req.user.id });
  if (!existingLink) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "link does not exist",
    });
  }

  // assign user to body
  req.body.createdBy = req.user.id;

  const newLink = await Link.findOneAndUpdate(
    { _id: id, createdBy: req.user.id },
    {
      $set: {
        title: req.body.title || existingLink.title,
        url: req.body.url || existingLink.url,
        description: req.body.description || existingLink.description,
      },
      $addToSet: { tags: { $each: req.body.tags || existingLink.tags || [] } },
    },

    { new: true, runValidators: true }
  );

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "link updated successfully", data: newLink });
};

const deleteLink = async (req, res) => {
  const { id } = req.params;
  req.body.createdBy = req.user.id;

  const link = await Link.findOneAndDelete({
    _id: id,
    createdBy: req.user.id,
  });

  if (!link) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "unable to delete link" });
  }
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "link has been deleted successfully" });
};

module.exports = {
  createNewLink,
  updateLink,
  deleteLink,
  getLinks,
  getLinksByTag,
};
