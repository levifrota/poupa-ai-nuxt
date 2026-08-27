import { describe, it, expect } from "vitest";
import { calculateYearlySavingsPercent } from "~/lib/subscription";

describe("calculateYearlySavingsPercent", () => {
  it("returns 0 for a free plan (priceMonthly is 0)", () => {
    expect(calculateYearlySavingsPercent(0, 0)).toBe(0);
  });

  it("calculates the rounded percentage saved with yearly billing", () => {
    // 19.9 * 12 = 238.8, yearly 199.9 -> savings ~16%
    expect(calculateYearlySavingsPercent(19.9, 199.9)).toBe(16);
  });

  it("returns 0 when the yearly price is not actually cheaper", () => {
    expect(calculateYearlySavingsPercent(10, 130)).toBe(0);
  });

  it("returns 0 when the yearly price equals the monthly equivalent", () => {
    expect(calculateYearlySavingsPercent(10, 120)).toBe(0);
  });
});
