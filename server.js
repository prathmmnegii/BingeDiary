require("dotenv").config();

const express = require("express");

const connectDB = require("./connection");

const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const watchRoutes = require("./routes/watchRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");


const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());


// ===============================
// DATABASE
// ===============================

connectDB();


// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Binge Diary API is running"
  });
});


// ===============================
// ROUTES
// ===============================

app.use("/api/users", userRoutes);

app.use("/api/movies", movieRoutes);

app.use("/api/watches", watchRoutes);

app.use("/api/watchlist", watchlistRoutes);


// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});