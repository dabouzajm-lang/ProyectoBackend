import ServicesDAO from "../dao/services.dao.js";

const servicesDAO = new ServicesDAO();

class ServicesRepository {
  async getAll() {
    return await servicesDAO.getAll();
  }

  async getById(id) {
    return await servicesDAO.getById(id);
  }

  async create(serviceData) {
    return await servicesDAO.create(serviceData);
  }

  async update(id, updatedData) {
    return await servicesDAO.update(
      id,
      updatedData
    );
  }

  async delete(id) {
    return await servicesDAO.delete(id);
  }
}

export default ServicesRepository;