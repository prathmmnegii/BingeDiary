const express = require("express");
const router = express.Router();

const Movie = require("../models/movie");
const authMiddleware = require("../middleware/authMiddleware");


// ===============================
// GET ALL MOVIES
// ===============================

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();

    res.json(movies);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// GET SINGLE MOVIE
// ===============================

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.json(movie);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// CREATE MOVIE
// ===============================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      user: req.user.userId
    });

    res.status(201).json(movie);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// UPDATE MOVIE
// ===============================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found or you are not the owner"
      });
    }

    res.json(movie);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// DELETE MOVIE
// ===============================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found or you are not the owner"
      });
    }

    res.json({
      message: "Movie deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


module.exports = router;