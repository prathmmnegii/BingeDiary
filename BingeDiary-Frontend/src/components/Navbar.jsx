import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      getProfile()
        .then((data) => {
          setUser(data);

          localStorage.setItem(
            "user",
            JSON.stringify(data)
          );
        })
        .catch(() => {});
    }
  }, []);

  return (
    <header className="topbar">
      <div />

      <div className="user-info">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase() ||
            "U"}
        </div>

        <span>
          {user?.name || "User"}
        </span>
      </div>
    </header>
  );
};

export default Navbar;