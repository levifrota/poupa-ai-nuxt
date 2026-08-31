import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useBillsStore } from "~/stores/bills";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
  type Transaction,
} from "~/constants/transactions";

function buildBill(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-1",
    name: "Internet",
    amount: 120,
    type: TransactionType.EXPENSE,
    category: TransactionCategory.UTILITY,
    paymentMethod: TransactionPaymentMethod.BANK_SLIP,
    date: new Date(2026, 0, 1),
    userId: "user-1",
    createdAt: new Date(2026, 0, 1),
    updatedAt: new Date(2026, 0, 1),
    isBill: true,
    isPaid: false,
    dueDate: new Date(2026, 0, 15),
    ...overrides,
  };
}

describe("useBillsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty list and not loading", () => {
    const store = useBillsStore();
    expect(store.bills).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it("sets the loading flag", () => {
    const store = useBillsStore();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it("replaces the list with setBills", () => {
    const store = useBillsStore();
    const bills = [buildBill(), buildBill({ id: "tx-2" })];
    store.setBills(bills);
    expect(store.bills).toEqual(bills);
  });

  it("marks an existing bill as paid", () => {
    const store = useBillsStore();
    store.setBills([buildBill({ id: "tx-1" })]);
    store.markAsPaid("tx-1");
    expect(store.bills[0].isPaid).toBe(true);
  });

  it("does nothing when marking a non-existent bill as paid", () => {
    const store = useBillsStore();
    store.setBills([buildBill({ id: "tx-1" })]);
    store.markAsPaid("does-not-exist");
    expect(store.bills[0].isPaid).toBe(false);
  });
});
