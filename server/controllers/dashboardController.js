
import db from "../models/index.js";
const { Client, Enquiry, Order, Invoice, Quotation, Contact, Gallery } = db;

export const getDashboardStats = async (req, res) => {
    try {
        const clientsCount = await Client.count();
        const enquiriesCount = await Enquiry.count();
        const ordersCount = await Order.count();
        const invoicesCount = await Invoice.count();
        const quotationsCount = await Quotation.count();
        const contactsCount = await Contact.count();
        const galleryCount = await Gallery.count();

        // Calculate total revenue (paid invoices)
        // Check exact enum value for Paid
        const paidInvoices = await Invoice.findAll({ where: { paymentStatus: 'Paid' } });
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (Number(inv.grandTotal) || 0), 0);

        // Pending actions
        const pendingEnquiries = await Enquiry.count({ where: { status: "New" } }); // Assuming 'New' is pending
        const pendingContacts = await Contact.count({ where: { status: "New" } });

        res.json({
            metrics: {
                totalClients: clientsCount,
                activeShoots: ordersCount,
                pipelineValue: quotationsCount,
                totalRevenue: totalRevenue
            },
            actionQueue: [
                { label: "New Enquiries", count: pendingEnquiries, link: "/enquiries" },
                { label: "Contact Messages", count: pendingContacts, link: "/contact-messages" }
            ],
            upcomingShoots: [],
            recentActivity: []
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats" });
    }
};
