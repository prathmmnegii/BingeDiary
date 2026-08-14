require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./connection");

const userRoutes =
  require("./routes/userRoutes");

const movieRoutes =
  require("./routes/movieRoutes");

const watchRoutes =
  require("./routes/watchRoutes");

const watchlistRoutes =
  require("./routes/watchListRoutes");

const errorMiddleware =
  require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "1mb"
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Binge Diary API is running",
    status: "ok"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Binge Diary API is healthy"
  });
});

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/movies",
  movieRoutes
);

app.use(
  "/api/watches",
  watchRoutes
);

app.use(
  "/api/watchlist",
  watchlistRoutes
);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use(errorMiddleware);

const PORT =
  process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(
      PORT,
      () => {
        console.log(
          `Binge Diary API running on port ${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();