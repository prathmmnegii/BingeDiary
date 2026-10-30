(() => {
  const page = document.body.dataset.page;
  const API_URL = document.body.dataset.apiUrl || "http://localhost:8000/api";
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  const token = () => localStorage.getItem("token");
  const userData = () => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  };
  async function api(endpoint, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token()) headers.Authorization = `Bearer ${token()}`;
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) {
      if (response.status === 401 && page !== "login" && page !== "register") {
        localStorage.removeItem("token"); localStorage.removeItem("user");
        window.location.href = "/login";
      }
      throw new Error(data.message || "Something went wrong");
    }
    return data;
  }
  const showError = (message, element = $("#form-error")) => {
    if (!element) { alert(message); return; }
    element.textContent = message;
    element.hidden = false;
  };
  const clearError = () => { const el = $("#form-error"); if (el) { el.textContent = ""; el.hidden = true; } };

  if (page === "login" || page === "register") {
    if (token()) window.location.replace("/dashboard");
    const form = $("#login-form") || $("#register-form");
    form?.addEventListener("submit", async event => {
      event.preventDefault(); clearError();
      const button = $("button[type=submit]", form);
      const original = button.textContent;
      button.disabled = true;
      button.textContent = page === "login" ? "Logging in..." : "Creating account...";
      const fields = Object.fromEntries(new FormData(form).entries());
      try {
        if (page === "login") {
          const data = await api("/users/login", { method:"POST", body:JSON.stringify(fields) });
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "/dashboard";
        } else {
          await api("/users/register", { method:"POST", body:JSON.stringify(fields) });
          window.location.href = "/login?registered=1";
        }
      } catch (error) { showError(error.message); }
      finally { button.disabled = false; button.textContent = original; }
    });
    if (page === "login" && new URLSearchParams(location.search).get("registered") === "1") {
      const msg = document.createElement("p");
      msg.className = "success-message";
      msg.textContent = "Account created successfully. Please log in.";
      $(".auth-subtitle")?.after(msg);
    }
    return;
  }

  if (!token()) { window.location.replace("/login"); return; }

  const setUser = async () => {
    let user = userData();
    if (!user) {
      try { user = await api("/users/profile"); localStorage.setItem("user", JSON.stringify(user)); }
      catch { return; }
    }
    const name = user?.name || "User";
    if ($("#user-name")) $("#user-name").textContent = name;
    if ($("#user-avatar")) $("#user-avatar").textContent = name.charAt(0).toUpperCase();
  };
  setUser();

  $("#logout-button")?.addEventListener("click", () => {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    window.location.href = "/login";
  });
  $("#mobile-menu")?.addEventListener("click", () => $(".sidebar")?.classList.toggle("open"));
  document.querySelectorAll("[data-nav]").forEach(link => {
    if (link.dataset.nav === page) link.classList.add("active");
  });

  const ratingStars = n => `<span class="stars-display">${[1,2,3,4,5].map(s=>`<span class="${s <= (Number(n)||0) ? "filled-star":"empty-star"}">★</span>`).join("")}</span>`;
  const movieCard = (movie, opts = {}) => {
    if (!movie) return "";
    const rating = movie.rating === undefined || movie.rating === null ? "" :
      `<div class="movie-rating">${ratingStars(movie.rating)} <span class="rating-number">${escapeHTML(movie.rating)}/5</span></div>`;
    const actions = [];
    if (opts.watchlistAction) actions.push(`<button class="small-button" data-action="toggle-watchlist" data-id="${escapeHTML(movie._id)}">${opts.inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}</button>`);
    if (opts.allowWatch && !movie.watched) actions.push(`<button class="small-button secondary" data-action="mark-watched" data-id="${escapeHTML(movie._id)}">Mark Watched</button>`);
    if (opts.allowDelete) actions.push(`<button class="delete-button" data-action="delete-movie" data-id="${escapeHTML(movie._id)}">Delete</button>`);
    return `<article class="movie-card" data-title="${escapeHTML(movie.title || "").toLowerCase()}">
      <div class="poster-container">${movie.posterUrl ? `<img class="movie-poster" src="${escapeHTML(movie.posterUrl)}" alt="${escapeHTML(movie.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><div class="poster-placeholder" style="display:none">🎬</div>` : `<div class="poster-placeholder">🎬</div>`}</div>
      <div class="movie-info"><h3>${escapeHTML(movie.title)}</h3><p class="movie-meta">${escapeHTML(movie.genre || "Genre not set")} • ${escapeHTML(movie.year || "Year unknown")}</p>${rating}<div class="movie-actions">${actions.join("")}</div></div>
    </article>`;
  };
  const emptyState = (heading, description, link = "") => `<div class="empty-state"><h3>${escapeHTML(heading)}</h3><p>${escapeHTML(description)}</p>${link ? `<p style="margin-top:18px"><a class="primary-button" href="${link}">Add Movie</a></p>` : ""}</div>`;
  const renderGrid = (movies, opts = {}) => {
    const grid = $("#movie-grid");
    if (!grid) return;
    grid.innerHTML = movies.length ? movies.map(movie => movieCard(movie, opts)).join("") : emptyState(opts.emptyTitle || "No movies found", opts.emptyText || "Add a movie or change your search.", opts.allowDelete ? "/add-movie" : "");
  };

  let allMovies = [], watchlist = [];
  async function loadMoviesPage() {
    const [movieData, watchlistData] = await Promise.all([api("/movies?limit=100"), api("/watchlist")]);
    allMovies = movieData.movies || [];
    watchlist = watchlistData || [];
    if (page === "dashboard") {
      const stats = await api("/movies/stats/summary");
      $("#stat-total").textContent = stats.totalMovies ?? 0;
      $("#stat-watched").textContent = stats.watchedMovies ?? 0;
      $("#stat-unwatched").textContent = stats.unwatchedMovies ?? 0;
      $("#stat-rating").textContent = Number(stats.averageRating ?? 0).toFixed(1);
      renderGrid(allMovies.slice(0,5), { emptyTitle:"No movies yet", emptyText:"Add your first movie to get started.", allowDelete:false });
    } else if (page === "movies") {
      renderGrid(allMovies, { watchlistAction:true, allowWatch:true, allowDelete:true, inWatchlist:false });
      applySearch();
    } else if (page === "watchlist") {
      const watchMovies = watchlist.map(item => item.movie).filter(Boolean);
      renderGrid(watchMovies, { watchlistAction:true, inWatchlist:true, emptyTitle:"Your watchlist is empty", emptyText:"Add movies you want to watch later." });
    }
  }
  function applySearch() {
    if (page !== "movies") return;
    const q = ($("#movie-search")?.value || "").trim().toLowerCase();
    const inList = new Set(watchlist.map(item => item.movie?._id).filter(Boolean));
    renderGrid(allMovies.filter(m => (m.title || "").toLowerCase().includes(q)), {
      watchlistAction:true, allowWatch:true, allowDelete:true,
      isWatchlistSet:inList
    });
    // Update button labels based on actual watchlist membership.
    document.querySelectorAll('[data-action="toggle-watchlist"]').forEach(btn => {
      btn.textContent = inList.has(btn.dataset.id) ? "Remove from Watchlist" : "Add to Watchlist";
    });
  }
  $("#movie-search")?.addEventListener("input", applySearch);

  if (page === "add-movie") {
    let selectedRating = 0;
    $("#star-rating")?.addEventListener("click", e => {
      const button = e.target.closest("[data-rating]");
      if (!button) return;
      selectedRating = Number(button.dataset.rating);
      document.querySelectorAll(".rating-star").forEach(star => star.classList.toggle("active", Number(star.dataset.rating) <= selectedRating));
      $("#rating-value").textContent = `${selectedRating}.0 / 5`;
    });
    $("#posterUrl")?.addEventListener("input", e => {
      const value = e.target.value.trim(), preview = $("#poster-preview"), img = $("#poster-preview-image");
      if (value) { img.src = value; preview.hidden = false; } else { preview.hidden = true; }
    });
    $("#movie-form")?.addEventListener("submit", async e => {
      e.preventDefault(); clearError();
      const form = e.currentTarget, button = $("button[type=submit]", form);
      const data = new FormData(form);
      const payload = {
        title: String(data.get("title") || "").trim(),
        genre: data.get("genre"),
        year: Number(data.get("year")),
        rating: selectedRating || undefined,
        posterUrl: String(data.get("posterUrl") || "").trim(),
        watched: $("#watched").checked
      };
      button.disabled = true; button.textContent = "Adding...";
      try {
        await api("/movies", {method:"POST", body:JSON.stringify(payload)});
        window.location.href = "/movies";
      } catch (error) { showError(error.message); button.disabled = false; button.textContent = "Add Movie"; }
    });
  }

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const { action, id } = button.dataset;
    button.disabled = true;
    try {
      if (action === "delete-movie") {
        if (!confirm("Delete this movie? This also removes its watch history and watchlist entry.")) return;
        await api(`/movies/${id}`, {method:"DELETE"});
        allMovies = allMovies.filter(m => m._id !== id);
        await loadMoviesPage();
      } else if (action === "toggle-watchlist") {
        const existing = watchlist.find(item => item.movie?._id === id);
        if (existing) await api(`/watchlist/${id}`, {method:"DELETE"});
        else await api("/watchlist", {method:"POST", body:JSON.stringify({movie:id})});
        await loadMoviesPage();
      } else if (action === "mark-watched") {
        const movie = allMovies.find(m => m._id === id);
        if (!movie) return;
        await api("/watches", {method:"POST", body:JSON.stringify({movie:id, rating:movie.rating, watchedDate:new Date().toISOString()})});
        await api(`/movies/${id}`, {method:"PUT", body:JSON.stringify({
          title:movie.title, genre:movie.genre, year:movie.year,
          rating:movie.rating, posterUrl:movie.posterUrl || "", watched:true
        })});
        await loadMoviesPage();
      } else if (action === "delete-watch") {
        await api(`/watches/${id}`, {method:"DELETE"});
        await loadHistory();
      }
    } catch (error) { alert(error.message); }
    finally { button.disabled = false; }
  });

  async function loadHistory() {
    const container = $("#history-list");
    try {
      const watches = await api("/watches");
      if (!watches.length) { container.innerHTML = emptyState("No watch history", "Movies you mark as watched will appear here."); return; }
      container.innerHTML = watches.map(watch => {
        const movie = watch.movie || {};
        return `<div class="history-item"><div class="history-movie">${movie.posterUrl ? `<img src="${escapeHTML(movie.posterUrl)}" alt="${escapeHTML(movie.title || "Movie poster")}">` : `<div class="history-placeholder">🎬</div>`}<div><h3>${escapeHTML(movie.title || "Deleted movie")}</h3><p>${escapeHTML(movie.genre || "")}</p></div></div><div class="history-rating">⭐ ${escapeHTML(watch.rating ?? "N/A")}</div><div class="history-date">${watch.watchedDate ? new Date(watch.watchedDate).toLocaleDateString() : "—"}</div><div class="history-review">${escapeHTML(watch.review || "No review")}</div><button class="delete-button" data-action="delete-watch" data-id="${escapeHTML(watch._id)}">Delete</button></div>`;
      }).join("");
    } catch (error) { container.innerHTML = emptyState("Couldn't load history", error.message); }
  }

  if (["dashboard", "movies", "watchlist"].includes(page)) {
    loadMoviesPage().catch(error => {
      const grid = $("#movie-grid");
      if (grid) grid.innerHTML = emptyState("Couldn't load your movies", error.message);
    });
  }
  if (page === "history") loadHistory();
})();