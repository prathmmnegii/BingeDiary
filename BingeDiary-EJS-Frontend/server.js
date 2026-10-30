require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const renderPage = (page, title) => (req, res) => {
  res.render("layout", {
    page,
    title,
    apiUrl: "http://127.0.0.1:8001/api"
  });
};

app.get("/", (req, res) => res.redirect("/dashboard"));
app.get("/login", renderPage("login", "Login | Binge Diary"));
app.get("/register", renderPage("register", "Create Account | Binge Diary"));
app.get("/dashboard", renderPage("dashboard", "Dashboard | Binge Diary"));
app.get("/movies", renderPage("movies", "My Movies | Binge Diary"));
app.get("/add-movie", renderPage("add-movie", "Add Movie | Binge Diary"));
app.get("/watchlist", renderPage("watchlist", "Watchlist | Binge Diary"));
app.get("/history", renderPage("history", "Watch History | Binge Diary"));

app.use((req, res) => res.status(404).send("Page not found"));

app.listen(PORT, () => {
  console.log(`Binge Diary EJS frontend running at http://localhost:${PORT}`);
});
