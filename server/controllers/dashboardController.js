
import db from "../models/index.js";
import { Op } from "sequelize";
const { Client, Enquiry, Order, Invoice, Quotation, Contact, Gallery, Testimonial, Slider, LoveStory } = db;

export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // --- 1. Top Summary Cards (KPIs) ---
        const newEnquiriesToday = await Enquiry.count({ where: { createdAt: { [Op.gte]: today } } });
        const newEnquiriesWeek = await Enquiry.count({ where: { createdAt: { [Op.gte]: last7Days } } });

        const pendingOrders = await Order.count({ where: { order_status: { [Op.in]: ['Pending', 'In Progress'] } } });

        const pendingQuotations = await Quotation.count({ where: { status: { [Op.in]: ['Draft', 'Sent', 'Negotiation'] } } });

        const unpaidInvoices = await Invoice.findAll({
            where: { paymentStatus: { [Op.in]: ['Unpaid', 'Overdue', 'Partial', 'Partially Paid'] } },
            attributes: ['grandTotal', 'amountPaid']
        });
        const unpaidCount = unpaidInvoices.length;
        const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + (Number(inv.grandTotal) - Number(inv.amountPaid || 0)), 0);

        const upcomingShootsCount = await Order.count({
            where: {
                event_date: { [Op.gte]: today, [Op.lte]: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) }
            }
        });

        const unreadMessages = await Contact.count({ where: { status: 'New' } });

        const activeClientsMonth = await Client.count({ where: { createdAt: { [Op.gte]: firstDayOfMonth } } });

        const pendingTestimonials = await Testimonial.count({ where: { status: 'Inactive' } });

        // --- 2. Action Required (Needs Attention) ---
        const urgentEnquiries = await Enquiry.findAll({
            where: {
                status: 'New',
                createdAt: { [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Older than 24h
            },
            limit: 5,
            order: [['createdAt', 'ASC']]
        });

        const stuckQuotations = await Quotation.findAll({
            where: {
                status: 'Sent',
                updatedAt: { [Op.lt]: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } // Older than 3 days
            },
            limit: 5
        });

        const overdueInvoices = await Invoice.findAll({
            where: {
                paymentStatus: { [Op.in]: ['Unpaid', 'Overdue'] },
                dueDate: { [Op.lt]: today }
            },
            limit: 5
        });

        const stuckOrders = await Order.findAll({
            where: {
                order_status: 'Pending',
                createdAt: { [Op.lt]: last7Days }
            },
            limit: 5
        });

        // --- 3. Orders Pipeline ---
        const orderStatuses = ['Pending', 'In Progress', 'Delivered', 'Cancelled'];
        const pipelineStats = await Order.findAll({
            attributes: ['order_status', [db.sequelize.fn('COUNT', 'order_status'), 'count']],
            group: ['order_status']
        });
        const pipelineMap = {};
        pipelineStats.forEach(stat => {
            pipelineMap[stat.order_status] = stat.dataValues.count;
        });

        // --- 4. Upcoming Schedule ---
        const upcomingShoots = await Order.findAll({
            where: {
                event_date: { [Op.gte]: today }
            },
            order: [['event_date', 'ASC']],
            limit: 5,
            attributes: ['id', 'event_name', 'name', 'event_date', 'photography_type', 'location']
        });

        // --- 5. Revenue Snapshot ---
        const invoicesThisMonth = await Invoice.findAll({
            where: {
                invoiceDate: { [Op.gte]: firstDayOfMonth }
            }
        });
        const billedThisMonth = invoicesThisMonth.reduce((sum, inv) => sum + Number(inv.grandTotal || 0), 0);
        const collectedThisMonth = invoicesThisMonth.reduce((sum, inv) => sum + Number(inv.amountPaid || 0), 0);

        // --- 6. Recent Activity (Simulated by latest items from 3-4 collections) ---
        const recentOrders = await Order.findAll({ limit: 3, order: [['createdAt', 'DESC']], attributes: ['id', 'name', 'createdAt', 'order_status'] });
        const recentEnquiries = await Enquiry.findAll({ limit: 3, order: [['createdAt', 'DESC']], attributes: ['id', 'groomName', 'brideName', 'createdAt', 'status'] });
        const recentInvoicesRaw = await Invoice.findAll({ limit: 3, order: [['createdAt', 'DESC']], attributes: ['id', 'invoiceNumber', 'createdAt', 'grandTotal'] });

        let activityFeed = [
            ...recentOrders.map(o => ({ type: 'Order', message: `New Order from ${o.name}`, date: o.createdAt, link: `/orders/${o.id}` })),
            ...recentEnquiries.map(e => ({ type: 'Enquiry', message: `Enquiry: ${e.groomName} & ${e.brideName}`, date: e.createdAt, link: `/enquiries` })),
            ...recentInvoicesRaw.map(i => ({ type: 'Invoice', message: `Invoice #${i.invoiceNumber} created`, date: i.createdAt, link: `/invoices/${i.id}` }))
        ];
        activityFeed.sort((a, b) => new Date(b.date) - new Date(a.date));
        activityFeed = activityFeed.slice(0, 10);

        // --- 9. Content Health ---
        const sliderStats = {
            active: await Slider.count({ where: { status: 'Active' } }),
            inactive: await Slider.count({ where: { status: 'Inactive' } })
        };
        const loveStoryStats = {
            active: await LoveStory.count({ where: { status: 'Active' } }),
            inactive: await LoveStory.count({ where: { status: 'Inactive' } })
        };
        const testimonialStats = {
            active: await Testimonial.count({ where: { status: 'Active' } }),
            inactive: await Testimonial.count({ where: { status: 'Inactive' } })
        };
        const galleryStats = {
            active: await Gallery.count({ where: { status: 'Active' } }),
            inactive: await Gallery.count({ where: { status: 'Inactive' } })
        };

        res.json({
            kpi: {
                newEnquiries: { today: newEnquiriesToday, week: newEnquiriesWeek },
                pendingOrders,
                pendingQuotations,
                unpaidInvoices: { count: unpaidCount, amount: unpaidAmount },
                upcomingShoots: upcomingShootsCount,
                unreadMessages,
                activeClientsMonth,
                pendingTestimonials
            },
            actionRequired: {
                urgentEnquiries,
                stuckQuotations,
                overdueInvoices,
                stuckOrders
            },
            pipeline: pipelineMap,
            upcomingSchedule: upcomingShoots,
            revenue: {
                billedThisMonth,
                collectedThisMonth,
                outstanding: billedThisMonth - collectedThisMonth
            },
            activityFeed,
            contentHealth: {
                slider: sliderStats,
                loveStories: loveStoryStats,
                testimonials: testimonialStats,
                gallery: galleryStats
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};
