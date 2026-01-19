
export default (sequelize, DataTypes) => {
    const Testimonial = sequelize.define("Testimonial", {
        coupleName: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING },
        // Use TEXT('long') for Base64 images
        thumbnail: { type: DataTypes.TEXT('long') },
        shortDescription: { type: DataTypes.STRING, allowNull: false },
        fullDescription: { type: DataTypes.TEXT },
        rating: { type: DataTypes.INTEGER, defaultValue: 5 },
        displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
        status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "testimonials", timestamps: true });
    return Testimonial;
};
