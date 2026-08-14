import { useState } from "react";
import {
  useNavigate,
  Link
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { createMovie } from "../services/api";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western"
];

const AddMovie = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    genre: "",
    year: "",
    rating: 0,
    posterUrl: "",
    watched: false
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleRating = (rating) => {
    setForm({
      ...form,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await createMovie({
        title: form.title,
        genre: form.genre,
        year: Number(form.year),
        rating:
          form.rating === 0
            ? undefined
            : Number(form.rating),
        posterUrl: form.posterUrl,
        watched: form.watched
      });

      navigate("/movies");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
              <h1>Add Movie</h1>

              <p>
                Add a movie to your diary.
              </p>
            </div>

            <Link
              to="/movies"
              className="secondary-button"
            >
              ← Back
            </Link>
          </div>

          <div className="form-card">

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form
              className="movie-form"
              onSubmit={handleSubmit}
            >

              {/* TITLE + GENRE */}

              <div className="form-row">

                <div>
                  <label>
                    Movie Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Interstellar"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>
                    Genre
                  </label>

                  <div className="select-wrapper">
                    <select
                      name="genre"
                      value={form.genre}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select genre
                      </option>

                      {genres.map((genre) => (
                        <option
                          key={genre}
                          value={genre}
                        >
                          {genre}
                        </option>
                      ))}
                    </select>

                    <span className="select-arrow">
                     ⌄
                    </span>
                  </div>
                </div>

              </div>


              {/* YEAR + RATING */}

              <div className="form-row">

                <div>
                  <label>
                    Release Year
                  </label>

                  <input
                    type="number"
                    name="year"
                    placeholder="2014"
                    value={form.year}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>
                    Rating
                  </label>

                  <div className="rating-wrapper">

                    <div className="star-rating">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <button
                            type="button"
                            key={star}
                            className={
                              star <= form.rating
                                ? "rating-star active"
                                : "rating-star"
                            }
                            onClick={() =>
                              handleRating(star)
                            }
                            aria-label={`Rate ${star} out of 5`}
                          >
                            ★
                          </button>
                        )
                      )}

                    </div>

                    <span className="rating-value">
                      {form.rating > 0
                        ? `${form.rating}.0 / 5`
                        : "Not rated"}
                    </span>

                  </div>
                </div>

              </div>


              {/* POSTER URL */}

              <div>
                <label>
                  Poster URL
                </label>

                <input
                  type="url"
                  name="posterUrl"
                  placeholder="https://..."
                  value={form.posterUrl}
                  onChange={handleChange}
                />

                <small>
                  We'll connect automatic movie poster
                  fetching later.
                </small>
              </div>


              {/* POSTER PREVIEW */}

              {form.posterUrl && (
                <div className="poster-preview">
                  <img
                    src={form.posterUrl}
                    alt="Poster preview"
                  />
                </div>
              )}


              {/* WATCHED */}

              <label className="checkbox-row">

                <input
                  type="checkbox"
                  checked={form.watched}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      watched:
                        e.target.checked
                    })
                  }
                />

                <span>
                  Already watched
                </span>

              </label>


              {/* SUBMIT */}

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Adding..."
                  : "Add Movie"}
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddMovie;