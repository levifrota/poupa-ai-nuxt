import { CurrencyCode } from "~/constants/currencies";

// Taxas de câmbio aproximadas em relação ao Real (BRL), usadas apenas como
// fallback caso a API de câmbio esteja indisponível. Não refletem cotações
// em tempo real.
export const FALLBACK_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  [CurrencyCode.BRL]: 1,
  [CurrencyCode.USD]: 0.18,
  [CurrencyCode.EUR]: 0.17,
  [CurrencyCode.GBP]: 0.14,
};

/**
 * Valida e extrai as taxas de câmbio suportadas a partir da resposta da API
 * (formato `{ rates: Record<string, number> }`). Retorna `null` se o
 * formato for inválido ou nenhuma moeda suportada for encontrada.
 */
export function parseExchangeRatesResponse(
  json: unknown
): Partial<Record<CurrencyCode, number>> | null {
  if (typeof json !== "object" || json === null || !("rates" in json)) {
    return null;
  }

  const rates = (json as { rates: unknown }).rates;
  if (typeof rates !== "object" || rates === null) {
    return null;
  }

  const result: Partial<Record<CurrencyCode, number>> = {};
  for (const code of Object.values(CurrencyCode)) {
    const value = (rates as Record<string, unknown>)[code];
    if (typeof value === "number" && Number.isFinite(value)) {
      result[code] = value;
    }
  }

  if (Object.keys(result).length === 0) {
    return null;
  }

  result[CurrencyCode.BRL] = 1;
  return result;
}

/**
 * Busca as taxas de câmbio atuais a partir de uma API pública e gratuita
 * (base BRL). Em caso de qualquer falha (rede, resposta inválida, etc.),
 * retorna as taxas de fallback estáticas.
 */
export async function fetchExchangeRates(): Promise<Record<CurrencyCode, number>> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/BRL");
    if (!response.ok) {
      throw new Error(`Resposta inválida da API de câmbio: ${response.status}`);
    }
    const json = await response.json();
    const parsed = parseExchangeRatesResponse(json);
    if (!parsed) {
      throw new Error("Formato de resposta da API de câmbio inválido");
    }
    return { ...FALLBACK_EXCHANGE_RATES, ...parsed };
  } catch (error) {
    console.error("Erro ao buscar taxas de câmbio, usando valores de fallback:", error);
    return FALLBACK_EXCHANGE_RATES;
  }
}
