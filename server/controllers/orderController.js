
import db from "../models/index.js";
const { Order, Client } = db;

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: ['relatedUser'],
            order: [['delivery_date', 'DESC'], ['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const orderData = { ...req.body };
        const { name, email, whatsapp_no } = orderData;

        // Try to link with existing client or create new one
        if (name || email || whatsapp_no) {

            // Try to find client by unique identifiers
            let client = null;
            if (email) client = await Client.findOne({ where: { email } });
            if (!client && whatsapp_no) client = await Client.findOne({ where: { phone: whatsapp_no } });
            if (!client && name) client = await Client.findOne({ where: { name } });

            if (client) {
                orderData.client_id = client.id;
            } else {
                // Create new client if enough info
                try {
                    client = await Client.create({
                        name: name || "Unknown",
                        email: email || `temp_${Date.now()}@example.com`,
                        phone: whatsapp_no || "0000000000",
                        category: "Regular", // Default
                        tags: ["Order"]
                    });
                    orderData.client_id = client.id;
                } catch (clientErr) {
                    console.error("Auto-create client failed:", clientErr);
                    // Proceed without linking if client creation fails
                }
            }
        }

        const order = await Order.create(orderData);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const [updated] = await Order.update(req.body, { where: { id: req.params.id } });
        if (!updated && !(await Order.findByPk(req.params.id))) return res.status(404).json({ message: "Order not found" });

        const order = await Order.findByPk(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
