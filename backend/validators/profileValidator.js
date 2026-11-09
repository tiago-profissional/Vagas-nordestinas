/**
 * Validador para dados de perfil de usuário
 */

export const ALLOWED_WORK_MODELS = ['Remoto', 'Híbrido', 'Presencial'];
export const ALLOWED_CONTRACT_TYPES = ['CLT', 'PJ', 'CLT ou PJ'];
export const ALLOWED_AVAILABILITY = ['Imediata', '15 dias', '30 dias', 'A combinar'];

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validateProfileInput(data) {
  const errors = {};

  // Validar Email
  if (data.email !== undefined && data.email !== null) {
    const emailStr = String(data.email).trim();
    if (!emailStr || !validateEmail(emailStr)) {
      errors.email = 'E-mail em formato inválido.';
    }
  }

  // Validar Data de Nascimento
  if (data.birth_date) {
    const dateStr = String(data.birth_date).trim();
    // Suporta YYYY-MM-DD ou DD/MM/YYYY
    const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
    const brPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!isoPattern.test(dateStr) && !brPattern.test(dateStr)) {
      errors.birth_date = 'Data de nascimento deve estar no formato YYYY-MM-DD ou DD/MM/YYYY.';
    }
  }

  // Validar Modelo de Trabalho
  if (data.work_model) {
    if (!ALLOWED_WORK_MODELS.includes(data.work_model)) {
      errors.work_model = `Modelo de trabalho inválido. Opções aceitas: ${ALLOWED_WORK_MODELS.join(', ')}.`;
    }
  }

  // Validar Tipo de Contratação
  if (data.contract_type) {
    if (!ALLOWED_CONTRACT_TYPES.includes(data.contract_type)) {
      errors.contract_type = `Tipo de contratação inválido. Opções aceitas: ${ALLOWED_CONTRACT_TYPES.join(', ')}.`;
    }
  }

  // Validar Disponibilidade
  if (data.availability) {
    if (!ALLOWED_AVAILABILITY.includes(data.availability)) {
      errors.availability = `Disponibilidade inválida. Opções aceitas: ${ALLOWED_AVAILABILITY.join(', ')}.`;
    }
  }

  // Validar Habilidades
  if (data.skills !== undefined && data.skills !== null) {
    if (!Array.isArray(data.skills)) {
      errors.skills = 'Habilidades deve ser um array de strings.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

