
import db from "../models/index.js";
const { LoveStory } = db;
import { saveBase64Image } from "../utils/fileHelper.js";

export const getAllLoveStories = async (req, res) => {
    try {
        const stories = await LoveStory.findAll({ order: [['createdAt', 'DESC']] });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLoveStoryById = async (req, res) => {
    try {
        const story = await LoveStory.findByPk(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });
        res.json(story);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createLoveStory = async (req, res) => {
    try {
        const { title, location, description, thumbnail, gallery, status } = req.body;

        const thumbnailPath = saveBase64Image(thumbnail);

        // Process gallery images if present
        let processedGallery = [];
        if (gallery && Array.isArray(gallery)) {
            processedGallery = gallery.map(img => saveBase64Image(img) || img);
        }

        const story = await LoveStory.create({
            title,
            location,
            description,
            thumbnail: thumbnailPath || thumbnail,
            gallery: processedGallery,
            status
        });
        res.status(201).json(story);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateLoveStory = async (req, res) => {
    try {
        const { title, location, description, thumbnail, gallery, status } = req.body;
        let updateData = { title, location, description, status };

        if (thumbnail) {
            const thumbnailPath = saveBase64Image(thumbnail);
            updateData.thumbnail = thumbnailPath || thumbnail;
        }

        // Process gallery images if present
        if (gallery && Array.isArray(gallery)) {
            // We need to be careful not to re-process existing paths
            // Existing paths will start with /uploads or http
            updateData.gallery = gallery.map(img => {
                // If it's a base64 string, save it
                if (img.startsWith('data:')) {
                    return saveBase64Image(img);
                }
                return img; // Return as is if it's already a path
            });
        }

        const [updated] = await LoveStory.update(updateData, { where: { id: req.params.id } });
        if (!updated && !(await LoveStory.findByPk(req.params.id))) return res.status(404).json({ message: "Story not found" });

        const story = await LoveStory.findByPk(req.params.id);
        res.json(story);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteLoveStory = async (req, res) => {
    try {
        const deleted = await LoveStory.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Story not found" });
        res.json({ message: "Story deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
