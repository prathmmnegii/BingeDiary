const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch
} = require("../controllers/watchController");


// ===============================
// GET ALL WATCHES
// ===============================

router.get(
  "/",
  authMiddleware,
  getWatches
);


// ===============================
// GET SINGLE WATCH
// ===============================

router.get(
  "/:id",
  authMiddleware,
  getWatchById
);


// ===============================
// CREATE WATCH
// ===============================

router.post(
  "/",
  authMiddleware,
  createWatch
);


// ===============================
// UPDATE WATCH
// ===============================

router.put(
  "/:id",
  authMiddleware,
  updateWatch
);


// ===============================
// DELETE WATCH
// ===============================

router.delete(
  "/:id",
  authMiddleware,
  deleteWatch
);


module.exports = router;