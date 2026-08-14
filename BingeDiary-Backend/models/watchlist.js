const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
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

watchlistSchema.index(
  { movie: 1, user: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Watchlist",
  watchlistSchema
);