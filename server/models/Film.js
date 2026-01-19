
export default (sequelize, DataTypes) => {
    const Film = sequelize.define("Film", {
        title: { type: DataTypes.STRING, allowNull: false },
        youtubeUrl: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, defaultValue: "Wedding" },
        status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "films", timestamps: true });
    return Film;
};
