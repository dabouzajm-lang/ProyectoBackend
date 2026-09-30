import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();

// ruta absoluta de src/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());

// Archivos estáticos
app.use(
  express.static(path.join(__dirname, "public"))
);

// Configuración de Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

app.set(
  "views",
  path.join(__dirname, "views")
);

// Routers de la API REST
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

// Router de vistas
app.use("/views", viewsRouter);

export default app;