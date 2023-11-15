const express = require("express");
const {
  getLinks,
  getLinksByTag,
  createNewLink,
  updateLink,
  deleteLink,
} = require("../controllers/link");
const router = express.Router();

router.get("/", getLinks);
router.get("/:id/tag-links", getLinksByTag);
router.post("/:username/link", createNewLink);
router.put("/:id", updateLink);
router.destroy("/:id", deleteLink);

module.exports = router;
