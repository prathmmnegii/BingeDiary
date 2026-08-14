const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  validateWatch
} = require("../middleware/validationMiddleware");

const {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch
} = require("../controllers/watchController");

router.use(authMiddleware);

router.get("/", getWatches);

router.get("/:id", getWatchById);

router.post(
  "/",
  validateWatch,
  createWatch
);

router.put(
  "/:id",
  validateWatch,
  updateWatch
);

router.delete(
  "/:id",
  deleteWatch
);

module.exports = router;