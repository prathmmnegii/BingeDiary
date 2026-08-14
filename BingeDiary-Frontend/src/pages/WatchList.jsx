import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

import {
  getWatchlist,
  removeFromWatchlist
} from "../services/api";

const Watchlist = () => {
  const [watchlist, setWatchlist] =
    useState([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const data =
        await getWatchlist();

      setWatchlist(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (movieId) => {
    try {
      await removeFromWatchlist(
        movieId
      );

      setWatchlist((prev) =>
        prev.filter(
          (item) =>
            item.movie?._id !== movieId
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-content">
          <div className="page-heading">
            <div>
              <h1>Watchlist</h1>
              <p>
                Movies you want to watch.
              </p>
            </div>
          </div>

          {watchlist.length === 0 ? (
            <div className="empty-state">
              <h3>Your watchlist is empty</h3>
              <p>
                Add movies you want to watch later.
              </p>
            </div>
          ) : (
            <div className="movie-grid">
              {watchlist.map((item) => (
                <MovieCard
                  key={item._id}
                  movie={item.movie}
                  onWatchlist={
                    handleRemove
                  }
                  isInWatchlist={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Watchlist;