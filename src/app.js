import { config } from "./config/env.config.js";
import ServiceManager from "./managers/ServiceManager.js";

const serviceManager = new ServiceManager();

console.log("=================================");
console.log("Service Manager");
console.log("=================================");

console.log("Entorno:", config.nodeEnv);
console.log("Puerto:", config.port);

console.log("\n--- Todos los servicios ---");
console.log(serviceManager.getServices());

console.log("\n--- Buscar servicio por ID ---");
console.log(serviceManager.getServiceById(1));

console.log("\n--- Agregar servicio ---");

try {
  const newService = serviceManager.addService({
    name: "Evaluación deportiva",
    description: "Evaluación física inicial.",
    duration: 45,
    price: 10000,
    category: "Evaluación",
    available: true
  });

  console.log(newService);
} catch (error) {
  console.error(error.message);
}

console.log("\n--- Actualizar servicio ---");

const updatedService = serviceManager.updateService(1, {
  price: 17000,
  available: false
});

console.log(updatedService);

console.log("\n--- Eliminar servicio ---");

const deletedService = serviceManager.deleteService(3);

console.log(deletedService);

console.log("\n--- Servicios finales ---");
console.log(serviceManager.getServices());