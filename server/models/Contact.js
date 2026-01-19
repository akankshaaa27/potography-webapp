
export default (sequelize, DataTypes) => {
    const Contact = sequelize.define("Contact", {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        subject: { type: DataTypes.STRING, allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.ENUM("New", "Read", "Replied"), defaultValue: "New" },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "contacts", timestamps: true });
    return Contact;
};
