import Contact from "../models/Contact.js";

import { sendEmail } from "../utils/emailService.js";

// Create a new contact message (Public)
export const createContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();

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

// Get all contact messages (Admin)
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update contact status (Admin)
export const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        res.json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete contact (Admin)
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        res.json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
