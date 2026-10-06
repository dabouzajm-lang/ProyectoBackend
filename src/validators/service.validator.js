import { z } from "zod";

const serviceFields = {
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria"),

  duration: z
    .number({
      error: "La duración debe ser un número"
    })
    .int("La duración debe ser un número entero")
    .positive("La duración debe ser mayor a 0"),

  price: z
    .number({
      error: "El precio debe ser un número"
    })
    .min(0, "El precio no puede ser negativo"),

  category: z
    .string()
    .trim()
    .min(1, "La categoría es obligatoria"),

  available: z.boolean({
    error: "La disponibilidad debe ser true o false"
  })
};

export const createServiceSchema = z
  .object(serviceFields)
  .strict();

export const updateServiceSchema = z
  .object({
    name: serviceFields.name.optional(),
    description: serviceFields.description.optional(),
    duration: serviceFields.duration.optional(),
    price: serviceFields.price.optional(),
    category: serviceFields.category.optional(),
    available: serviceFields.available.optional()
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        "Debe enviar al menos un campo para actualizar"
    }
  );