require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectMongoDB } = require("./connection");
const User = require("./models/user");
const authMiddleware = require("./middleware/authMiddleware");

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
        const users = await User.find({});

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
        const user = await User.findById(req.params.id);

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
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

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


// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});