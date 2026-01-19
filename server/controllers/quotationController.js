
import db from '../models/index.js';
const { Quotation, Client } = db;

// Helper to mimic Mongoose populate behavior
const transformQuotation = (q) => {
  if (!q) return null;
  const json = q.toJSON();
  if (json.client) {
    json.clientId = json.client;
    delete json.client;
  }
  return json;
};

const generateQuotationNumber = async () => {
  const count = await Quotation.count();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `QT-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      include: ['client'],
      order: [['createdAt', 'DESC']]
    });
    res.json(quotations.map(transformQuotation));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, { include: ['client'] });
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json(transformQuotation(quotation));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuotation = async (req, res) => {
  try {
    let { clientId, clientName, client } = req.body;
    const nameToSearch = clientName || client;

    // Logic: clientId might be an object ID string or int. In SQL it's int.
    // If incoming clientId is string (from old frontend?), we might need to be careful.
    // Assuming new system or consistent IDs.

    if (!clientId && nameToSearch) {
      let existingClient = await Client.findOne({ where: { name: nameToSearch } });
      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const newClient = await Client.create({
          name: nameToSearch,
          email: `pending-${Date.now()}@example.com`,
          phone: "0000000000",
          status: 'Lead'
        });
        clientId = newClient.id;
      }
    }

    const quotationNumber = await generateQuotationNumber();
    const quotationData = {
      ...req.body,
      quotationNumber,
      client_id: clientId,
      clientName: nameToSearch,
      services: req.body.services, // Ensure services is passed (JSON)
      deliverables: req.body.deliverables
    };

    const quotation = await Quotation.create(quotationData);

    // Fetch again to include client
    const savedQuotation = await Quotation.findByPk(quotation.id, { include: ['client'] });

    res.status(201).json(transformQuotation(savedQuotation));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateQuotation = async (req, res) => {
  try {
    const [updated] = await Quotation.update(req.body, { where: { id: req.params.id } });

    if (!updated && !(await Quotation.findByPk(req.params.id))) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const quotation = await Quotation.findByPk(req.params.id, { include: ['client'] });
    res.json(transformQuotation(quotation));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteQuotation = async (req, res) => {
  try {
    const deleted = await Quotation.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const duplicateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const quotationNumber = await generateQuotationNumber();
    const newData = quotation.toJSON();
    delete newData.id;
    delete newData._id;
    delete newData.createdAt;
    delete newData.updatedAt;

    const newQuotation = await Quotation.create({
      ...newData,
      quotationNumber,
      quotationDate: new Date(),
      status: 'Draft',
      convertedToInvoice: false,
      invoice_id: null,
    });

    const savedQuotation = await Quotation.findByPk(newQuotation.id, { include: ['client'] });
    res.status(201).json(transformQuotation(savedQuotation));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getQuotationsByClient = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      where: { client_id: req.params.clientId },
      include: ['client'],
      order: [['createdAt', 'DESC']]
    });
    res.json(quotations.map(transformQuotation));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuotationsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const quotations = await Quotation.findAll({
      where: { status },
      include: ['client'],
      order: [['createdAt', 'DESC']]
    });
    res.json(quotations.map(transformQuotation));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
