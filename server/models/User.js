
export default (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM("user", "admin", "editor"), defaultValue: "user" },
        phone: { type: DataTypes.STRING },
        status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
        _id: {
            type: DataTypes.VIRTUAL,
            get() { return this.id; }
        }
    }, { tableName: "users", timestamps: true });
    return User;
};
