import mongoose from "mongoose";
import BookingModel from "../models/booking.model.js";

class BookingsDAO {
  async create(bookingData) {
    return await BookingModel.create(bookingData);
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await BookingModel.findById(id);
  }

  async update(id, updatedData) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await BookingModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );
  }
}

export default BookingsDAO;