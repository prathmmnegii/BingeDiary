const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMovies,
  getMovieStats,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movieController");


// ===============================
// GET ALL MOVIES
// SEARCH + FILTER + SORT + PAGINATION
// ===============================

router.get("/", getMovies);


// ===============================
// GET MOVIE STATISTICS
// ===============================

router.get(
  "/stats/summary",
  authMiddleware,
  getMovieStats
);


// ===============================
// GET SINGLE MOVIE
// ===============================

router.get("/:id", getMovieById);


// ===============================
// CREATE MOVIE
// ===============================

router.post(
  "/",
  authMiddleware,
  createMovie
);


// ===============================
// UPDATE MOVIE
// ===============================

router.put(
  "/:id",
  authMiddleware,
  updateMovie
);


// ===============================
// DELETE MOVIE
// ===============================

router.delete(
  "/:id",
  authMiddleware,
  deleteMovie
);


module.exports = router;