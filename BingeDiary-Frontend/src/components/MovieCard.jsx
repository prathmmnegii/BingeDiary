const MovieCard = ({
  movie,
  onWatchlist,
  onWatched,
  onDelete,
  isInWatchlist = false
}) => {

  const rating = Number(movie.rating) || 0;

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

        <h3>
          {movie.title}
        </h3>

        <p className="movie-meta">
          {movie.genre} • {movie.year}
        </p>

        {movie.rating !== undefined &&
          movie.rating !== null && (

            <div className="movie-rating">

              <span className="stars-display">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <span
                      key={star}
                      className={
                        star <= rating
                          ? "filled-star"
                          : "empty-star"
                      }
                    >
                      ★
                    </span>
                  )
                )}

              </span>

              <span className="rating-number">
                {rating}/5
              </span>

            </div>
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