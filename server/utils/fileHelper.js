
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const saveBase64Image = (base64String, folder = 'uploads') => {
    if (!base64String || typeof base64String !== 'string') return null;

    // Check if it's already a URL/path
    if (base64String.startsWith('http') || base64String.startsWith('/uploads')) {
        return base64String;
    }

    try {
        const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return base64String; // Return as is if format matches URL or invalid base64
        }

        const type = matches[1];
        const data = matches[2];
        const extension = type.split('/')[1];
        const fileName = `${uuidv4()}.${extension}`;
        const filePath = path.join(process.cwd(), folder, fileName);

        // Ensure directory exists
        if (!fs.existsSync(path.join(process.cwd(), folder))) {
            fs.mkdirSync(path.join(process.cwd(), folder), { recursive: true });
        }

        fs.writeFileSync(filePath, data, 'base64');

        // Return relative URL path
        return `/${folder}/${fileName}`;
    } catch (error) {
        console.error('Error saving base64 image:', error);
        return null;
    }
};
