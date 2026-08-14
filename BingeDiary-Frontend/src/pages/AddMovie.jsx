import { useState } from "react";
import {
  useNavigate,
  Link
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { createMovie } from "../services/api";

const AddMovie = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    genre: "",
    year: "",
    rating: "",
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
          form.rating === ""
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
              <div className="form-row">
                <div>
                  <label>
                    Movie Title
                  </label>

                  <input
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

                  <input
                    name="genre"
                    placeholder="Sci-Fi"
                    value={form.genre}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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

                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    name="rating"
                    placeholder="8.7"
                    value={form.rating}
                    onChange={handleChange}
                  />
                </div>
              </div>

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

              {form.posterUrl && (
                <div className="poster-preview">
                  <img
                    src={form.posterUrl}
                    alt="Poster preview"
                  />
                </div>
              )}

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

                Already watched
              </label>

              <button
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