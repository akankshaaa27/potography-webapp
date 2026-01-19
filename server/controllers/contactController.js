
import db from "../models/index.js";
const { Contact } = db;
import { sendEmail } from "../utils/emailService.js";

export const createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);

        // Send Email Notification
        const adminEmail = "pixelproitsolutions@gmail.com";
        if (adminEmail) {
            const htmlContent = `
                <h2>New Contact Message Received</h2>
                <p><strong>Name:</strong> ${contact.name}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Subject:</strong> ${contact.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${contact.message}</p>
                <br>
                <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/contact-messages">View in Admin Panel</a>
            `;

            await sendEmail({
                to: adminEmail,
                subject: `New Message: ${contact.subject}`,
                html: htmlContent,
                replyTo: contact.email,
            });
        }

        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const [updated] = await Contact.update({ status }, { where: { id: req.params.id } });

        if (!updated && !(await Contact.findByPk(req.params.id))) return res.status(404).json({ message: "Contact not found" });

        const contact = await Contact.findByPk(req.params.id);
        res.json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const deleted = await Contact.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Contact not found" });
        res.json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
