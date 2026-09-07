import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsPath = path.join(
  __dirname,
  "../data/bookings.json"
);

class BookingManager {
  async loadBookings() {
    try {
      const data = await readFile(
        bookingsPath,
        "utf-8"
      );

      return JSON.parse(data);
    } catch (error) {
      console.error(
        "Error al cargar las reservas:",
        error.message
      );

      return [];
    }
  }

  async saveBookings(bookings) {
    try {
      await writeFile(
        bookingsPath,
        JSON.stringify(bookings, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error(
        "Error al guardar las reservas:",
        error.message
      );

      throw error;
    }
  }

  async createBooking(bookingData) {
    const bookings = await this.loadBookings();

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

    const newId =
      bookings.length > 0
        ? Math.max(
            ...bookings.map(
              (booking) => booking.id
            )
          ) + 1
        : 1;

    const newBooking = {
      id: newId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services: Array.isArray(bookingData.services)
        ? bookingData.services
        : []
    };

    bookings.push(newBooking);

    await this.saveBookings(bookings);

    return newBooking;
  }

  async getBookingById(id) {
    const bookings = await this.loadBookings();

    const bookingId = Number(id);

    const booking = bookings.find(
      (booking) =>
        booking.id === bookingId
    );

    if (!booking) {
      return null;
    }

    return booking;
  }

  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this.loadBookings();

    const numericBookingId = Number(bookingId);
    const numericServiceId = Number(serviceId);

    const booking = bookings.find(
      (booking) =>
        booking.id === numericBookingId
    );

    if (!booking) {
      return null;
    }

    const existingService = booking.services.find(
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

    await this.saveBookings(bookings);

    return booking;
  }
}

export default BookingManager;