const Watchlist = require("../models/watchlist");


// ===============================
// GET WATCHLIST
// ===============================

const getWatchlist = async (req, res, next) => {
  try {

    const watchlist = await Watchlist.find({
      user: req.user.userId
    }).populate("movie");


    res.json(watchlist);


  } catch (error) {

    next(error);

  }
};


// ===============================
// ADD MOVIE TO WATCHLIST
// ===============================

const addToWatchlist = async (req, res, next) => {
  try {

    const { movie } = req.body;


    if (!movie) {
      return res.status(400).json({
        message: "Movie ID is required"
      });
    }


    const existingMovie = await Watchlist.findOne({
      movie,
      user: req.user.userId
    });


    if (existingMovie) {
      return res.status(400).json({
        message: "Movie already exists in watchlist"
      });
    }


    const watchlistItem = await Watchlist.create({
      movie,
      user: req.user.userId
    });


    const populatedItem = await Watchlist.findById(
      watchlistItem._id
    ).populate("movie");


    res.status(201).json(populatedItem);


  } catch (error) {

    next(error);

  }
};


// ===============================
// REMOVE MOVIE FROM WATCHLIST
// ===============================

const removeFromWatchlist = async (req, res, next) => {
  try {

    const watchlistItem = await Watchlist.findOneAndDelete({
      movie: req.params.movieId,
      user: req.user.userId
    });


    if (!watchlistItem) {
      return res.status(404).json({
        message: "Movie not found in watchlist"
      });
    }


    res.json({
      message: "Movie removed from watchlist successfully"
    });


  } catch (error) {

    next(error);

  }
};


// ===============================
// EXPORT CONTROLLERS
// ===============================

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};