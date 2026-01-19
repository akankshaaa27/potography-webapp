
export default (sequelize, DataTypes) => {
    const Gallery = sequelize.define("Gallery", {
        title: { type: DataTypes.STRING },
        // Use TEXT('long') for Base64 images
        image: { type: DataTypes.TEXT('long'), allowNull: false },
        category: { type: DataTypes.STRING, defaultValue: "General" },
        status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "galleries", timestamps: true });
    return Gallery;
};
