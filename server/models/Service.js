
export default (sequelize, DataTypes) => {
  const Service = sequelize.define("Service", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.ENUM('photography', 'video', 'drone', 'product', 'other'), defaultValue: 'photography' },
    ratePerDay: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    ratePerUnit: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    _id: {
      type: DataTypes.VIRTUAL,
      get() { return this.id; }
    }
  }, { tableName: "services", timestamps: true });
  return Service;
}
