import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { connectDB } from "./config/database.js";
import articleRoutes from "./routes/article.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/articles", articleRoutes);

const PORT = process.env.PORT || 5001;

// const itemSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   createdAt: { type: Date, default: Date.now },
// });

// const Item = mongoose.model("Item", itemSchema);

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

// app.get("/api/items", async (req, res) => {
//   try {
//     const items = await Item.find();
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/items", async (req, res) => {
//   try {
//     const item = new Item(req.body);
//     await item.save();
//     res.status(201).json(item);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

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
