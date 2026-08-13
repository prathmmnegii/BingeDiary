// ===============================
// VALIDATE USER REGISTRATION
// ===============================

const validateRegistration = (req, res, next) => {

  const { name, email, password } = req.body;


  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }


  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters"
    });
  }


  next();
};


// ===============================
// VALIDATE USER LOGIN
// ===============================

const validateLogin = (req, res, next) => {

  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }


  next();
};


// ===============================
// VALIDATE MOVIE
// ===============================

const validateMovie = (req, res, next) => {

  const {
    title,
    genre,
    year,
    rating,
    watched
  } = req.body;


  // At least one field must be provided
  if (
    title === undefined &&
    genre === undefined &&
    year === undefined &&
    rating === undefined &&
    watched === undefined
  ) {
    return res.status(400).json({
      message: "At least one movie field is required"
    });
  }


  // Validate title
  if (
    title !== undefined &&
    typeof title !== "string"
  ) {
    return res.status(400).json({
      message: "Title must be a string"
    });
  }


  // Validate genre
  if (
    genre !== undefined &&
    typeof genre !== "string"
  ) {
    return res.status(400).json({
      message: "Genre must be a string"
    });
  }


  // Validate year
  if (
    year !== undefined &&
    (!Number.isInteger(year) || year < 1800)
  ) {
    return res.status(400).json({
      message: "Year must be a valid number"
    });
  }


  // Validate rating
  if (
    rating !== undefined &&
    (typeof rating !== "number" ||
      rating < 0 ||
      rating > 10)
  ) {
    return res.status(400).json({
      message: "Rating must be between 0 and 10"
    });
  }


  // Validate watched
  if (
    watched !== undefined &&
    typeof watched !== "boolean"
  ) {
    return res.status(400).json({
      message: "Watched must be true or false"
    });
  }


  next();
};


// ===============================
// EXPORT
// ===============================

module.exports = {
  validateRegistration,
  validateLogin,
  validateMovie
};