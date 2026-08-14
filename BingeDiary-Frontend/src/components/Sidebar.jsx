import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">
          🎬 <span>Binge Diary</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard">
            🏠 Dashboard
          </NavLink>

          <NavLink to="/movies">
            🎥 Movies
          </NavLink>

          <NavLink to="/watchlist">
            🔖 Watchlist
          </NavLink>

          <NavLink to="/history">
            🕒 Watch History
          </NavLink>

          <NavLink to="/add-movie">
            ➕ Add Movie
          </NavLink>
        </nav>
      </div>

      <button
        className="logout-button"
        onClick={logout}
      >
        ↪ Logout
      </button>
    </aside>
  );
};

export default Sidebar;