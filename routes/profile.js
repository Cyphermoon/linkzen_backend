const express = require("express");
const updateProfile = require("../controllers/profile");
const router = express.Router();

router.get("/:username").put("/:username/edit", updateProfile);

module.exports = router;
