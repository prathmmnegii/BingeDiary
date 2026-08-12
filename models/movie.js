const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    genre: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: true
    },

    releaseYear: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["movie", "series"],
      required: true
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