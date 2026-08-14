const mongoose = require("mongoose");

const Watchlist = require("../models/watchlist");
const Movie = require("../models/movie");

const getWatchlist = async (
  req,
  res,
  next
) => {
  try {
    const watchlist =
      await Watchlist.find({
        user: req.user.userId
      })
        .populate("movie")
        .sort({
          createdAt: -1
        });

    return res.json(watchlist);
  } catch (error) {
    next(error);
  }
};

const addToWatchlist = async (
  req,
  res,
  next
) => {
  try {
    const { movie } = req.body;

    if (
      !movie ||
      !mongoose.isValidObjectId(movie)
    ) {
      return res.status(400).json({
        message:
          "A valid movie ID is required"
      });
    }

    const movieExists =
      await Movie.findOne({
        _id: movie,
        user: req.user.userId
      });

    if (!movieExists) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    const existingItem =
      await Watchlist.findOne({
        movie,
        user: req.user.userId
      });

    if (existingItem) {
      return res.status(409).json({
        message:
          "Movie already exists in watchlist"
      });
    }

    const item =
      await Watchlist.create({
        movie,
        user: req.user.userId
      });

    const populatedItem =
      await Watchlist.findById(
        item._id
      ).populate("movie");

    return res.status(201).json(
      populatedItem
    );
  } catch (error) {
    next(error);
  }
};

const removeFromWatchlist = async (
  req,
  res,
  next
) => {
  try {
    const item =
      await Watchlist.findOneAndDelete({
        movie: req.params.movieId,
        user: req.user.userId
      });

    if (!item) {
      return res.status(404).json({
        message:
          "Movie not found in watchlist"
      });
    }

    return res.json({
      message:
        "Movie removed from watchlist successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};