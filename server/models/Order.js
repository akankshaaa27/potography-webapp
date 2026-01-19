
export default (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        name: { type: DataTypes.STRING, allowNull: false },
        whatsapp_no: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING },
        event_name: { type: DataTypes.STRING },
        photography_type: { type: DataTypes.STRING },
        location: { type: DataTypes.STRING },
        event_date: { type: DataTypes.DATE },
        event_end_date: { type: DataTypes.DATE },
        serviceConfig: { type: DataTypes.JSON },
        start_time: { type: DataTypes.STRING },
        end_time: { type: DataTypes.STRING },
        service: { type: DataTypes.STRING },
        album_pages: { type: DataTypes.STRING },
        amount: { type: DataTypes.DECIMAL(10, 2) },
        amount_paid: { type: DataTypes.DECIMAL(10, 2) },
        remaining_amount: { type: DataTypes.DECIMAL(10, 2) },
        deliverables: { type: DataTypes.TEXT },
        delivery_date: { type: DataTypes.DATE },
        order_status: { type: DataTypes.ENUM("Pending", "In Progress", "Delivered", "Cancelled"), defaultValue: "Pending" },
        notes: { type: DataTypes.TEXT },
        relatedUser_id: { type: DataTypes.INTEGER },
        client_id: { type: DataTypes.INTEGER },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "orders", timestamps: true });
    return Order;
};
