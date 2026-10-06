import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "El identificador debe ser un ObjectId válido"
  );

export const createBookingSchema = z
  .object({
    clientName: z
      .string()
      .trim()
      .min(1, "El nombre del cliente es obligatorio"),

    clientEmail: z
      .email("El email del cliente no es válido"),

    date: z
      .string()
      .trim()
      .min(1, "La fecha es obligatoria"),

    time: z
      .string()
      .trim()
      .min(1, "La hora es obligatoria"),

    status: z
      .enum([
        "pending",
        "confirmed",
        "cancelled"
      ])
      .optional(),

    services: z
      .array(
        z.object({
          service: objectIdSchema,
          quantity: z
            .number()
            .int()
            .positive(
              "La cantidad debe ser mayor a 0"
            )
        })
      )
      .optional()
  })
  .strict();

export const addServiceToBookingSchema = z.object({
  bid: objectIdSchema,
  sid: objectIdSchema
});