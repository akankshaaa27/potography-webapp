import User from "../models/User.js";
import { encrypt, decrypt } from "../utils/encryption.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, status } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const encryptedPassword = encrypt(password);
        if (!encryptedPassword) {
            return res.status(500).json({ message: "Encryption failed" });
        }

        const user = new User({
            name,
            email,
            password: encryptedPassword,
            role,
            phone,
            status
        });
        await user.save();

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(400).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const updateData = { ...rest };

        if (password && password.trim() !== "") {
            updateData.password = encrypt(password);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const revealPassword = async (req, res) => {
    try {
        const { adminPassword, targetUserId } = req.body;
        const adminId = req.user.id; // From auth middleware

        if (!adminPassword || !targetUserId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Verify Admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Decrypt stored admin password to compare with input
        const decryptedAdminPassword = decrypt(admin.password);

        // Debugging logs (Remove in strict production, helpful here)
        if (!decryptedAdminPassword) {
            console.error(`[Reveal] Decryption failed for admin: ${admin.email}. Stored len: ${admin.password?.length}`);
            return res.status(500).json({ message: "Server encryption error (Admin)" });
        }

        if (adminPassword !== decryptedAdminPassword) {
            console.warn(`[Reveal] Password mismatch for admin: ${admin.email}`);
            return res.status(401).json({ message: "Incorrect admin password" });
        }

        // Fetch Target User
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (targetUser.password) {
            if (targetUser.password.startsWith('$2')) {
                return res.json({ password: "Legacy Encrypted (Cannot Reveal)" });
            }
            const revealed = decrypt(targetUser.password);
            if (!revealed) {
                return res.json({ password: "Error: Could not decrypt" });
            }
            return res.json({ password: revealed });
        } else {
            return res.json({ password: "Not available" });
        }

    } catch (error) {
        console.error("Reveal Error:", error);
        res.status(500).json({ message: error.message });
    }
};
