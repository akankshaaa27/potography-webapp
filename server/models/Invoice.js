
export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
    invoiceNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    client_id: { type: DataTypes.INTEGER },
    quotation_id: { type: DataTypes.INTEGER },
    eventType: { type: DataTypes.STRING, allowNull: false },
    invoiceDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    eventDate: { type: DataTypes.DATE, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    services: { type: DataTypes.JSON, defaultValue: [] },
    subtotal: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discountType: { type: DataTypes.ENUM('fixed', 'percentage'), defaultValue: 'fixed' },
    taxPercentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    tax: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    grandTotal: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    paymentStatus: { type: DataTypes.ENUM('Paid', 'Partially Paid', 'Partial', 'Unpaid', 'Overdue', 'Draft', 'Sent'), defaultValue: 'Unpaid' },
    amountPaid: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    workflowStage: { type: DataTypes.STRING, defaultValue: 'Planning' },
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'UPI' },
    clientName: { type: DataTypes.STRING },
    bankDetails: { type: DataTypes.JSON },
    notes: { type: DataTypes.TEXT },
    thankYouMessage: { type: DataTypes.TEXT },
    _id: {
      type: DataTypes.VIRTUAL,
      get() { return this.id; }
    }
  }, { tableName: "invoices", timestamps: true });
  return Invoice;
};
