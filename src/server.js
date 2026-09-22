import app from "./app.js";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(
      `Servidor ejecutándose en http://localhost:${config.port}`
    );
  });
};

startServer();