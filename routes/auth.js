const express = require("express");
const { register, verifyEmail } = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);

module.exports = router;
