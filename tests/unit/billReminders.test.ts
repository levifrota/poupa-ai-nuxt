import { describe, it, expect } from "vitest";
import {
  DEFAULT_DUE_SOON_THRESHOLD_DAYS,
  getDaysUntilDue,
  isBillDueSoon,
  isBillOverdue,
} from "~/lib/billReminders";

describe("getDaysUntilDue", () => {
  it("returns 0 when the due date is today", () => {
    const reference = new Date(2026, 0, 10, 18, 30);
    const dueDate = new Date(2026, 0, 10, 8, 0);
    expect(getDaysUntilDue(dueDate, reference)).toBe(0);
  });

  it("returns a positive number of days for a future due date", () => {
    const reference = new Date(2026, 0, 10);
    const dueDate = new Date(2026, 0, 15);
    expect(getDaysUntilDue(dueDate, reference)).toBe(5);
  });

  it("returns a negative number of days for an overdue bill", () => {
    const reference = new Date(2026, 0, 10);
    const dueDate = new Date(2026, 0, 5);
    expect(getDaysUntilDue(dueDate, reference)).toBe(-5);
  });

  it("ignores the time of day, comparing only calendar dates", () => {
    const reference = new Date(2026, 0, 10, 23, 59);
    const dueDate = new Date(2026, 0, 11, 0, 1);
    expect(getDaysUntilDue(dueDate, reference)).toBe(1);
  });
});

describe("isBillOverdue", () => {
  it("returns true when the due date is in the past", () => {
    const reference = new Date(2026, 0, 10);
    expect(isBillOverdue(new Date(2026, 0, 9), reference)).toBe(true);
  });

  it("returns false when the due date is today", () => {
    const reference = new Date(2026, 0, 10);
    expect(isBillOverdue(new Date(2026, 0, 10), reference)).toBe(false);
  });

  it("returns false when the due date is in the future", () => {
    const reference = new Date(2026, 0, 10);
    expect(isBillOverdue(new Date(2026, 0, 11), reference)).toBe(false);
  });
});

describe("isBillDueSoon", () => {
  it("returns true when the bill is already overdue", () => {
    const reference = new Date(2026, 0, 10);
    expect(isBillDueSoon(new Date(2026, 0, 1), reference)).toBe(true);
  });

  it("returns true when the bill is due today", () => {
    const reference = new Date(2026, 0, 10);
    expect(isBillDueSoon(new Date(2026, 0, 10), reference)).toBe(true);
  });

  it(`returns true when the bill is due within ${DEFAULT_DUE_SOON_THRESHOLD_DAYS} days (default threshold)`, () => {
    const reference = new Date(2026, 0, 10);
    const dueDate = new Date(2026, 0, 10 + DEFAULT_DUE_SOON_THRESHOLD_DAYS);
    expect(isBillDueSoon(dueDate, reference)).toBe(true);
  });

  it("returns false when the bill is due after the default threshold", () => {
    const reference = new Date(2026, 0, 10);
    const dueDate = new Date(2026, 0, 10 + DEFAULT_DUE_SOON_THRESHOLD_DAYS + 1);
    expect(isBillDueSoon(dueDate, reference)).toBe(false);
  });

  it("respects a custom threshold", () => {
    const reference = new Date(2026, 0, 10);
    const dueDate = new Date(2026, 0, 20);
    expect(isBillDueSoon(dueDate, reference, 10)).toBe(true);
    expect(isBillDueSoon(dueDate, reference, 5)).toBe(false);
  });
});
