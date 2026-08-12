const express = require("express");
const router = express.Router();

const Watch = require("../models/watch");
const Movie = require("../models/movie");

const authMiddleware = require("../middleware/authMiddleware");


// ===============================
// CREATE WATCH ENTRY
// ===============================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { movie, rating, review, watchedDate } = req.body;

    // Check movie exists
    const movieExists = await Movie.findById(movie);

    if (!movieExists) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    const watch = await Watch.create({
      movie,
      rating,
      review,
      watchedDate,
      user: req.user.userId
    });

    res.status(201).json(watch);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// GET MY WATCH HISTORY
// ===============================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const watches = await Watch.find({
      user: req.user.userId
    })
      .populate("movie")
      .sort({
        watchedDate: -1
      });

    res.json(watches);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// GET ONE WATCH ENTRY
// ===============================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const watch = await Watch.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate("movie");

    if (!watch) {
      return res.status(404).json({
        message: "Watch entry not found"
      });
    }

    res.json(watch);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// UPDATE WATCH ENTRY
// ===============================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const watch = await Watch.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("movie");

    if (!watch) {
      return res.status(404).json({
        message: "Watch entry not found"
      });
    }

    res.json(watch);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// ===============================
// DELETE WATCH ENTRY
// ===============================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const watch = await Watch.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!watch) {
      return res.status(404).json({
        message: "Watch entry not found"
      });
    }

    res.json({
      message: "Watch entry deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


module.exports = router;