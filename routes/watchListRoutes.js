const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} = require("../controllers/watchlistController");


// ===============================
// GET WATCHLIST
// ===============================

router.get(
  "/",
  authMiddleware,
  getWatchlist
);


// ===============================
// ADD TO WATCHLIST
// ===============================

router.post(
  "/",
  authMiddleware,
  addToWatchlist
);


// ===============================
// REMOVE FROM WATCHLIST
// ===============================

router.delete(
  "/:movieId",
  authMiddleware,
  removeFromWatchlist
);


module.exports = router;