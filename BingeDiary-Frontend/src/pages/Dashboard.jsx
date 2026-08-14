import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import MovieCard from "../components/MovieCard";

import {
  getMovieStats,
  getMovies,
  getWatches
} from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    watchedMovies: 0,
    unwatchedMovies: 0,
    averageRating: 0
  });

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, movieData] =
          await Promise.all([
            getMovieStats(),
            getMovies()
          ]);

        setStats(statsData);

        setMovies(
          movieData.movies.slice(0, 5)
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-content">
          <div className="page-heading">
            <div>
              <h1>Dashboard</h1>
              <p>
                Welcome back! Keep track of your movies.
              </p>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard
              title="Total Movies"
              value={stats.totalMovies}
              icon="🎬"
            />

            <StatCard
              title="Watched"
              value={stats.watchedMovies}
              icon="✓"
            />

            <StatCard
              title="Watchlist"
              value={stats.unwatchedMovies}
              icon="🔖"
            />

            <StatCard
              title="Average Rating"
              value={stats.averageRating}
              icon="⭐"
            />
          </div>

          <div className="section-header">
            <h2>My Movies</h2>

            <Link
              to="/movies"
              className="view-link"
            >
              View All →
            </Link>
          </div>

          {movies.length === 0 ? (
            <div className="empty-state">
              <h3>No movies yet</h3>
              <p>
                Add your first movie to get started.
              </p>

              <Link
                to="/add-movie"
                className="primary-button"
              >
                Add Movie
              </Link>
            </div>
          ) : (
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;