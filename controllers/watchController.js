const Watch = require("../models/watch");


// ===============================
// GET ALL WATCHES
// ===============================

const getWatches = async (req, res, next) => {
  try {

    const watches = await Watch.find({
      user: req.user.userId
    }).populate("movie");


    res.json(watches);


  } catch (error) {

    next(error);

  }
};


// ===============================
// GET SINGLE WATCH
// ===============================

const getWatchById = async (req, res, next) => {
  try {

    const watch = await Watch.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate("movie");


    if (!watch) {
      return res.status(404).json({
        message: "Watch record not found"
      });
    }


    res.json(watch);


  } catch (error) {

    next(error);

  }
};


// ===============================
// CREATE WATCH
// ===============================

const createWatch = async (req, res, next) => {
  try {

    const watch = await Watch.create({
      ...req.body,
      user: req.user.userId
    });


    const populatedWatch = await Watch.findById(
      watch._id
    ).populate("movie");


    res.status(201).json(populatedWatch);


  } catch (error) {

    next(error);

  }
};


// ===============================
// UPDATE WATCH
// ===============================

const updateWatch = async (req, res, next) => {
  try {

    const watch = await Watch.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId
      },

      req.body,

      {
        new: true,
        runValidators: true
      }
    ).populate("movie");


    if (!watch) {
      return res.status(404).json({
        message: "Watch record not found or you are not the owner"
      });
    }


    res.json(watch);


  } catch (error) {

    next(error);

  }
};


// ===============================
// DELETE WATCH
// ===============================

const deleteWatch = async (req, res, next) => {
  try {

    const watch = await Watch.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });


    if (!watch) {
      return res.status(404).json({
        message: "Watch record not found or you are not the owner"
      });
    }


    res.json({
      message: "Watch record deleted successfully"
    });


  } catch (error) {

    next(error);

  }
};


// ===============================
// EXPORT CONTROLLERS
// ===============================

module.exports = {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch
};