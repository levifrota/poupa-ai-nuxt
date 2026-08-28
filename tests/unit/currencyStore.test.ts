import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCurrencyStore } from "~/stores/currency";
import { CurrencyCode } from "~/constants/currencies";

describe("useCurrencyStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    window.localStorage.clear();
  });

  it("defaults to BRL", () => {
    const store = useCurrencyStore();
    expect(store.selectedCurrency).toBe(CurrencyCode.BRL);
  });

  it("defaults rates to the fallback rates", () => {
    const store = useCurrencyStore();
    expect(store.rates[CurrencyCode.BRL]).toBe(1);
    expect(store.rates[CurrencyCode.USD]).toBeGreaterThan(0);
  });

  it("changes the selected currency via setCurrency", () => {
    const store = useCurrencyStore();
    store.setCurrency(CurrencyCode.USD);
    expect(store.selectedCurrency).toBe(CurrencyCode.USD);
  });

  it("converts an amount using the current rate", () => {
    const store = useCurrencyStore();
    store.setRates({
      [CurrencyCode.BRL]: 1,
      [CurrencyCode.USD]: 0.2,
      [CurrencyCode.EUR]: 0.17,
      [CurrencyCode.GBP]: 0.14,
    });
    store.setCurrency(CurrencyCode.USD);
    expect(store.convert(100)).toBeCloseTo(20);
  });

  it("converts using a rate of 1 when currency is BRL", () => {
    const store = useCurrencyStore();
    expect(store.convert(50)).toBe(50);
  });

  it("updates isLoadingRates via setLoadingRates", () => {
    const store = useCurrencyStore();
    expect(store.isLoadingRates).toBe(false);
    store.setLoadingRates(true);
    expect(store.isLoadingRates).toBe(true);
  });
});
