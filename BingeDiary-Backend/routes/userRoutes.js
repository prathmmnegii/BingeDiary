const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  validateRegistration,
  validateLogin
} = require("../middleware/validationMiddleware");

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/userController");

router.post(
  "/register",
  validateRegistration,
  registerUser
);

router.post(
  "/login",
  validateLogin,
  loginUser
);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;