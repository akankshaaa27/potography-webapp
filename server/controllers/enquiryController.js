import Enquiry from "../models/Enquiry.js";

import { sendEmail } from "../utils/emailService.js";

// Create a new enquiry (Public)
export const createEnquiry = async (req, res) => {
    try {
        const enquiry = new Enquiry(req.body);
        await enquiry.save();

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

// Get all enquiries (Admin)
export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update enquiry status (Admin)
export const updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
        res.json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete enquiry (Admin)
export const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
        res.json({ message: "Enquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
