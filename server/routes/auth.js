import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: "Email already in use" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hash });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Missing fields" });

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Login failed: User '${email}' not found`);
            return res.status(401).json({ error: "User not found" });
        }

        console.log(`[DEBUG_LOGIN] User found: ${email}`);
        console.log(`[DEBUG_LOGIN] Stored hash: ${user.password}`);

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log(`Login failed: Password mismatch for '${email}'`);
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Emergency Reset Route (TEMPORARY)
router.get("/reset-admin-emergency", async (req, res) => {
    try {
        const email = "admin@lumina.studio";
        const password = "admin";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let user = await User.findOne({ email });
        if (user) {
            user.password = hash;
            await user.save();
            return res.send(`
                <h1>Password Reset Success</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br>
                <a href="http://localhost:5173/login">Click here to Login</a>
            `);
        } else {
            await User.create({ name: 'Studio Admin', email, password: hash, role: 'admin' });
            return res.send(`
                <h1>Admin Created Success</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br>
                <a href="http://localhost:5173/login">Click here to Login</a>
            `);
        }
    } catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

export default router;
