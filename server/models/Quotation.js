
export default (sequelize, DataTypes) => {
  const Quotation = sequelize.define("Quotation", {
    quotationNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    client_id: { type: DataTypes.INTEGER },
    eventType: { type: DataTypes.ENUM('Wedding', 'Pre-wedding', 'Other'), allowNull: false },
    quotationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    eventDate: { type: DataTypes.DATE, allowNull: false },
    validityDate: { type: DataTypes.DATE, allowNull: false },
    services: { type: DataTypes.JSON },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discountType: { type: DataTypes.ENUM('fixed', 'percentage'), defaultValue: 'fixed' },
    taxPercentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    tax: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    grandTotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paymentTerms: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
    thankYouMessage: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired', 'Negotiation'), defaultValue: 'Draft' },
    clientName: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    retainerAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    stage: { type: DataTypes.STRING, defaultValue: 'Concept' },
    deliverables: { type: DataTypes.JSON },
    moodboard: { type: DataTypes.STRING },
    channel: { type: DataTypes.ENUM('Email', 'WhatsApp', 'Call', 'Other'), defaultValue: 'Email' },
    followUpDate: { type: DataTypes.DATE },
    convertedToInvoice: { type: DataTypes.BOOLEAN, defaultValue: false },
    invoice_id: { type: DataTypes.INTEGER },
    _id: {
      type: DataTypes.VIRTUAL,
      get() { return this.id; }
    }
  }, { tableName: "quotations", timestamps: true });
  return Quotation;
};
