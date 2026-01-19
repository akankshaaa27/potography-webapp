
import db from "../models/index.js";
const { Enquiry } = db;
import { sendEmail } from "../utils/emailService.js";

export const createEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.create(req.body);

        // Send Email Notification
        const adminEmail = "pixelproitsolutions@gmail.com";
        if (adminEmail) {
            const htmlContent = `
                <h2>New "Book Us" Enquiry Received</h2>
                <p><strong>Couple:</strong> ${enquiry.groomName} & ${enquiry.brideName}</p>
                <p><strong>Phone:</strong> ${enquiry.phoneNumber}</p>
                <p><strong>Date:</strong> ${new Date(enquiry.eventStartDate).toDateString()} - ${new Date(enquiry.eventEndDate).toDateString()}</p>
                <p><strong>Location:</strong> ${enquiry.location}</p>
                <p><strong>Budget:</strong> ${enquiry.budget}</p>
                <p><strong>Message:</strong> ${enquiry.message}</p>
                <br>
                <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/enquiries">View in Admin Panel</a>
            `;

            await sendEmail({
                to: adminEmail,
                subject: `New Enquiry: ${enquiry.groomName} & ${enquiry.brideName}`,
                html: htmlContent,
                replyTo: "",
            });
        }

        res.status(201).json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.findAll({ order: [['createdAt', 'DESC']] });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const [updated] = await Enquiry.update({ status }, { where: { id: req.params.id } });

        if (!updated && !(await Enquiry.findByPk(req.params.id))) return res.status(404).json({ message: "Enquiry not found" });

        const enquiry = await Enquiry.findByPk(req.params.id);
        res.json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEnquiry = async (req, res) => {
    try {
        const deleted = await Enquiry.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Enquiry not found" });
        res.json({ message: "Enquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
