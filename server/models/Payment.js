
export default (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    invoice_id: { type: DataTypes.INTEGER, allowNull: false },
    client_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    paymentMethod: { type: DataTypes.ENUM('Cash', 'Bank Transfer', 'UPI', 'Credit Card', 'Cheque', 'Other'), allowNull: false },
    transactionId: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    isRecorded: { type: DataTypes.BOOLEAN, defaultValue: true },
    _id: {
      type: DataTypes.VIRTUAL,
      get() { return this.id; }
    }
  }, { tableName: "payments", timestamps: true });
  return Payment;
};
