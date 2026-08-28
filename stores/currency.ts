import { defineStore } from "pinia";
import { ref } from "vue";
import { CurrencyCode } from "~/constants/currencies";
import { FALLBACK_EXCHANGE_RATES, fetchExchangeRates } from "~/service/exchangeRateService";

const STORAGE_KEY = "poupa-ai:selected-currency";

function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return CurrencyCode.BRL;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && Object.values(CurrencyCode).includes(stored as CurrencyCode)) {
    return stored as CurrencyCode;
  }
  return CurrencyCode.BRL;
}

export const useCurrencyStore = defineStore("currency", () => {
  const selectedCurrency = ref<CurrencyCode>(getStoredCurrency());
  const rates = ref<Record<CurrencyCode, number>>({ ...FALLBACK_EXCHANGE_RATES });
  const isLoadingRates = ref(false);

  function setCurrency(currency: CurrencyCode) {
    selectedCurrency.value = currency;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, currency);
    }
  }

  function setRates(newRates: Record<CurrencyCode, number>) {
    rates.value = newRates;
  }

  function setLoadingRates(value: boolean) {
    isLoadingRates.value = value;
  }

  function convert(amountInBRL: number): number {
    const rate = rates.value[selectedCurrency.value] ?? 1;
    return amountInBRL * rate;
  }

  async function loadRates() {
    setLoadingRates(true);
    try {
      const fetchedRates = await fetchExchangeRates();
      setRates(fetchedRates);
    } finally {
      setLoadingRates(false);
    }
  }

  return {
    selectedCurrency,
    rates,
    isLoadingRates,
    setCurrency,
    setRates,
    setLoadingRates,
    convert,
    loadRates,
  };
});
