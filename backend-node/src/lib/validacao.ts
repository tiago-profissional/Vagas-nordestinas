// Erro de validação: vira resposta 400 com a mensagem para o usuário.
export class ErroValidacao extends Error {}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function objetoOuVazio(valor: unknown, campo: string): Record<string, unknown> {
  if (valor === undefined) return {};
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    throw new ErroValidacao(`${campo} inválido.`);
  }
  return valor as Record<string, unknown>;
}

// undefined = mantém o valor atual; "" ou null = limpa o campo.
export function lerTexto(
  valor: unknown,
  atual: string | null,
  max: number,
  campo: string,
): string | null {
  if (valor === undefined) return atual;
  if (valor === null) return null;
  if (typeof valor !== "string") {
    throw new ErroValidacao(`${campo} inválido.`);
  }

  const texto = valor.trim();

  if (texto.length > max) {
    throw new ErroValidacao(`${campo} deve ter no máximo ${max} caracteres.`);
  }

  return texto === "" ? null : texto;
}

export function lerOpcao(
  valor: unknown,
  atual: string | null,
  permitidas: readonly string[],
  campo: string,
): string | null {
  const texto = lerTexto(valor, atual, 40, campo);

  if (texto !== null && !permitidas.includes(texto)) {
    throw new ErroValidacao(`${campo} inválido.`);
  }

  return texto;
}

export function lerBooleano(valor: unknown, atual: boolean, campo: string): boolean {
  if (valor === undefined) return atual;
  if (typeof valor !== "boolean") {
    throw new ErroValidacao(`${campo} inválido.`);
  }
  return valor;
}

export function normalizarEmail(valor: unknown): string {
  if (typeof valor !== "string") {
    throw new ErroValidacao("Informe um e-mail válido.");
  }

  const email = valor.trim().toLowerCase();

  if (email.length > 190 || !emailPattern.test(email)) {
    throw new ErroValidacao("Informe um e-mail válido.");
  }

  return email;
}