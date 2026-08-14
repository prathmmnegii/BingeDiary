import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

import {
  getMovies,
  deleteMovie,
  addToWatchlist,
  createWatch,
  getWatchlist
} from "../services/api";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const [search, setSearch] = useState("");

  const loadMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data.movies);
    } catch (error) {
      console.error(error);
    }
  };

  const loadWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMovies();
    loadWatchlist();
  }, []);

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Delete this movie?"
      );

    if (!confirmed) return;

    try {
      await deleteMovie(id);

      setMovies((prev) =>
        prev.filter(
          (movie) => movie._id !== id
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleWatchlist = async (id) => {
    const exists = watchlist.some(
      (item) =>
        item.movie?._id === id
    );

    try {
      if (exists) {
        return;
      }

      const item =
        await addToWatchlist(id);

      setWatchlist((prev) => [
        ...prev,
        item
      ]);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleWatched = async (movie) => {
    try {
      await createWatch({
        movie: movie._id,
        rating: movie.rating,
        watchedDate: new Date().toISOString()
      });

      setMovies((prev) =>
        prev.map((item) =>
          item._id === movie._id
            ? {
                ...item,
                watched: true
              }
            : item
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredMovies =
    movies.filter((movie) =>
      movie.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-content">
          <div className="page-heading">
            <div>
              <h1>Movies</h1>
              <p>
                Your personal movie collection.
              </p>
            </div>

            <Link
              to="/add-movie"
              className="primary-button"
            >
              + Add Movie
            </Link>
          </div>

          <div className="search-box">
            🔍

            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {filteredMovies.length === 0 ? (
            <div className="empty-state">
              <h3>No movies found</h3>
              <p>
                Try adding a movie or changing your search.
              </p>
            </div>
          ) : (
            <div className="movie-grid">
              {filteredMovies.map(
                (movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onWatchlist={
                      handleWatchlist
                    }
                    onWatched={
                      handleWatched
                    }
                    onDelete={
                      handleDelete
                    }
                    isInWatchlist={watchlist.some(
                      (item) =>
                        item.movie?._id ===
                        movie._id
                    )}
                  />
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Movies;