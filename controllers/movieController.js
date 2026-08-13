const mongoose = require("mongoose");

const Movie = require("../models/movie");


// ===============================
// GET ALL MOVIES
// SEARCH + FILTER + SORT + PAGINATION
// ===============================

const getMovies = async (req, res, next) => {
  try {

    const {
      title,
      genre,
      watched,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;


    // ===============================
    // FILTER
    // ===============================

    const filter = {};


    // Search by title
    if (title) {
      filter.title = {
        $regex: title,
        $options: "i"
      };
    }


    // Filter by genre
    if (genre) {
      filter.genre = {
        $regex: `^${genre}$`,
        $options: "i"
      };
    }


    // Filter by watched status
    if (watched !== undefined) {

      if (watched !== "true" && watched !== "false") {
        return res.status(400).json({
          message: "watched must be true or false"
        });
      }

      filter.watched = watched === "true";
    }


    // ===============================
    // PAGINATION
    // ===============================

    const pageNumber = Math.max(
      parseInt(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;


    // ===============================
    // SORTING
    // ===============================

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


    const sortOrder =
      order === "asc" ? 1 : -1;


    // ===============================
    // GET MOVIES
    // ===============================

    const movies = await Movie.find(filter)
      .sort({
        [selectedSortField]: sortOrder
      })
      .skip(skip)
      .limit(limitNumber);


    // ===============================
    // TOTAL MOVIES
    // ===============================

    const totalMovies =
      await Movie.countDocuments(filter);

    const totalPages =
      Math.ceil(totalMovies / limitNumber);


    // ===============================
    // RESPONSE
    // ===============================

    res.json({
      movies,

      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalMovies,
        totalPages
      }
    });


  } catch (error) {

    next(error);

  }
};


// ===============================
// GET MOVIE STATISTICS
// ===============================

const getMovieStats = async (req, res, next) => {
  try {

    const userId = req.user.userId;


    const totalMovies =
      await Movie.countDocuments({
        user: userId
      });


    const watchedMovies =
      await Movie.countDocuments({
        user: userId,
        watched: true
      });


    const unwatchedMovies =
      await Movie.countDocuments({
        user: userId,
        watched: false
      });


    const ratingStats =
      await Movie.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            rating: {
              $exists: true
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
      ]);


    const averageRating =
      ratingStats.length > 0
        ? Number(
            ratingStats[0].averageRating.toFixed(2)
          )
        : 0;


    res.json({
      totalMovies,
      watchedMovies,
      unwatchedMovies,
      averageRating
    });


  } catch (error) {

    next(error);

  }
};


// ===============================
// GET SINGLE MOVIE
// ===============================

const getMovieById = async (req, res, next) => {
  try {

    const movie = await Movie.findById(
      req.params.id
    );


    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }


    res.json(movie);


  } catch (error) {

    next(error);

  }
};


// ===============================
// CREATE MOVIE
// ===============================

const createMovie = async (req, res, next) => {
  try {

    const movie = await Movie.create({
      ...req.body,
      user: req.user.userId
    });


    res.status(201).json(movie);


  } catch (error) {

    next(error);

  }
};


// ===============================
// UPDATE MOVIE
// ===============================

const updateMovie = async (req, res, next) => {
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
        message:
          "Movie not found or you are not the owner"
      });
    }


    res.json(movie);


  } catch (error) {

    next(error);

  }
};


// ===============================
// DELETE MOVIE
// ===============================

const deleteMovie = async (req, res, next) => {
  try {

    const movie =
      await Movie.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId
      });


    if (!movie) {
      return res.status(404).json({
        message:
          "Movie not found or you are not the owner"
      });
    }


    res.json({
      message: "Movie deleted successfully"
    });


  } catch (error) {

    next(error);

  }
};


// ===============================
// EXPORT CONTROLLERS
// ===============================

module.exports = {
  getMovies,
  getMovieStats,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};