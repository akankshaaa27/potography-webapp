
import db from '../models/index.js';
const { Invoice, Quotation, Client } = db;

// Helper for Response Mapping
const transformInvoice = (inv) => {
  if (!inv) return null;
  const json = inv.toJSON();
  if (json.clientDetails) {
    json.clientId = json.clientDetails;
    delete json.clientDetails;
  }
  if (json.quotation) {
    json.quotationId = json.quotation; // Map relation back to expected key if needed
    delete json.quotation;
  }
  return json;
};

const generateInvoiceNumber = async () => {
  const count = await Invoice.count();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: ['clientDetails', 'quotation'],
      order: [['createdAt', 'DESC']]
    });
    res.json(invoices.map(transformInvoice));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: ['clientDetails', 'quotation']
    });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(transformInvoice(invoice));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    let { clientId, clientName, client, amount, paid, amountPaid, dueDate, invoiceDate, issueDate } = req.body;
    const nameToSearch = clientName || client;

    if (!clientId && nameToSearch) {
      let existingClient = await Client.findOne({ where: { name: nameToSearch } });
      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const newClient = await Client.create({
          name: nameToSearch,
          email: `invoice-${Date.now()}@example.com`,
          phone: "0000000000",
          status: 'Active'
        });
        clientId = newClient.id;
      }
    }

    const invoiceNumber = await generateInvoiceNumber();
    const validInvoiceDate = invoiceDate || issueDate || new Date();
    const validDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invoiceData = {
      ...req.body,
      invoiceNumber,
      client_id: clientId,
      quotation_id: req.body.quotationId, // Ensure mapped correctly from body
      clientName: nameToSearch,
      grandTotal: Number(amount) || Number(req.body.grandTotal) || 0,
      subtotal: Number(amount) || Number(req.body.grandTotal) || 0,
      amountPaid: Number(paid) || Number(amountPaid) || 0,
      invoiceDate: validInvoiceDate,
      eventDate: req.body.eventDate || validInvoiceDate,
      dueDate: validDueDate,
      eventType: req.body.eventType || req.body.event || 'Wedding',
      paymentStatus: req.body.paymentStatus || req.body.status || 'Unpaid',
      services: req.body.services && Array.isArray(req.body.services) ? req.body.services : [],
    };

    const invoice = await Invoice.create(invoiceData);

    if (req.body.quotationId) {
      await Quotation.update(
        { convertedToInvoice: true, invoice_id: invoice.id, status: 'Accepted' },
        { where: { id: req.body.quotationId } }
      );
    }

    if (clientId) {
      const clientRec = await Client.findByPk(clientId);
      if (clientRec) {
        const newTotal = Number(clientRec.totalBilled || 0) + Number(invoice.grandTotal);
        const newPending = newTotal - Number(clientRec.totalPaid || 0); // Logic may vary
        // Simply incrementing logic similar to Mongo $inc
        await Client.increment({ totalBilled: invoice.grandTotal }, { where: { id: clientId } });
        // We should technically recalculate pendingAmount accurately
        // await Client.update({ pendingAmount: ... }, { where: { id: clientId } });
      }
    }

    const savedInvoice = await Invoice.findByPk(invoice.id, { include: ['clientDetails', 'quotation'] });
    res.status(201).json(transformInvoice(savedInvoice));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const [updated] = await Invoice.update(req.body, { where: { id: req.params.id } });
    if (!updated && !(await Invoice.findByPk(req.params.id))) return res.status(404).json({ message: 'Invoice not found' });

    const invoice = await Invoice.findByPk(req.params.id, { include: ['clientDetails', 'quotation'] });
    res.json(transformInvoice(invoice));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    await Invoice.destroy({ where: { id: req.params.id } });

    if (invoice.quotation_id) {
      await Quotation.update(
        { convertedToInvoice: false, invoice_id: null },
        { where: { id: invoice.quotation_id } }
      );
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoicesByClient = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { client_id: req.params.clientId },
      include: ['clientDetails'],
      order: [['createdAt', 'DESC']]
    });
    res.json(invoices.map(transformInvoice));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoicesByPaymentStatus = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { paymentStatus: req.query.status },
      include: ['clientDetails'],
      order: [['createdAt', 'DESC']]
    });
    res.json(invoices.map(transformInvoice));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const [updated] = await Invoice.update(
      { paymentStatus: req.body.paymentStatus },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ message: 'Invoice not found' });

    const invoice = await Invoice.findByPk(req.params.id);
    res.json(transformInvoice(invoice));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOverdueInvoices = async (req, res) => {
  try {
    const today = new Date();
    const { Op } = db.Sequelize;
    const invoices = await Invoice.findAll({
      where: {
        dueDate: { [Op.lt]: today },
        paymentStatus: { [Op.ne]: 'Paid' }
      },
      include: ['clientDetails'],
      order: [['dueDate', 'ASC']]
    });
    res.json(invoices.map(transformInvoice));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
