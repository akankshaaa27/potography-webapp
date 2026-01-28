import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') }); // Point to root .env

// Simple User Schema definition if model import fails or to avoid dependency issues
// but better to try dynamic import of the model if possible. 
// Since we are in a module system, we can import the model relative to this script.
import User from '../models/User.js';

const resetAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const email = 'admin@lumina.studio';
        const newPassword = 'admin'; // The requested password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        let user = await User.findOne({ email });

        if (user) {
            user.password = hashedPassword;
            await user.save();
            console.log(`✅ Success! Password for '${email}' has been reset.`);
        } else {
            user = await User.create({
                name: 'Studio Admin',
                email,
                password: hashedPassword,
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
