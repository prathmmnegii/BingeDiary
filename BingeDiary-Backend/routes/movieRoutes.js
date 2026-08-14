const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  validateMovie
} = require("../middleware/validationMiddleware");

const {
  getMovies,
  getMovieStats,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movieController");

router.use(authMiddleware);

router.get("/", getMovies);

router.get(
  "/stats/summary",
  getMovieStats
);

router.get("/:id", getMovieById);

router.post(
  "/",
  validateMovie,
  createMovie
);

router.put(
  "/:id",
  validateMovie,
  updateMovie
);

router.delete(
  "/:id",
  deleteMovie
);

module.exports = router;