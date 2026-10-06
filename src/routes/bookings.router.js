import express from "express";

import {
  createBooking,
  getBookingById,
  addServiceToBooking
} from "../controllers/bookings.controller.js";

import {
  createBookingSchema,
  addServiceToBookingSchema
} from "../validators/booking.validator.js";

import {
  validate
} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
  "/",
  validate(createBookingSchema),
  createBooking
);

router.get("/:bid", getBookingById);

router.post(
  "/:bid/services/:sid",
  validate(
    addServiceToBookingSchema,
    "params"
  ),
  addServiceToBooking
);

export default router;