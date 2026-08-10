const express = require("express");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Dummy data
let movies = [
  { id: 1, title: "Interstellar", watched: false },
  { id: 2, title: "Inception", watched: true }
];

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to Binge Diary 🚀");
});


// 🔹 GET all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});


// 🔹 GET single movie
app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);

  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.json(movie);
});


// 🔹 POST add movie
app.post("/movies", (req, res) => {
  const { title } = req.body;

  // Validation
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const newMovie = {
    id: movies.length + 1,
    title,
    watched: false
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});


// 🔹 PUT update movie (watched status)
app.put("/movies/:id", (req, res) => {
  const id = Number(req.params.id);

  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movie.watched = req.body.watched;

  res.json(movie);
});


// 🔹 DELETE movie
app.delete("/movies/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = movies.some(m => m.id === id);

  if (!exists) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies = movies.filter(m => m.id !== id);

  res.json({ message: "Movie deleted successfully" });
});


// Server start
app.listen(8000, () => {
  console.log("Server started on port 8000 🚀");
});