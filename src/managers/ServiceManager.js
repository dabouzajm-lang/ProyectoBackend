import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesPath = path.join(
  __dirname,
  "../data/services.json"
);

class ServiceManager {
  constructor() {
    this.services = this.loadServices();
  }

  loadServices() {
    try {
      const data = fs.readFileSync(
        servicesPath,
        "utf-8"
      );

      return JSON.parse(data);
    } catch (error) {
      console.error(
        "Error al cargar los servicios:",
        error.message
      );

      return [];
    }
  }

  saveServices() {
    try {
      fs.writeFileSync(
        servicesPath,
        JSON.stringify(this.services, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error(
        "Error al guardar los servicios:",
        error.message
      );

      throw error;
    }
  }

  getServices(filters = {}) {
    this.services = this.loadServices();

    let services = [...this.services];

    if (filters.category) {
      services = services.filter(
        (service) =>
          service.category.toLowerCase() ===
          filters.category.toLowerCase()
      );
    }

    if (filters.available !== undefined) {
      const available =
        filters.available === true ||
        filters.available === "true";

      services = services.filter(
        (service) =>
          service.available === available
      );
    }

    return services;
  }

  getServiceById(id) {
    this.services = this.loadServices();

    const serviceId = Number(id);

    const service = this.services.find(
      (service) =>
        service.id === serviceId
    );

    if (!service) {
      return null;
    }

    return service;
  }

  addService(serviceData) {
    this.services = this.loadServices();

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

    if (
      typeof serviceData.name !== "string" ||
      typeof serviceData.description !== "string" ||
      typeof serviceData.category !== "string"
    ) {
      throw new Error(
        "name, description y category deben ser textos."
      );
    }

    if (
      typeof serviceData.duration !== "number" ||
      serviceData.duration <= 0
    ) {
      throw new Error(
        "duration debe ser un número mayor a 0."
      );
    }

    if (
      typeof serviceData.price !== "number" ||
      serviceData.price < 0
    ) {
      throw new Error(
        "price debe ser un número mayor o igual a 0."
      );
    }

    if (
      typeof serviceData.available !== "boolean"
    ) {
      throw new Error(
        "available debe ser true o false."
      );
    }

    const newId =
      this.services.length > 0
        ? Math.max(
            ...this.services.map(
              (service) => service.id
            )
          ) + 1
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

    this.saveServices();

    return newService;
  }

  updateService(id, updatedData) {
    this.services = this.loadServices();

    const serviceId = Number(id);

    const serviceIndex = this.services.findIndex(
      (service) =>
        service.id === serviceId
    );

    if (serviceIndex === -1) {
      return null;
    }

    const currentService =
      this.services[serviceIndex];

    const updatedService = {
      ...currentService,
      ...updatedData,
      id: currentService.id
    };

    this.services[serviceIndex] =
      updatedService;

    this.saveServices();

    return updatedService;
  }

  deleteService(id) {
    this.services = this.loadServices();

    const serviceId = Number(id);

    const serviceIndex = this.services.findIndex(
      (service) =>
        service.id === serviceId
    );

    if (serviceIndex === -1) {
      return null;
    }

    const [deletedService] =
      this.services.splice(serviceIndex, 1);

    this.saveServices();

    return deletedService;
  }
}

export default ServiceManager;