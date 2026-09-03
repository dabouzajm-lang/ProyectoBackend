import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsPath = path.join(
  __dirname,
  "../data/bookings.json"
);

class BookingManager {
  constructor() {
    this.bookings = this.loadBookings();
  }

  loadBookings() {
    try {
      const data = fs.readFileSync(bookingsPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(
        "Error al cargar las reservas:",
        error.message
      );

      return [];
    }
  }

  saveBookings() {
    try {
      fs.writeFileSync(
        bookingsPath,
        JSON.stringify(this.bookings, null, 2),
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

  createBooking(bookingData) {
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
      this.bookings.length > 0
        ? Math.max(
            ...this.bookings.map(
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

    this.bookings.push(newBooking);

    this.saveBookings();

    return newBooking;
  }

  getBookingById(id) {
    const bookingId = Number(id);

    const booking = this.bookings.find(
      (booking) => booking.id === bookingId
    );

    if (!booking) {
      return null;
    }

    return booking;
  }

  addServiceToBooking(bookingId, serviceId) {
    const booking = this.getBookingById(bookingId);

    if (!booking) {
      return null;
    }

    const numericServiceId = Number(serviceId);

    const existingService = booking.services.find(
      (item) => item.service === numericServiceId
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({
        service: numericServiceId,
        quantity: 1
      });
    }

    this.saveBookings();

    return booking;
  }
}

export default BookingManager;