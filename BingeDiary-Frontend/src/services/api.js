const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

/* =========================
   AUTH
========================= */

export const registerUser = (userData) =>
  request("/users/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });

export const loginUser = (userData) =>
  request("/users/login", {
    method: "POST",
    body: JSON.stringify(userData)
  });

export const getProfile = () =>
  request("/users/profile");

/* =========================
   MOVIES
========================= */

export const getMovies = () =>
  request("/movies?limit=100");

export const getMovieStats = () =>
  request("/movies/stats/summary");

export const createMovie = (movieData) =>
  request("/movies", {
    method: "POST",
    body: JSON.stringify(movieData)
  });

export const updateMovie = (id, movieData) =>
  request(`/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(movieData)
  });

export const deleteMovie = (id) =>
  request(`/movies/${id}`, {
    method: "DELETE"
  });

/* =========================
   WATCH HISTORY
========================= */

export const getWatches = () =>
  request("/watches");

export const createWatch = (watchData) =>
  request("/watches", {
    method: "POST",
    body: JSON.stringify(watchData)
  });

export const deleteWatch = (id) =>
  request(`/watches/${id}`, {
    method: "DELETE"
  });

/* =========================
   WATCHLIST
========================= */

export const getWatchlist = () =>
  request("/watchlist");

export const addToWatchlist = (movieId) =>
  request("/watchlist", {
    method: "POST",
    body: JSON.stringify({
      movie: movieId
    })
  });

export const removeFromWatchlist = (movieId) =>
  request(`/watchlist/${movieId}`, {
    method: "DELETE"
  });