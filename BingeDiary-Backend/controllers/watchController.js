const mongoose = require("mongoose");

const Watch = require("../models/watch");
const Movie = require("../models/movie");

const getWatches = async (
  req,
  res,
  next
) => {
  try {
    const watches = await Watch.find({
      user: req.user.userId
    })
      .populate("movie")
      .sort({
        watchedDate: -1,
        createdAt: -1
      });

    return res.json(watches);
  } catch (error) {
    next(error);
  }
};

const getWatchById = async (
  req,
  res,
  next
) => {
  try {
    const watch = await Watch.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate("movie");

    if (!watch) {
      return res.status(404).json({
        message: "Watch record not found"
      });
    }

    return res.json(watch);
  } catch (error) {
    next(error);
  }
};

const createWatch = async (
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

    const watch = await Watch.create({
      ...req.body,
      user: req.user.userId
    });

    const populatedWatch =
      await Watch.findById(
        watch._id
      ).populate("movie");

    return res.status(201).json(
      populatedWatch
    );
  } catch (error) {
    next(error);
  }
};

const updateWatch = async (
  req,
  res,
  next
) => {
  try {
    if (req.body.movie !== undefined) {
      if (
        !mongoose.isValidObjectId(
          req.body.movie
        )
      ) {
        return res.status(400).json({
          message: "Invalid movie ID"
        });
      }

      const movieExists =
        await Movie.findOne({
          _id: req.body.movie,
          user: req.user.userId
        });

      if (!movieExists) {
        return res.status(404).json({
          message: "Movie not found"
        });
      }
    }

    const watch =
      await Watch.findOneAndUpdate(
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
        message: "Watch record not found"
      });
    }

    return res.json(watch);
  } catch (error) {
    next(error);
  }
};

const deleteWatch = async (
  req,
  res,
  next
) => {
  try {
    const watch =
      await Watch.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId
      });

    if (!watch) {
      return res.status(404).json({
        message: "Watch record not found"
      });
    }

    return res.json({
      message:
        "Watch record deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch
};