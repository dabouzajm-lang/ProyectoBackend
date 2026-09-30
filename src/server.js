import { createServer } from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";

// Crear servidor HTTP a partir de Express
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer);

// Compartir la instancia con los controllers
app.set("io", io);

// Registrar conexiones de navegadores
io.on("connection", (socket) => {
  console.log(
    `Cliente conectado: ${socket.id}`
  );

  socket.on("disconnect", () => {
    console.log(
      `Cliente desconectado: ${socket.id}`
    );
  });
});

const startServer = async () => {
  await connectDB();

  httpServer.listen(config.port, () => {
    console.log(
      `Servidor ejecutándose en http://localhost:${config.port}`
    );
  });
};

startServer();