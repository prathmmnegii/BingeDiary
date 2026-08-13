const mongoose = require("mongoose");


// ===============================
// MOVIE SCHEMA
// ===============================

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    genre: {
      type: String,
      required: true,
      trim: true
    },

    year: {
      type: Number,
      required: true
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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },

  {
    timestamps: true
  }
);


module.exports = mongoose.model("Movie", movieSchema);