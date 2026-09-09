import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesRepository from "../repositories/services.repository.js";

const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

class BookingsService {
  async createBooking(bookingData) {
    const requiredFields = [
      "clientName",
      "clientEmail",
      "date",
      "time",
      "status"
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        bookingData[field] === undefined ||
        bookingData[field] === null ||
        bookingData[field] === ""
    );

    if (missingFields.length > 0) {
      throw new Error(
        `No se puede crear la reserva. Faltan los siguientes campos: ${missingFields.join(
          ", "
        )}`
      );
    }

    const newBooking = {
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services: Array.isArray(bookingData.services)
        ? bookingData.services
        : []
    };

    return await bookingsRepository.create(
      newBooking
    );
  }

  async getBookingById(id) {
    return await bookingsRepository.getById(id);
  }

  async addServiceToBooking(bookingId, serviceId) {
    const booking =
      await bookingsRepository.getById(
        bookingId
      );

    if (!booking) {
      return {
        error: "BOOKING_NOT_FOUND"
      };
    }

    const service =
      await servicesRepository.getById(
        serviceId
      );

    if (!service) {
      return {
        error: "SERVICE_NOT_FOUND"
      };
    }

    const numericServiceId =
      Number(serviceId);

    const existingService =
      booking.services.find(
        (item) =>
          item.service === numericServiceId
      );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({
        service: numericServiceId,
        quantity: 1
      });
    }

    const updatedBooking =
      await bookingsRepository.update(
        bookingId,
        {
          services: booking.services
        }
      );

    return updatedBooking;
  }
}

export default BookingsService;