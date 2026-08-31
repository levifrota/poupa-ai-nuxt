import { describe, it, expect } from "vitest";
import { CurrencyCode } from "~/constants/currencies";
import { parseExchangeRatesResponse } from "~/service/exchangeRateService";

describe("parseExchangeRatesResponse", () => {
  it("extracts supported currency rates from a valid response", () => {
    const result = parseExchangeRatesResponse({
      rates: { USD: 0.18, EUR: 0.17, GBP: 0.14, JPY: 27.5 },
    });
    expect(result).toEqual({
      BRL: 1,
      USD: 0.18,
      EUR: 0.17,
      GBP: 0.14,
    });
  });

  it("forces BRL to 1 even if present with a different value", () => {
    const result = parseExchangeRatesResponse({
      rates: { BRL: 5.5, USD: 0.18 },
    });
    expect(result?.[CurrencyCode.BRL]).toBe(1);
  });

  it("returns null when the rates field is missing", () => {
    expect(parseExchangeRatesResponse({ foo: "bar" })).toBeNull();
  });

  it("returns null when json is not an object", () => {
    expect(parseExchangeRatesResponse(null)).toBeNull();
    expect(parseExchangeRatesResponse("invalid")).toBeNull();
    expect(parseExchangeRatesResponse(42)).toBeNull();
  });

  it("returns null when no supported currencies are found in rates", () => {
    expect(parseExchangeRatesResponse({ rates: { JPY: 27.5, CNY: 1.3 } })).toBeNull();
  });
});
