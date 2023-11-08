const express = require("express");
const {
  getLinks,
  createNewLink,
  updateLink,
  deleteLink,
} = require("../controllers/link");
const router = express.Router();

router.get("/", getLinks);
router.post("/:username/links", createNewLink);
router.put("/:id", updateLink);
router.destroy("/:id", deleteLink);

module.exports = router;
