import { describe, it, expect } from "vitest";
import {
  BUDGET_WARNING_THRESHOLD_PERCENT,
  SAVINGS_GOAL_DEADLINE_WARNING_DAYS,
  getBudgetAlertLevel,
  isSavingsGoalNearingDeadline,
} from "~/lib/thresholdAlerts";

describe("getBudgetAlertLevel", () => {
  it("returns 'ok' when spending is well within the limit", () => {
    expect(getBudgetAlertLevel(100, 500)).toBe("ok");
  });

  it("returns 'ok' when there is no limit set (limit <= 0)", () => {
    expect(getBudgetAlertLevel(1000, 0)).toBe("ok");
  });

  it("returns 'warning' right at the warning threshold", () => {
    const spent = (BUDGET_WARNING_THRESHOLD_PERCENT / 100) * 500;
    expect(getBudgetAlertLevel(spent, 500)).toBe("warning");
  });

  it("returns 'warning' just below the limit", () => {
    expect(getBudgetAlertLevel(499, 500)).toBe("warning");
  });

  it("returns 'exceeded' when spending equals the limit", () => {
    expect(getBudgetAlertLevel(500, 500)).toBe("exceeded");
  });

  it("returns 'exceeded' when spending is above the limit", () => {
    expect(getBudgetAlertLevel(600, 500)).toBe("exceeded");
  });
});

describe("isSavingsGoalNearingDeadline", () => {
  it("returns false when the goal is already completed", () => {
    const reference = new Date(2026, 0, 10);
    const deadline = new Date(2026, 0, 12);
    expect(isSavingsGoalNearingDeadline(deadline, true, reference)).toBe(false);
  });

  it("returns true when the deadline is today and goal is not completed", () => {
    const reference = new Date(2026, 0, 10);
    const deadline = new Date(2026, 0, 10);
    expect(isSavingsGoalNearingDeadline(deadline, false, reference)).toBe(true);
  });

  it("returns true when the deadline is within the warning window", () => {
    const reference = new Date(2026, 0, 10);
    const deadline = new Date(2026, 0, 10 + SAVINGS_GOAL_DEADLINE_WARNING_DAYS);
    expect(isSavingsGoalNearingDeadline(deadline, false, reference)).toBe(true);
  });

  it("returns false when the deadline is beyond the warning window", () => {
    const reference = new Date(2026, 0, 10);
    const deadline = new Date(2026, 0, 10 + SAVINGS_GOAL_DEADLINE_WARNING_DAYS + 1);
    expect(isSavingsGoalNearingDeadline(deadline, false, reference)).toBe(false);
  });

  it("returns false when the deadline has already passed (handled as overdue elsewhere)", () => {
    const reference = new Date(2026, 0, 10);
    const deadline = new Date(2026, 0, 9);
    expect(isSavingsGoalNearingDeadline(deadline, false, reference)).toBe(false);
  });
});
