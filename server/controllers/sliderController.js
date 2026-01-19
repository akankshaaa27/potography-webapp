
import db from "../models/index.js";
const { Slider } = db;
import { saveBase64Image } from "../utils/fileHelper.js";

export const getAllSliders = async (req, res) => {
    try {
        const sliders = await Slider.findAll({ order: [['order', 'ASC']] });
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSlider = async (req, res) => {
    try {
        const { title, subtitle, image, status, order } = req.body;

        // Convert Base64 image to file path
        const imagePath = saveBase64Image(image);

        const slider = await Slider.create({
            title,
            subtitle,
            image: imagePath || image, // Fallback to original if save fails (or if not base64)
            status,
            order
        });
        res.status(201).json(slider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSlider = async (req, res) => {
    try {
        const { title, subtitle, image, status, order } = req.body;

        let updateData = { title, subtitle, status, order };

        // Only process image if it's new (likely base64)
        if (image) {
            const imagePath = saveBase64Image(image);
            updateData.image = imagePath || image;
        }

        const [updated] = await Slider.update(updateData, { where: { id: req.params.id } });
        if (!updated && !(await Slider.findByPk(req.params.id))) return res.status(404).json({ message: "Slider not found" });

        const slider = await Slider.findByPk(req.params.id);
        res.json(slider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSlider = async (req, res) => {
    try {
        const deleted = await Slider.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Slider not found" });
        res.json({ message: "Slider deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
