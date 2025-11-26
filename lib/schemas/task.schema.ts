import { z } from 'zod';

// Regex for alphanumeric validation with Spanish characters and basic punctuation
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,!?()-]+$/;

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'El título no puede estar vacío')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres')
    .regex(ALPHANUMERIC_REGEX, 'Solo se permiten caracteres alfanuméricos y puntuación básica'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder los 500 caracteres')
    .regex(ALPHANUMERIC_REGEX, 'Solo se permiten caracteres alfanuméricos y puntuación básica')
    .or(z.literal(''))
    .optional(),
  completed: z.boolean().default(false),
});

export const pinSchema = z
  .string()
  .length(6, 'El PIN debe tener exactamente 6 dígitos')
  .regex(/^\d{6}$/, 'El PIN solo puede contener números');

export type TaskInput = z.infer<typeof taskSchema>;
export type PinInput = z.infer<typeof pinSchema>;