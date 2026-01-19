
import db from "../models/index.js";
const { Film } = db;

export const getAllFilms = async (req, res) => {
    try {
        const films = await Film.findAll({ order: [['createdAt', 'DESC']] });
        res.json(films);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createFilm = async (req, res) => {
    try {
        const film = await Film.create(req.body);
        res.status(201).json(film);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateFilm = async (req, res) => {
    try {
        const [updated] = await Film.update(req.body, { where: { id: req.params.id } });
        if (!updated && !(await Film.findByPk(req.params.id))) return res.status(404).json({ message: "Film not found" });

        const film = await Film.findByPk(req.params.id);
        res.json(film);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFilm = async (req, res) => {
    try {
        const deleted = await Film.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Film not found" });
        res.json({ message: "Film deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
