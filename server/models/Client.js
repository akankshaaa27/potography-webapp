
export default (sequelize, DataTypes) => {
  const Client = sequelize.define("Client", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    zipCode: { type: DataTypes.STRING },
    category: { type: DataTypes.ENUM('Regular', 'VIP', 'New Inquiry'), defaultValue: 'New Inquiry' },
    tags: { type: DataTypes.JSON },
    notes: { type: DataTypes.TEXT },
    totalBilled: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    totalPaid: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    pendingAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    event: { type: DataTypes.STRING },
    budget: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('Lead', 'Active', 'Archived'), defaultValue: 'Lead' },
    _id: {
      type: DataTypes.VIRTUAL,
      get() { return this.id; }
    }
  }, { tableName: "clients", timestamps: true });
  return Client;
};
