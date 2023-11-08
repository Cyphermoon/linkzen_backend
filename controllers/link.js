const BadRequestError = require("../errors/bad_request");
const Link = require("../models/Link");
const { StatusCodes } = require("http-status-codes");


// dashboard links
const getLinks = async (req, res) => {
  const links = await Link.find({ createdBy: req.user.id });
  if (links.length === 0) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "oops, seems you have not created any link yet",
      count: jobs.length,
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, data: links, count: links.length });
};

const createNewLink = async (req, res) => {
  const { username } = req.params;
  if (username != req.user.username) {
    throw new BadRequestError("unable to create new link");
  }

  req.body.createdBy = req.user.id;
  const link = await Link.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "link created successfully", data: link });
};

const updateLink = async (req, res) => {
  // id of the link
  const { id } = req.params;

  req.body.createdBy = req.user.id;
  const link = await Link.findOneAndUpdate(
    { _id: id, createdBy: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!link) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "unable to update link",
    });
  }
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "link updated successfully", data: link });
};

const deleteLink = async (req, res) => {
  const { id } = req.params;
  req.body.createdBy = req.user.id;

  const link = await Link.findByIdAndRemove({
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

module.exports = { createNewLink, updateLink, deleteLink, getLinks };
