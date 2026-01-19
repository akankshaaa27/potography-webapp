
import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./models/index.js";
import { handleDemo } from "./routes/demo.js";
import clientRoutes from "./routes/clientRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import authRoutes from "./routes/auth.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import filmRoutes from "./routes/filmRoutes.js";
import loveStoryRoutes from "./routes/loveStoryRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://localhost:8080",
  "https://potography-webapp.vercel.app",
  "https://potography-webapp-website.vercel.app",
];

const buildAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ALLOWLIST || process.env.CORS_ORIGIN || "";
  const parsed = envOrigins
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return Array.from(new Set([...defaultAllowedOrigins, ...parsed]));
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    console.warn(`⚠️  Blocked CORS origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

let dbConnectionPromise;
const ensureDbConnection = () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = db.connectDB().catch((error) => {
      console.error("❌ MySQL connection failed", error);
      dbConnectionPromise = undefined;
      throw error;
    });
  }
  return dbConnectionPromise;
};

export function createServer(config = {}) {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  ensureDbConnection();

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/db-status", async (_req, res) => {
    try {
      await db.sequelize.authenticate();
      res.json({ state: 1, status: "connected" });
    } catch (e) {
      res.json({ state: 0, status: "disconnected" });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      allowedOrigins,
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/clients", clientRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/quotations", quotationRoutes);
  app.use("/api/invoices", invoiceRoutes);
  app.use("/api/slider", sliderRoutes);
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/films", filmRoutes);
  app.use("/api/love-stories", loveStoryRoutes);
  app.use("/api/enquiries", enquiryRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/testimonials", testimonialRoutes);
  console.log("✅ Contact, Dashboard & Testimonial routes registered");

  if (!config.middlewareMode) {
    app.get("/", (req, res) => {
      res.json({ message: "Photography API is running 🚀", status: "active" });
    });
  }

  if (!config.middlewareMode) {
    app.use(notFoundHandler);
  }

  app.use(errorHandler);

  return app;
}
