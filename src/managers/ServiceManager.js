import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesPath = path.join(__dirname, "../data/services.json");

class ServiceManager {
  constructor() {
    this.services = this.loadServices();
  }

  loadServices() {
    try {
      const data = fs.readFileSync(servicesPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar los servicios:", error.message);
      return [];
    }
  }

  getServices() {
    return this.services;
  }

  getServiceById(id) {
    const serviceId = Number(id);

    const service = this.services.find(
      (service) => service.id === serviceId
    );

    if (!service) {
      return null;
    }

    return service;
  }

  addService(serviceData) {
    const requiredFields = [
      "name",
      "description",
      "duration",
      "price",
      "category",
      "available"
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        serviceData[field] === undefined ||
        serviceData[field] === null ||
        serviceData[field] === ""
    );

    if (missingFields.length > 0) {
      throw new Error(
        `No se puede agregar el servicio. Faltan los siguientes campos: ${missingFields.join(
          ", "
        )}`
      );
    }

    const newId =
      this.services.length > 0
        ? Math.max(...this.services.map((service) => service.id)) + 1
        : 1;

    const newService = {
      id: newId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available
    };

    this.services.push(newService);

    return newService;
  }

  updateService(id, updatedData) {
    const serviceId = Number(id);

    const serviceIndex = this.services.findIndex(
      (service) => service.id === serviceId
    );

    if (serviceIndex === -1) {
      return null;
    }

    const currentService = this.services[serviceIndex];

    const updatedService = {
      ...currentService,
      ...updatedData,
      id: currentService.id
    };

    this.services[serviceIndex] = updatedService;

    return updatedService;
  }

  deleteService(id) {
    const serviceId = Number(id);

    const serviceIndex = this.services.findIndex(
      (service) => service.id === serviceId
    );

    if (serviceIndex === -1) {
      return null;
    }

    const [deletedService] = this.services.splice(serviceIndex, 1);

    return deletedService;
  }
}

export default ServiceManager;