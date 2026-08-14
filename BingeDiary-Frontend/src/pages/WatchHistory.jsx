import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getWatches,
  deleteWatch
} from "../services/api";

const WatchHistory = () => {
  const [watches, setWatches] =
    useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data =
        await getWatches();

      setWatches(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWatch(id);

      setWatches((prev) =>
        prev.filter(
          (watch) =>
            watch._id !== id
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
              <h1>Watch History</h1>
              <p>
                Movies you've watched.
              </p>
            </div>
          </div>

          {watches.length === 0 ? (
            <div className="empty-state">
              <h3>No watch history</h3>
              <p>
                Movies you mark as watched will appear here.
              </p>
            </div>
          ) : (
            <div className="history-list">
              {watches.map((watch) => (
                <div
                  className="history-item"
                  key={watch._id}
                >
                  <div className="history-movie">
                    {watch.movie?.posterUrl ? (
                      <img
                        src={
                          watch.movie.posterUrl
                        }
                        alt={
                          watch.movie.title
                        }
                      />
                    ) : (
                      <div className="history-placeholder">
                        🎬
                      </div>
                    )}

                    <div>
                      <h3>
                        {watch.movie?.title}
                      </h3>

                      <p>
                        {watch.movie?.genre}
                      </p>
                    </div>
                  </div>

                  <div className="history-rating">
                    ⭐{" "}
                    {watch.rating ??
                      "N/A"}
                  </div>

                  <div className="history-date">
                    {new Date(
                      watch.watchedDate
                    ).toLocaleDateString()}
                  </div>

                  <div className="history-review">
                    {watch.review ||
                      "No review"}
                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(
                        watch._id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WatchHistory;