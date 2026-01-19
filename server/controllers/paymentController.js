
import db from '../models/index.js';
const { Payment, Invoice, Client } = db;

export const recordPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId, notes } = req.body;
    const invoiceId = req.params.invoiceId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const payment = await Payment.create({
      invoice_id: invoiceId,
      client_id: invoice.client_id,
      amount,
      paymentMethod,
      transactionId,
      notes,
    });

    // Calculate total paid
    const allPayments = await Payment.findAll({ where: { invoice_id: invoiceId } });
    const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    let paymentStatus = 'Unpaid';
    if (totalPaid >= Number(invoice.grandTotal)) {
      paymentStatus = 'Paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'Partially Paid';
    }

    await Invoice.update({ paymentStatus, amountPaid: totalPaid }, { where: { id: invoiceId } });

    // Update Client Totals
    if (invoice.client_id) {
      const client = await Client.findByPk(invoice.client_id);
      // Correct logic: Re-calculate totalPaid for Client from ALL their invoices or just increment?
      // Increment is simpler for now.
      await Client.increment({ totalPaid: amount }, { where: { id: invoice.client_id } });
      // Recalc pending
      // const pending = client.totalBilled - (client.totalPaid + amount);
      // await Client.update({ pendingAmount: pending }, { where: { id: invoice.client_id } });
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPaymentsByInvoice = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { invoice_id: req.params.invoiceId },
      order: [['paymentDate', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentsByClient = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { client_id: req.params.clientId },
      order: [['paymentDate', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    await Payment.destroy({ where: { id: req.params.id } });

    // Recalc Invoice
    const invoice = await Invoice.findByPk(payment.invoice_id);
    const allPayments = await Payment.findAll({ where: { invoice_id: payment.invoice_id } });
    const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    let paymentStatus = 'Unpaid';
    if (totalPaid >= Number(invoice.grandTotal)) {
      paymentStatus = 'Paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'Partially Paid';
    }

    await Invoice.update({ paymentStatus, amountPaid: totalPaid }, { where: { id: payment.invoice_id } });

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: ['invoice', 'client'],
      order: [['paymentDate', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: ['invoice', 'client']
    });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentSummary = async (req, res) => {
  try {
    // Aggregation is better done via SQL SUM, but logic here follows original pattern
    const payments = await Payment.findAll();
    const invoices = await Invoice.findAll();

    const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.grandTotal || 0), 0);
    const totalReceived = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const pendingPayments = totalBilled - totalReceived;

    res.json({
      totalBilled,
      totalReceived,
      pendingPayments,
      totalInvoices: invoices.length,
      totalPayments: payments.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
