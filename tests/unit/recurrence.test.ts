import { describe, it, expect } from "vitest";
import { RecurrenceFrequency } from "~/constants/transactions";
import { calculateNextOccurrenceDate, isOccurrenceDue } from "~/lib/recurrence";

describe("calculateNextOccurrenceDate", () => {
  it("adds 7 days for WEEKLY frequency", () => {
    const result = calculateNextOccurrenceDate(
      new Date(2026, 0, 1),
      RecurrenceFrequency.WEEKLY
    );
    expect(result).toEqual(new Date(2026, 0, 8));
  });

  it("adds 1 month for MONTHLY frequency", () => {
    const result = calculateNextOccurrenceDate(
      new Date(2026, 0, 15),
      RecurrenceFrequency.MONTHLY
    );
    expect(result).toEqual(new Date(2026, 1, 15));
  });

  it("adds 1 year for YEARLY frequency", () => {
    const result = calculateNextOccurrenceDate(
      new Date(2026, 0, 1),
      RecurrenceFrequency.YEARLY
    );
    expect(result).toEqual(new Date(2027, 0, 1));
  });

  it("rolls over to the next month/year correctly", () => {
    const result = calculateNextOccurrenceDate(
      new Date(2026, 11, 20),
      RecurrenceFrequency.MONTHLY
    );
    expect(result).toEqual(new Date(2027, 0, 20));
  });

  it("does not mutate the original date", () => {
    const original = new Date(2026, 0, 1);
    calculateNextOccurrenceDate(original, RecurrenceFrequency.MONTHLY);
    expect(original).toEqual(new Date(2026, 0, 1));
  });
});

describe("isOccurrenceDue", () => {
  it("returns true when the occurrence date is in the past", () => {
    const past = new Date(2020, 0, 1);
    expect(isOccurrenceDue(past)).toBe(true);
  });

  it("returns true when the occurrence date equals the reference date", () => {
    const reference = new Date(2026, 0, 1, 12, 0, 0);
    expect(isOccurrenceDue(new Date(reference), reference)).toBe(true);
  });

  it("returns false when the occurrence date is in the future", () => {
    const future = new Date(2999, 0, 1);
    expect(isOccurrenceDue(future)).toBe(false);
  });

  it("compares against a custom reference date when provided", () => {
    const occurrence = new Date(2026, 5, 15);
    const reference = new Date(2026, 5, 10);
    expect(isOccurrenceDue(occurrence, reference)).toBe(false);
    expect(isOccurrenceDue(occurrence, new Date(2026, 5, 20))).toBe(true);
  });
});
