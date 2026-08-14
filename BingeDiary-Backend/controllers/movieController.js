const mongoose = require("mongoose");

const Movie = require("../models/movie");
const Watch = require("../models/watch");
const Watchlist = require("../models/watchlist");

const getMovies = async (req, res, next) => {
  try {
    const {
      title,
      genre,
      watched,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 12
    } = req.query;

    const filter = {
      user: req.user.userId
    };

    if (title) {
      filter.title = {
        $regex: title,
        $options: "i"
      };
    }

    if (genre) {
      filter.genre = {
        $regex: `^${genre}$`,
        $options: "i"
      };
    }

    if (watched !== undefined) {
      if (
        watched !== "true" &&
        watched !== "false"
      ) {
        return res.status(400).json({
          message: "watched must be true or false"
        });
      }

      filter.watched = watched === "true";
    }

    const pageNumber = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 12, 1),
      100
    );

    const allowedSortFields = [
      "title",
      "year",
      "rating",
      "createdAt"
    ];

    const selectedSortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const skip =
      (pageNumber - 1) * limitNumber;

    const [movies, totalMovies] =
      await Promise.all([
        Movie.find(filter)
          .sort({
            [selectedSortField]: sortOrder
          })
          .skip(skip)
          .limit(limitNumber),

        Movie.countDocuments(filter)
      ]);

    return res.json({
      movies,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalMovies,
        totalPages: Math.ceil(
          totalMovies / limitNumber
        )
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMovieStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(
      req.user.userId
    );

    const [
      totalMovies,
      watchedMovies,
      ratingStats
    ] = await Promise.all([
      Movie.countDocuments({
        user: userId
      }),

      Movie.countDocuments({
        user: userId,
        watched: true
      }),

      Movie.aggregate([
        {
          $match: {
            user: userId,
            rating: {
              $exists: true,
              $ne: null
            }
          }
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating"
            }
          }
        }
      ])
    ]);

    const averageRating =
      ratingStats.length
        ? Number(
            ratingStats[0]
              .averageRating
              .toFixed(2)
          )
        : 0;

    return res.json({
      totalMovies,
      watchedMovies,
      unwatchedMovies:
        totalMovies - watchedMovies,
      averageRating
    });
  } catch (error) {
    next(error);
  }
};

const getMovieById = async (
  req,
  res,
  next
) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    return res.json(movie);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (
  req,
  res,
  next
) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      user: req.user.userId
    });

    return res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

const updateMovie = async (
  req,
  res,
  next
) => {
  try {
    const movie =
      await Movie.findOneAndUpdate(
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
        message: "Movie not found"
      });
    }

    return res.json(movie);
  } catch (error) {
    next(error);
  }
};

const deleteMovie = async (
  req,
  res,
  next
) => {
  try {
    const movie =
      await Movie.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId
      });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    await Promise.all([
      Watch.deleteMany({
        movie: movie._id,
        user: req.user.userId
      }),

      Watchlist.deleteMany({
        movie: movie._id,
        user: req.user.userId
      })
    ]);

    return res.json({
      message:
        "Movie and related records deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieStats,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};