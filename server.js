const express = require("express");
const { connectMongoDB } = require("./connection");
const User = require("./models/user");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());

// ===== MongoDB Connection =====
console.log("Connecting to DB...");

connectMongoDB("mongodb://127.0.0.1:27017/binge-diary")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));


// ===== ROUTES =====

// CREATE USER
app.post("/api/users", async (req, res) => {
  try {
    const body = req.body;

    if (!body.name || !body.email) {
      return res.status(400).json({ msg: "Name and Email required" });
    }

    const result = await User.create(body);
    return res.status(201).json(result);

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});


// GET ALL USERS
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});


// GET USER BY ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json(user);

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});


// UPDATE USER
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json(updatedUser);

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});


// DELETE USER
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ msg: "User deleted successfully" });

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});


// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});