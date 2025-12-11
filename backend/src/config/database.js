import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    const options = {};
    const connect = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`✅ Connecté à MongoDB : ${connect.connection.host}`);
    console.log(`📦 Base de données : ${connect.connection.name}`);

    return connect;
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
    console.error(error.message);
    process.exit(1);
  }
}

export async function closeDB() {
  try {
    await mongoose.connection.close();
    console.log("🔒 MongoDB fermée");
  } catch (error) {
    console.error("❌ Erreur lors de la fermeture de MongoDB:", error);
  }
}

process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});
