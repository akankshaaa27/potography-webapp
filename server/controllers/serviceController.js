
import db from '../models/index.js';
const { Service } = db;

const DEFAULT_SERVICES = [
  { name: 'Traditional Photography', category: 'photography', ratePerDay: 25000 },
  { name: 'Candid Photography', category: 'photography', ratePerDay: 20000 },
  { name: 'Cinematic Wedding Film', category: 'video', ratePerDay: 40000 },
  { name: 'Traditional Video', category: 'video', ratePerDay: 30000 },
  { name: 'Drone Shoot', category: 'drone', ratePerDay: 15000 },
  { name: 'Wedding Albums', category: 'product', ratePerUnit: 5000 },
  { name: 'Frames', category: 'product', ratePerUnit: 2000 },
];

export const getAllServices = async (req, res) => {
  try {
    let services = await Service.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });

    if (services.length === 0) {
      await Service.bulkCreate(DEFAULT_SERVICES);
      services = await Service.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
    }

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  const { name, description, category, ratePerDay, ratePerUnit } = req.body;

  if (!name || (!ratePerDay && !ratePerUnit)) {
    return res.status(400).json({ message: 'Name and rate are required' });
  }

  try {
    const service = await Service.create({
      name,
      description,
      category,
      ratePerDay,
      ratePerUnit,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const [updated] = await Service.update(req.body, { where: { id: req.params.id } });

    if (!updated && !(await Service.findByPk(req.params.id))) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const service = await Service.findByPk(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    // Soft delete
    const [updated] = await Service.update({ isActive: false }, { where: { id: req.params.id } });

    if (!updated && !(await Service.findByPk(req.params.id))) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
