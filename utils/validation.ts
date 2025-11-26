export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Regex for alphanumeric validation with Spanish characters and basic punctuation
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,!?()-]+$/;

export function validateAlphanumeric(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: 'Este campo no puede estar vacío' };
  }

  if (!ALPHANUMERIC_REGEX.test(value)) {
    return {
      isValid: false,
      error: 'Solo se permiten caracteres alfanuméricos y signos de puntuación básicos',
    };
  }

  return { isValid: true };
}

export function validateTaskTitle(title: string): ValidationResult {
  const baseValidation = validateAlphanumeric(title);
  if (!baseValidation.isValid) {
    return baseValidation;
  }

  if (title.length < 3) {
    return { isValid: false, error: 'El título debe tener al menos 3 caracteres' };
  }

  if (title.length > 100) {
    return { isValid: false, error: 'El título no puede exceder los 100 caracteres' };
  }

  return { isValid: true };
}

export function validateTaskDescription(description: string): ValidationResult {
  if (!description || description.trim().length === 0) {
    return { isValid: true }; // Description is optional
  }

  const baseValidation = validateAlphanumeric(description);
  if (!baseValidation.isValid) {
    return baseValidation;
  }

  if (description.length > 500) {
    return { isValid: false, error: 'La descripción no puede exceder los 500 caracteres' };
  }

  return { isValid: true };
}
