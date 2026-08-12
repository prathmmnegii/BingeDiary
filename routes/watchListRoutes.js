const express = require("express");
const router = express.Router();

const Watchlist = require("../models/watchlist");
const Movie = require("../models/movie");

const authMiddleware = require("../middleware/authMiddleware");


// ===============================
// ADD MOVIE TO WATCHLIST
// ===============================

router.post("/:movieId", authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    const existingMovie = await Watchlist.findOne({
      movie: movie._id,
      user: req.user.userId
    });

    if (existingMovie) {
      return res.status(400).json({
        message: "Movie already exists in your watchlist"
      });
    }

    const watchlistItem = await Watchlist.create({
      movie: movie._id,
      user: req.user.userId
    });

    const populatedItem = await Watchlist.findById(
      watchlistItem._id
    ).populate("movie");

    res.status(201).json({
      message: "Movie added to watchlist",
      watchlistItem: populatedItem
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// GET MY WATCHLIST
// ===============================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({
      user: req.user.userId
    })
      .populate("movie")
      .sort({
        createdAt: -1
      });

    res.json(watchlist);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// REMOVE MOVIE FROM WATCHLIST
// ===============================

router.delete("/:movieId", authMiddleware, async (req, res) => {
  try {
    const deletedItem = await Watchlist.findOneAndDelete({
      movie: req.params.movieId,
      user: req.user.userId
    });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Movie not found in your watchlist"
      });
    }

    res.json({
      message: "Movie removed from watchlist"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


module.exports = router;