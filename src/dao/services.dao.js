import mongoose from "mongoose";
import ServiceModel from "../models/service.model.js";

class ServicesDAO {
  async getAll() {
    return await ServiceModel.find();
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await ServiceModel.findById(id);
  }

  async create(serviceData) {
    return await ServiceModel.create(serviceData);
  }

  async update(id, updatedData) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await ServiceModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );
  }

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await ServiceModel.findByIdAndDelete(id);
  }
}

export default ServicesDAO;