
export default (sequelize, DataTypes) => {
    const LoveStory = sequelize.define("LoveStory", {
        title: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        // Use TEXT('long') for Base64 images
        thumbnail: { type: DataTypes.TEXT('long'), allowNull: false },
        gallery: { type: DataTypes.JSON },
        status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "love_stories", timestamps: true });
    return LoveStory;
};
