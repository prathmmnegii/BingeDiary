require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectMongoDB } = require("./connection");

const User = require("./models/user");
const Movie = require("./models/movie");
const Watch = require("./models/watch");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = 8000;

// =============================
// MIDDLEWARE
// =============================

app.use(express.json());

// =============================
// MONGODB CONNECTION
// =============================

console.log("Connecting to DB...");

connectMongoDB("mongodb://127.0.0.1:27017/binge-diary")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error:", err));

// =============================
// USER ROUTES
// =============================

// REGISTER USER
app.post("/api/users/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                msg: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                msg: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const userResponse = user.toObject();

        // Never send password to client
        delete userResponse.password;

        return res.status(201).json(userResponse);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// LOGIN USER
app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                msg: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                msg: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                msg: "Invalid email or password"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            msg: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// GET LOGGED-IN USER PROFILE
app.get("/api/users/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        return res.json(user);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// GET ALL USERS
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({})
            .select("-password");

        return res.json(users);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// GET USER BY ID
app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        return res.json(user);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// UPDATE USER
app.put("/api/users/:id", async (req, res) => {
    try {
        const { name, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        return res.json(updatedUser);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// DELETE USER
app.delete("/api/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        return res.json({
            msg: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// =============================
// MOVIE ROUTES
// =============================

// CREATE MOVIE
app.post("/api/movies", authMiddleware, async (req, res) => {
    try {
        const { title, genre, rating, review } = req.body;

        if (!title || !genre || rating === undefined) {
            return res.status(400).json({
                msg: "Title, genre and rating are required"
            });
        }

        const movie = await Movie.create({
            title,
            genre,
            rating,
            review,
            user: req.user.userId
        });

        return res.status(201).json(movie);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// GET LOGGED-IN USER'S MOVIES
app.get("/api/movies", authMiddleware, async (req, res) => {
    try {
        const movies = await Movie.find({
            user: req.user.userId
        });

        return res.json(movies);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// UPDATE MY MOVIE
app.put("/api/movies/:id", authMiddleware, async (req, res) => {
    try {
        const { title, genre, rating, review } = req.body;

        const updatedMovie = await Movie.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            {
                title,
                genre,
                rating,
                review
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedMovie) {
            return res.status(404).json({
                msg: "Movie not found or you are not allowed to update it"
            });
        }

        return res.json(updatedMovie);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// DELETE MY MOVIE
app.delete("/api/movies/:id", authMiddleware, async (req, res) => {
    try {
        const deletedMovie = await Movie.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!deletedMovie) {
            return res.status(404).json({
                msg: "Movie not found or you are not allowed to delete it"
            });
        }

        return res.json({
            msg: "Movie deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// =============================
// WATCH ROUTES
// =============================

// CREATE WATCH ENTRY
app.post("/api/watches", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            type,
            rating,
            review,
            watchedDate
        } = req.body;

        if (!title || !type) {
            return res.status(400).json({
                msg: "Title and type are required"
            });
        }

        const watch = await Watch.create({
            title,
            type,
            rating,
            review,
            watchedDate,
            user: req.user.userId
        });

        return res.status(201).json(watch);

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
});

// =============================
// START SERVER
// =============================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});