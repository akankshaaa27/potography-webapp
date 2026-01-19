
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './models/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Routes
import clientRoutes from './routes/clientRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import loveStoryRoutes from './routes/loveStoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import filmRoutes from './routes/filmRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import sliderRoutes from './routes/sliderRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import authRoutes from './routes/auth.js';

dotenv.config();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

console.log("⚡ Initializing Server with 50MB Body Limit...");

// Middleware - JSON & URL Encoding with high limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Uploads Directory Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS Setup
const rawOrigins = process.env.CORS_ORIGIN || '*';
const allowedOrigins = rawOrigins === '*' ? '*' : rawOrigins.split(',').map(o => o.trim());

console.log('🔗 Allowed CORS Origins:', allowedOrigins);

const corsOptions = {
  origin: allowedOrigins === '*' ? true : function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked CORS for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/love-stories', loveStoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/gallery", galleryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Photography API is running 🚀', status: 'active' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await db.connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📂 Serving uploads from: ${path.join(__dirname, 'uploads')}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error && (error.message || error));
    if (process.env.EXIT_ON_DB_FAIL === 'true') {
      process.exit(1);
    }
  }
};

startServer();
