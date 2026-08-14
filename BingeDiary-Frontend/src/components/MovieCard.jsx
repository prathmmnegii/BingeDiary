const MovieCard = ({
  movie,
  onWatchlist,
  onWatched,
  onDelete,
  isInWatchlist = false
}) => {
  return (
    <div className="movie-card">
      <div className="poster-container">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="movie-poster"
          />
        ) : (
          <div className="poster-placeholder">
            🎬
          </div>
        )}
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>

        <p className="movie-meta">
          {movie.genre} • {movie.year}
        </p>

        {movie.rating !== undefined &&
          movie.rating !== null && (
            <p className="movie-rating">
              ⭐ {movie.rating}
            </p>
          )}

        {onWatchlist && (
          <button
            className="small-button"
            onClick={() =>
              onWatchlist(movie._id)
            }
          >
            {isInWatchlist
              ? "Remove"
              : "Watchlist"}
          </button>
        )}

        {onWatched && !movie.watched && (
          <button
            className="small-button secondary"
            onClick={() =>
              onWatched(movie)
            }
          >
            Mark Watched
          </button>
        )}

        {onDelete && (
          <button
            className="delete-button"
            onClick={() =>
              onDelete(movie._id)
            }
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;