
import db from '../models/index.js';
const { Client } = db;
import { Op } from 'sequelize';

// Get all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({ order: [['createdAt', 'DESC']] });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single client
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create client
export const createClient = async (req, res) => {
  const { name, email, phone, whatsapp, address, city, state, zipCode, category, tags, notes, event, budget, status } = req.body;

  // Validation
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required' });
  }

  try {
    const client = await Client.create({
      name,
      email,
      phone: phone || whatsapp,
      address,
      city,
      state,
      zipCode,
      category,
      tags,
      notes,
      event,
      budget,
      status,
    });

    res.status(201).json(client);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update client
export const updateClient = async (req, res) => {
  try {
    const [updated] = await Client.update(req.body, { where: { id: req.params.id } });

    if (!updated && !(await Client.findByPk(req.params.id))) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const client = await Client.findByPk(req.params.id);
    res.json(client);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete client
export const deleteClient = async (req, res) => {
  try {
    const deleted = await Client.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search clients
export const searchClients = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const clients = await Client.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { phone: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
