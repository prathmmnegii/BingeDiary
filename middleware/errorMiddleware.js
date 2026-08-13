// ===============================
// GLOBAL ERROR HANDLER
// ===============================

const errorMiddleware = (err, req, res, next) => {

  console.error(err.stack);


  // ===============================
  // MONGOOSE INVALID ID
  // ===============================

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID"
    });
  }


  // ===============================
  // MONGOOSE VALIDATION ERROR
  // ===============================

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      errors: Object.values(err.errors).map(
        error => error.message
      )
    });
  }


  // ===============================
  // DUPLICATE KEY ERROR
  // ===============================

  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate value already exists"
    });
  }


  // ===============================
  // DEFAULT ERROR
  // ===============================

  res.status(err.statusCode || 500).json({
    message: err.message || "Server error"
  });

};


module.exports = errorMiddleware;