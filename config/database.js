import e from "express";
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const options = {};
    const connect = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`connected to mongo DB : ${connect.connection.host}`);
    console.log(`Base de donne : ${connect.connection.name}`);

    return connect;
  } catch (error) {
    console.error("Error de conection  :", error);
    console.error(error.message);
    process.exit(1);
  }
}

export async function closeDB() {
  try {
    await mongoose.connection.close();
    console.log("MongoDB fermée");
  } catch (error) {
    console.error("error lors de la fermeture de mongo DB; ", error);
  }
}

process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});
