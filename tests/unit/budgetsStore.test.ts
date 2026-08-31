import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useBudgetsStore } from "~/stores/budgets";
import { TransactionCategory } from "~/constants/transactions";

describe("useBudgetsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty budgets map", () => {
    const store = useBudgetsStore();
    expect(store.budgets).toEqual({});
  });

  it("returns undefined for a category with no budget set", () => {
    const store = useBudgetsStore();
    expect(store.getBudgetFor(TransactionCategory.FOOD)).toBeUndefined();
  });

  it("sets budgets from a list, keyed by category", () => {
    const store = useBudgetsStore();
    store.setBudgets([
      { category: TransactionCategory.FOOD, monthlyLimit: 500 },
      { category: TransactionCategory.HOUSING, monthlyLimit: 1500 },
    ]);

    expect(store.getBudgetFor(TransactionCategory.FOOD)).toBe(500);
    expect(store.getBudgetFor(TransactionCategory.HOUSING)).toBe(1500);
  });

  it("replaces existing budgets entirely when setBudgets is called again", () => {
    const store = useBudgetsStore();
    store.setBudgets([{ category: TransactionCategory.FOOD, monthlyLimit: 500 }]);
    store.setBudgets([{ category: TransactionCategory.HOUSING, monthlyLimit: 1000 }]);

    expect(store.getBudgetFor(TransactionCategory.FOOD)).toBeUndefined();
    expect(store.getBudgetFor(TransactionCategory.HOUSING)).toBe(1000);
  });

  it("sets a single budget without affecting others", () => {
    const store = useBudgetsStore();
    store.setBudget(TransactionCategory.FOOD, 300);
    store.setBudget(TransactionCategory.HEALTH, 200);

    expect(store.getBudgetFor(TransactionCategory.FOOD)).toBe(300);
    expect(store.getBudgetFor(TransactionCategory.HEALTH)).toBe(200);
  });

  it("overwrites a budget when set again for the same category", () => {
    const store = useBudgetsStore();
    store.setBudget(TransactionCategory.FOOD, 300);
    store.setBudget(TransactionCategory.FOOD, 450);

    expect(store.getBudgetFor(TransactionCategory.FOOD)).toBe(450);
  });

  it("removes a budget for a given category", () => {
    const store = useBudgetsStore();
    store.setBudget(TransactionCategory.FOOD, 300);
    store.removeBudget(TransactionCategory.FOOD);

    expect(store.getBudgetFor(TransactionCategory.FOOD)).toBeUndefined();
  });

  it("does nothing when removing a category that has no budget", () => {
    const store = useBudgetsStore();
    store.setBudget(TransactionCategory.FOOD, 300);
    store.removeBudget(TransactionCategory.HOUSING);

    expect(store.getBudgetFor(TransactionCategory.FOOD)).toBe(300);
    expect(Object.keys(store.budgets)).toHaveLength(1);
  });
});
