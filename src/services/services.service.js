import ServicesRepository from "../repositories/services.repository.js";

const servicesRepository = new ServicesRepository();

class ServicesService {
  async getServices(filters = {}) {
    let services = await servicesRepository.getAll();

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

  async getServiceById(id) {
    return await servicesRepository.getById(id);
  }

  async createService(serviceData) {
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

    const newService = {
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available
    };

    return await servicesRepository.create(
      newService
    );
  }

  async updateService(id, updatedData) {
    return await servicesRepository.update(
      id,
      updatedData
    );
  }

  async deleteService(id) {
    return await servicesRepository.delete(id);
  }
}

export default ServicesService;