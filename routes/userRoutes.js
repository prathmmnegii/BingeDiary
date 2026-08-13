const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  validateRegistration,
  validateLogin
} = require("../middleware/validationMiddleware");

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/userController");


// ===============================
// REGISTER
// ===============================

router.post(
  "/register",
  validateRegistration,
  registerUser
);


// ===============================
// LOGIN
// ===============================

router.post(
  "/login",
  validateLogin,
  loginUser
);


// ===============================
// PROFILE
// ===============================

router.get(
  "/profile",
  authMiddleware,
  getProfile
);


module.exports = router;