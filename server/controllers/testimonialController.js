
import db from "../models/index.js";
const { Testimonial } = db;
import { saveBase64Image } from "../utils/fileHelper.js";

export const createTestimonial = async (req, res) => {
    try {
        const { coupleName, location, thumbnail, shortDescription, fullDescription, rating, displayOrder, status } = req.body;

        const thumbnailPath = saveBase64Image(thumbnail);

        const testimonial = await Testimonial.create({
            coupleName,
            location,
            thumbnail: thumbnailPath || thumbnail,
            shortDescription,
            fullDescription,
            rating,
            displayOrder,
            status
        });
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllTestimonials = async (req, res) => {
    try {
        const { type } = req.query;
        let where = {};

        if (type === 'active') {
            where.status = 'Active';
            const testimonials = await Testimonial.findAll({
                where,
                order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
            });
            return res.json(testimonials);
        }

        const testimonials = await Testimonial.findAll({ order: [['createdAt', 'DESC']] });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByPk(req.params.id);
        if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTestimonial = async (req, res) => {
    try {
        const { coupleName, location, thumbnail, shortDescription, fullDescription, rating, displayOrder, status } = req.body;
        let updateData = { coupleName, location, shortDescription, fullDescription, rating, displayOrder, status };

        if (thumbnail) {
            const thumbnailPath = saveBase64Image(thumbnail);
            updateData.thumbnail = thumbnailPath || thumbnail;
        }

        const [updated] = await Testimonial.update(updateData, { where: { id: req.params.id } });
        if (!updated && !(await Testimonial.findByPk(req.params.id))) return res.status(404).json({ message: "Testimonial not found" });

        const testimonial = await Testimonial.findByPk(req.params.id);
        res.json(testimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const deleted = await Testimonial.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
        res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
