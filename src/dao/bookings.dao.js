import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsPath = path.join(
  __dirname,
  "../data/bookings.json"
);

class BookingsDAO {
  async readBookings() {
    try {
      const data = await readFile(
        bookingsPath,
        "utf-8"
      );

      return JSON.parse(data);
    } catch (error) {
      console.error(
        "Error al leer las reservas:",
        error.message
      );

      return [];
    }
  }

  async writeBookings(bookings) {
    await writeFile(
      bookingsPath,
      JSON.stringify(bookings, null, 2),
      "utf-8"
    );
  }

  async create(bookingData) {
    const bookings = await this.readBookings();

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
      ...bookingData
    };

    bookings.push(newBooking);

    await this.writeBookings(bookings);

    return newBooking;
  }

  async getById(id) {
    const bookings = await this.readBookings();
    const bookingId = Number(id);

    return (
      bookings.find(
        (booking) =>
          booking.id === bookingId
      ) || null
    );
  }

  async update(id, updatedData) {
    const bookings = await this.readBookings();
    const bookingId = Number(id);

    const bookingIndex = bookings.findIndex(
      (booking) =>
        booking.id === bookingId
    );

    if (bookingIndex === -1) {
      return null;
    }

    const currentBooking =
      bookings[bookingIndex];

    const updatedBooking = {
      ...currentBooking,
      ...updatedData,
      id: currentBooking.id
    };

    bookings[bookingIndex] =
      updatedBooking;

    await this.writeBookings(bookings);

    return updatedBooking;
  }
}

export default BookingsDAO;