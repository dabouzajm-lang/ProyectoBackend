import ServicesRepository from "../repositories/services.repository.js";

const servicesRepository = new ServicesRepository();

class ServicesService {
  async getServices(query = {}) {
    const {
      category,
      available,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "asc"
    } = query;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    // Validación de página
    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1
    ) {
      throw new Error(
        "La página debe ser un número entero mayor a 0"
      );
    }

    // Validación de límite
    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1
    ) {
      throw new Error(
        "El límite debe ser un número entero mayor a 0"
      );
    }

    // Campos permitidos para ordenamiento
    const allowedSortFields = [
      "name",
      "duration",
      "price",
      "category",
      "available",
      "createdAt"
    ];

    if (!allowedSortFields.includes(sortBy)) {
      throw new Error(
        "Campo de ordenamiento no válido"
      );
    }

    // Orden permitido
    if (!["asc", "desc"].includes(order)) {
      throw new Error(
        "El orden debe ser asc o desc"
      );
    }

    // Construcción de filtros para MongoDB
    const filter = {};

    if (category) {
      filter.category = {
        $regex: category,
        $options: "i"
      };
    }

    if (available !== undefined) {
      if (
        available !== "true" &&
        available !== "false" &&
        available !== true &&
        available !== false
      ) {
        throw new Error(
          "available debe ser true o false"
        );
      }

      filter.available =
        available === true ||
        available === "true";
    }

    // Consulta paginada mediante Repository
    const { services, total } =
      await servicesRepository.getPaginated(
        filter,
        {
          page: parsedPage,
          limit: parsedLimit,
          sortBy,
          order
        }
      );

    const totalPages =
      Math.ceil(total / parsedLimit);

    // Respuesta con servicios y metadatos
    return {
      services,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
        hasPrevPage: parsedPage > 1,
        hasNextPage:
          parsedPage < totalPages
      }
    };
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