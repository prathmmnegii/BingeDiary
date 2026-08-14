const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
      maxlength: 150
    },

    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      maxlength: 100
    },

    year: {
      type: Number,
      required: [true, "Release year is required"],
      min: 1888,
      max: new Date().getFullYear() + 10
    },

    rating: {
      type: Number,
      min: 0,
      max: 10
    },

    watched: {
      type: Boolean,
      default: false
    },

    posterUrl: {
      type: String,
      trim: true,
      default: ""
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Movie", movieSchema);