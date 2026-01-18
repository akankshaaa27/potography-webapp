import Enquiry from "../models/Enquiry.js";

// Create a new enquiry (Public)
export const createEnquiry = async (req, res) => {
    try {
        const enquiry = new Enquiry(req.body);
        await enquiry.save();
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
