const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signUpUser);
router.post("/signin", authController.siginUser);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
