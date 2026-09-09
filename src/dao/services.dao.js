import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesPath = path.join(
  __dirname,
  "../data/services.json"
);

class ServicesDAO {
  async readServices() {
    try {
      const data = await readFile(
        servicesPath,
        "utf-8"
      );

      return JSON.parse(data);
    } catch (error) {
      console.error(
        "Error al leer los servicios:",
        error.message
      );

      return [];
    }
  }

  async writeServices(services) {
    await writeFile(
      servicesPath,
      JSON.stringify(services, null, 2),
      "utf-8"
    );
  }

  async getAll() {
    return await this.readServices();
  }

  async getById(id) {
    const services = await this.readServices();
    const serviceId = Number(id);

    return (
      services.find(
        (service) =>
          service.id === serviceId
      ) || null
    );
  }

  async create(serviceData) {
    const services = await this.readServices();

    const newId =
      services.length > 0
        ? Math.max(
            ...services.map(
              (service) => service.id
            )
          ) + 1
        : 1;

    const newService = {
      id: newId,
      ...serviceData
    };

    services.push(newService);

    await this.writeServices(services);

    return newService;
  }

  async update(id, updatedData) {
    const services = await this.readServices();
    const serviceId = Number(id);

    const serviceIndex = services.findIndex(
      (service) =>
        service.id === serviceId
    );

    if (serviceIndex === -1) {
      return null;
    }

    const currentService =
      services[serviceIndex];

    const updatedService = {
      ...currentService,
      ...updatedData,
      id: currentService.id
    };

    services[serviceIndex] =
      updatedService;

    await this.writeServices(services);

    return updatedService;
  }

  async delete(id) {
    const services = await this.readServices();
    const serviceId = Number(id);

    const serviceIndex = services.findIndex(
      (service) =>
        service.id === serviceId
    );

    if (serviceIndex === -1) {
      return null;
    }

    const [deletedService] =
      services.splice(serviceIndex, 1);

    await this.writeServices(services);

    return deletedService;
  }
}

export default ServicesDAO;