
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'photograper',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || '',
    {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
import userModel from './User.js';
import clientModel from './Client.js';
import serviceModel from './Service.js';
import contactModel from './Contact.js';
import enquiryModel from './Enquiry.js';
import filmModel from './Film.js';
import galleryModel from './Gallery.js';
import sliderModel from './Slider.js';
import testimonialModel from './Testimonial.js';
import loveStoryModel from './LoveStory.js';
import orderModel from './Order.js';
import quotationModel from './Quotation.js';
import invoiceModel from './Invoice.js';
import paymentModel from './Payment.js';

// Initialize Models
db.User = userModel(sequelize, Sequelize);
db.Client = clientModel(sequelize, Sequelize);
db.Service = serviceModel(sequelize, Sequelize);
db.Contact = contactModel(sequelize, Sequelize);
db.Enquiry = enquiryModel(sequelize, Sequelize);
db.Film = filmModel(sequelize, Sequelize);
db.Gallery = galleryModel(sequelize, Sequelize);
db.Slider = sliderModel(sequelize, Sequelize);
db.Testimonial = testimonialModel(sequelize, Sequelize);
db.LoveStory = loveStoryModel(sequelize, Sequelize);
db.Order = orderModel(sequelize, Sequelize);
db.Quotation = quotationModel(sequelize, Sequelize);
db.Invoice = invoiceModel(sequelize, Sequelize);
db.Payment = paymentModel(sequelize, Sequelize);

// Define Associations

// Order Associations
db.Order.belongsTo(db.User, { foreignKey: 'relatedUser_id', as: 'relatedUser' });
db.Order.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });

// Quotation Associations
db.Quotation.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
// Remove the circular association for now or define carefully
// db.Quotation.belongsTo(db.Invoice, { foreignKey: 'invoice_id', as: 'invoice' }); 

// Invoice Associations
db.Invoice.belongsTo(db.Client, { foreignKey: 'client_id', as: 'clientDetails' });
db.Invoice.belongsTo(db.Quotation, { foreignKey: 'quotation_id', as: 'quotation' });

// Payment Associations
db.Payment.belongsTo(db.Invoice, { foreignKey: 'invoice_id', as: 'invoice' });
db.Payment.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });

// Test Connection
db.connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connected successfully via Sequelize');

        // Sync models locally if needed (Use with caution in production)
        if (process.env.SYNC_DB === 'true') {
            console.log('🔄 Syncing Database Models...');
            await sequelize.sync({ alter: true });
            console.log('✅ Database Synced');
        }

    } catch (error) {
        console.error('❌ MySQL connection error:', error.message);
        // Do not throw in dev so that server can start even if DB is down (optional)
        // throw error; 
    }
};

export default db;
