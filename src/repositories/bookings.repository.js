import BookingsDAO from "../dao/bookings.dao.js";

const bookingsDAO = new BookingsDAO();

class BookingsRepository {
  async create(bookingData) {
    return await bookingsDAO.create(
      bookingData
    );
  }

  async getById(id) {
    return await bookingsDAO.getById(id);
  }

  async update(id, updatedData) {
    return await bookingsDAO.update(
      id,
      updatedData
    );
  }
}

export default BookingsRepository;