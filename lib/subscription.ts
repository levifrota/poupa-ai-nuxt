/**
 * Calcula a porcentagem de economia ao optar pela cobrança anual em vez de
 * pagar o valor mensal 12 vezes. Retorna 0 quando o plano é gratuito
 * (priceMonthly === 0) ou quando não há economia.
 */
export function calculateYearlySavingsPercent(
  priceMonthly: number,
  priceYearly: number
): number {
  const yearlyEquivalentOfMonthly = priceMonthly * 12;

  if (yearlyEquivalentOfMonthly <= 0) {
    return 0;
  }

  const savings = yearlyEquivalentOfMonthly - priceYearly;

  if (savings <= 0) {
    return 0;
  }

  return Math.round((savings / yearlyEquivalentOfMonthly) * 100);
}
