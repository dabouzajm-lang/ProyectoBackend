import mongoose from "mongoose";
import { config } from "./env.config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    console.log(
      "Conexión a MongoDB establecida correctamente."
    );
  } catch (error) {
    console.error(
      "Error al conectar con MongoDB:",
      error.message
    );

    process.exit(1);
  }
};