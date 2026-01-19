
export default (sequelize, DataTypes) => {
    const Enquiry = sequelize.define("Enquiry", {
        groomName: { type: DataTypes.STRING, allowNull: false },
        brideName: { type: DataTypes.STRING, allowNull: false },
        phoneNumber: { type: DataTypes.STRING, allowNull: false },
        eventStartDate: { type: DataTypes.DATE, allowNull: false },
        eventEndDate: { type: DataTypes.DATE, allowNull: false },
        events: { type: DataTypes.JSON },
        budget: { type: DataTypes.DECIMAL(10, 2) },
        location: { type: DataTypes.STRING, allowNull: false },
        services: { type: DataTypes.JSON },
        message: { type: DataTypes.TEXT },
        status: { type: DataTypes.ENUM("New", "Contacted", "Booked", "Closed"), defaultValue: "New" },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "enquiries", timestamps: true });
    return Enquiry;
};
