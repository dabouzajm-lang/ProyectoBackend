import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

export const createBooking = async (req, res) => {
  try {
    const newBooking =
      await bookingManager.createBooking(req.body);

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
      await bookingManager.getBookingById(bid);

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

    const booking =
      await bookingManager.getBookingById(bid);

    if (!booking) {
      return res.status(404).json({
        error: "Reserva no encontrada"
      });
    }

    const service =
      await serviceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        error: "Servicio no encontrado"
      });
    }

    const updatedBooking =
      await bookingManager.addServiceToBooking(
        bid,
        sid
      );

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({
      error: "Error al agregar el servicio a la reserva"
    });
  }
};