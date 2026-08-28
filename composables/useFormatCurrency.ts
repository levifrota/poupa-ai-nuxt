import { useCurrencyStore } from "~/stores/currency";
import { CURRENCY_LOCALE } from "~/constants/currencies";

/**
 * Formata um valor em BRL (moeda base dos dados armazenados) convertendo-o
 * para a moeda selecionada pelo usuário nas configurações.
 */
export function useFormatCurrency() {
  const currencyStore = useCurrencyStore();

  function formatCurrency(valueInBRL: number): string {
    const converted = currencyStore.convert(valueInBRL);
    return new Intl.NumberFormat(CURRENCY_LOCALE[currencyStore.selectedCurrency], {
      style: "currency",
      currency: currencyStore.selectedCurrency,
    }).format(converted);
  }

  return { formatCurrency };
}
