const express = require("express");
const {
  getTags,
  createTag,
  updateTagName,
  deleteTag,
} = require("../controllers/tag");
const router = express.Router();

router.get("/", getTags);
router.post("/:username/tag", createTag);
router.put("/:id", updateTagName);
router.destroy("/:id", deleteTag);

module.exports = router;
