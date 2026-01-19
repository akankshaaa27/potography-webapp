
export default (sequelize, DataTypes) => {
    const Slider = sequelize.define("Slider", {
        title: { type: DataTypes.STRING, allowNull: false },
        subtitle: { type: DataTypes.STRING },
        // Use TEXT (longtext) for Base64 images as they are > 255 chars
        image: { type: DataTypes.TEXT('long'), allowNull: false },
        status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
        order: { type: DataTypes.INTEGER, defaultValue: 0 },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "sliders", timestamps: true });
    return Slider;
};
