const mongoose = require("mongoose");

const watchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["movie", "series"],
      required: true
    },

    rating: {
      type: Number,
      min: 0,
      max: 10
    },

    review: {
      type: String,
      trim: true
    },

    watchedDate: {
      type: Date
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

module.exports = mongoose.model("Watch", watchSchema);