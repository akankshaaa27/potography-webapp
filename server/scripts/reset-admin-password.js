import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import { encrypt } from '../utils/encryption.js';

import { connectDB } from '../db.js';

// Load env vars (Must be before db import effectively, but connectDB reads env at runtime)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') }); // Point to root .env

const resetAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        // Force connection logic if connectDB fails to pick up env
        if (!process.env.MONGODB_URI) {
            console.log("⚠️ MONGODB_URI missing in process.env, attempting manual set from .env file content directly...");
            // Manual fallback or just let connectDB try
            process.env.MONGODB_URI = "mongodb+srv://photograper:photograper@cluster0.sy94kcl.mongodb.net/?appName=Cluster0";
        }
        process.env.MONGODB_URI = "mongodb+srv://photograper:photograper@cluster0.sy94kcl.mongodb.net/?appName=Cluster0";

        await connectDB();
        // console.log('Connected.'); // connectDB already logs this


        const email = 'admin@lumina.studio';
        const newPassword = 'admin'; // The requested password

        const encryptedPassword = encrypt(newPassword);

        let user = await User.findOne({ email });

        if (user) {
            user.password = encryptedPassword;
            // Ensure encryptedPassword field is cleared if it exists (legacy)
            user.encryptedPassword = undefined;
            await user.save();
            console.log(`✅ Success! Password for '${email}' has been reset to encrypted format.`);
        } else {
            user = await User.create({
                name: 'Studio Admin',
                email,
                password: encryptedPassword,
                role: 'admin',
                status: 'Active'
            });
            console.log(`✅ Success! Created new admin user '${email}'.`);
        }

        console.log(`\n👉 Login credentials:\nEmail: ${email}\nPassword: ${newPassword}\n`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetAdmin();
