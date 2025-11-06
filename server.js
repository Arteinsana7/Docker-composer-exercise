const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectDB } = require("./config/database");
import { connectDB } from "./config/database";

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Item", itemSchema);

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

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

async function startServer() {
  try {
    await connectDB();
  } catch (err) {
    console.error("❌ Erreur lors de la connexion à la base de données:", err);
  }
}

app.listen(PORT, () => {
  const PORT = process.env.PORT || 5001;
});
console.log(`🚀 Serveur démarré sur le port ${PORT}`);
startServer();
