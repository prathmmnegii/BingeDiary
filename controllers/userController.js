const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");


// ===============================
// REGISTER USER
// ===============================

const registerUser = async (req, res, next) => {
  try {

    const { name, email, password } = req.body;


    const existingUser = await User.findOne({
      email
    });


    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }


    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });


    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });


  } catch (error) {

    next(error);

  }
};


// ===============================
// LOGIN USER
// ===============================

const loginUser = async (req, res, next) => {
  try {

    const { email, password } = req.body;


    const user = await User.findOne({
      email
    });


    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }


    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }


    const token = jwt.sign(
      {
        userId: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d"
      }
    );


    res.json({
      message: "Login successful",
      token
    });


  } catch (error) {

    next(error);

  }
};


// ===============================
// GET PROFILE
// ===============================

const getProfile = async (req, res, next) => {
  try {

    const user = await User.findById(
      req.user.userId
    ).select("-password");


    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    res.json(user);


  } catch (error) {

    next(error);

  }
};


// ===============================
// EXPORT
// ===============================

module.exports = {
  registerUser,
  loginUser,
  getProfile
};