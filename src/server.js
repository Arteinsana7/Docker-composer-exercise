import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { connectDB } from "./config/database.js";
import articleRoutes from "./routes/article.js";
import commentRoutes from "./routes/comment.js";
import authorisationRoutes from "./routes/authorisation.js";
import { errorHandler, notFound } from "./utils/middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

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

// routes api
app.use("/api/auth", authorisationRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

// error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  }
}
startServer();
