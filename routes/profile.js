const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profile");
const router = express.Router();

router.get("/:username", getProfile);
router.put("/:username/edit", updateProfile);

module.exports = router;
