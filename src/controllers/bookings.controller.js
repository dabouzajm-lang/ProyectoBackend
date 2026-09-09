import BookingsService from "../services/bookings.service.js";

const bookingsService = new BookingsService();

export const createBooking = async (req, res) => {
  try {
    const newBooking =
      await bookingsService.createBooking(
        req.body
      );

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { bid } = req.params;

    const booking =
      await bookingsService.getBookingById(bid);

    if (!booking) {
      return res.status(404).json({
        error: "Reserva no encontrada"
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener la reserva"
    });
  }
};

export const addServiceToBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;

    const result =
      await bookingsService.addServiceToBooking(
        bid,
        sid
      );

    if (result?.error === "BOOKING_NOT_FOUND") {
      return res.status(404).json({
        error: "Reserva no encontrada"
      });
    }

    if (result?.error === "SERVICE_NOT_FOUND") {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Error al agregar el servicio a la reserva"
    });
  }
};