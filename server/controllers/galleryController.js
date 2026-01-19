
import db from "../models/index.js";
const { Gallery } = db;
import { saveBase64Image } from "../utils/fileHelper.js";

export const getAllGalleryItems = async (req, res) => {
    try {
        const items = await Gallery.findAll({ order: [['createdAt', 'DESC']] });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGalleryItem = async (req, res) => {
    try {
        const { title, image, category, status } = req.body;

        const imagePath = saveBase64Image(image);

        const item = await Gallery.create({
            title,
            image: imagePath || image,
            category,
            status
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateGalleryItem = async (req, res) => {
    try {
        const { title, image, category, status } = req.body;
        let updateData = { title, category, status };

        if (image) {
            const imagePath = saveBase64Image(image);
            updateData.image = imagePath || image;
        }

        const [updated] = await Gallery.update(updateData, { where: { id: req.params.id } });
        if (!updated && !(await Gallery.findByPk(req.params.id))) return res.status(404).json({ message: "Item not found" });

        const item = await Gallery.findByPk(req.params.id);
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteGalleryItem = async (req, res) => {
    try {
        const deleted = await Gallery.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
