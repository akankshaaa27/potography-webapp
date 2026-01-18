import Client from "../models/Client.js";
import Enquiry from "../models/Enquiry.js";
import Order from "../models/Order.js";
import Invoice from "../models/Invoice.js";
import Quotation from "../models/Quotation.js";
import Contact from "../models/Contact.js";
import Gallery from "../models/Gallery.js";

export const getDashboardStats = async (req, res) => {
    try {
        const clientsCount = await Client.countDocuments();
        const enquiriesCount = await Enquiry.countDocuments();
        const ordersCount = await Order.countDocuments();
        const invoicesCount = await Invoice.countDocuments();
        const quotationsCount = await Quotation.countDocuments();
        const contactsCount = await Contact.countDocuments();
        const galleryCount = await Gallery.countDocuments();

        // Calculate total revenue (paid invoices)
        const paidInvoices = await Invoice.find({ status: "Paid" });
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

        // Pending actions
        const pendingEnquiries = await Enquiry.countDocuments({ status: "Pending" });
        const pendingContacts = await Contact.countDocuments({ status: "New" });

        res.json({
            metrics: {
                totalClients: clientsCount,
                activeShoots: ordersCount,
                pipelineValue: quotationsCount, // Simplify for now
                totalRevenue: totalRevenue
            },
            actionQueue: [
                { label: "New Enquiries", count: pendingEnquiries, link: "/enquiries" },
                { label: "Contact Messages", count: pendingContacts, link: "/contact-messages" }
            ],
            upcomingShoots: [], // Populate if we have date logic
            recentActivity: []
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats" });
    }
};
