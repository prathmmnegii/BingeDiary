const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} = require("../controllers/watchListController");

router.use(authMiddleware);

router.get(
  "/",
  getWatchlist
);

router.post(
  "/",
  addToWatchlist
);

router.delete(
  "/:movieId",
  removeFromWatchlist
);

module.exports = router;