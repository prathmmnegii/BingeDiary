const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({
      message: "Name must contain at least 2 characters"
    });
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    return res.status(400).json({
      message: "Please provide a valid email"
    });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters"
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  next();
};

const validateMovie = (req, res, next) => {
  const {
    title,
    genre,
    year,
    rating,
    watched,
    posterUrl
  } = req.body;

  const hasField = [
    title,
    genre,
    year,
    rating,
    watched,
    posterUrl
  ].some((value) => value !== undefined);

  if (!hasField) {
    return res.status(400).json({
      message: "At least one movie field is required"
    });
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || !title.trim())
  ) {
    return res.status(400).json({
      message: "Title must be a non-empty string"
    });
  }

  if (
    genre !== undefined &&
    (typeof genre !== "string" || !genre.trim())
  ) {
    return res.status(400).json({
      message: "Genre must be a non-empty string"
    });
  }

  if (
    year !== undefined &&
    (
      !Number.isInteger(year) ||
      year < 1888 ||
      year > new Date().getFullYear() + 10
    )
  ) {
    return res.status(400).json({
      message: "Year must be a valid release year"
    });
  }

  if (
    rating !== undefined &&
    (
      typeof rating !== "number" ||
      rating < 0 ||
      rating > 10
    )
  ) {
    return res.status(400).json({
      message: "Rating must be between 0 and 10"
    });
  }

  if (
    watched !== undefined &&
    typeof watched !== "boolean"
  ) {
    return res.status(400).json({
      message: "Watched must be true or false"
    });
  }

  if (
    posterUrl !== undefined &&
    (
      typeof posterUrl !== "string" ||
      posterUrl.length > 1000
    )
  ) {
    return res.status(400).json({
      message: "posterUrl must be a valid string"
    });
  }

  next();
};

const validateWatch = (req, res, next) => {
  const {
    movie,
    rating,
    review,
    watchedDate
  } = req.body;

  if (
    movie === undefined &&
    rating === undefined &&
    review === undefined &&
    watchedDate === undefined
  ) {
    return res.status(400).json({
      message: "At least one watch field is required"
    });
  }

  if (
    movie !== undefined &&
    typeof movie !== "string"
  ) {
    return res.status(400).json({
      message: "Movie ID must be a string"
    });
  }

  if (
    rating !== undefined &&
    (
      typeof rating !== "number" ||
      rating < 0 ||
      rating > 10
    )
  ) {
    return res.status(400).json({
      message: "Rating must be between 0 and 10"
    });
  }

  if (
    review !== undefined &&
    (
      typeof review !== "string" ||
      review.length > 2000
    )
  ) {
    return res.status(400).json({
      message: "Review must be a string with at most 2000 characters"
    });
  }

  if (
    watchedDate !== undefined &&
    Number.isNaN(Date.parse(watchedDate))
  ) {
    return res.status(400).json({
      message: "watchedDate must be a valid date"
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateMovie,
  validateWatch
};