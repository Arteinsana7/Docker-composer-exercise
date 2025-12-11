import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet"; // adding helmet for security headers
import mongoSanitize from "express-mongo-sanitize"; // to prevent NoSQL injection
import rateLimit from "express-rate-limit"; // adding rate limiting to prevent brute-force attacks
import { connectDB } from "./config/database.js";
import articleRoutes from "./routes/article.js";
import commentRoutes from "./routes/comment.js";
import authorisationRoutes from "./routes/authorisation.js";
import { errorHandler, notFound } from "./utils/middlewares/errorHandler.js";

const app = express();

// === SECURITY MIDDLEWARES ===
app.use(helmet()); // SECURISE -- Security headers
app.use(mongoSanitize()); // PREVENT NO SQL INJECTION

//GLOBAL RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
  message: "Trop de requêtes depuis cette IP, réessayez dans 15 minutes",
});
app.use(limiter);

// RATE LIMITING FOR AUTH ROUTES MAX 5 ATTEMPTS
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: "Trop de tentatives de connexion, réessayez dans 15 minutes",
});

// === GERENAL MIDDLEWARES ===
app.use(cors());
app.use(express.json({ limit: "10kb" }));
// app.use(express.json());

// === TEST ROUTES ===
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
    status: "le serveur fonctionne parfaitement",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// === ROUTES API ===
app.use("/api/auth", authLimiter, authorisationRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

// === ERROR HANDLERS ===
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🔐 Environnement: ${process.env.NODE_ENV || "development"}`);
      console.log(`🛡️  Sécurité: helmet, rate-limit, mongo-sanitize activés`);
    });
  } catch (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  }
}
startServer();
