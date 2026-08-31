import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useRecurringTransactionsStore } from "~/stores/recurringTransactions";
import {
  RecurrenceFrequency,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
  type Transaction,
} from "~/constants/transactions";

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-1",
    name: "Aluguel",
    amount: 1500,
    type: TransactionType.EXPENSE,
    category: TransactionCategory.HOUSING,
    paymentMethod: TransactionPaymentMethod.BANK_TRANSFER,
    date: new Date(2026, 0, 1),
    userId: "user-1",
    createdAt: new Date(2026, 0, 1),
    updatedAt: new Date(2026, 0, 1),
    isRecurring: true,
    recurrenceFrequency: RecurrenceFrequency.MONTHLY,
    nextOccurrenceDate: new Date(2026, 1, 1),
    ...overrides,
  };
}

describe("useRecurringTransactionsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty list and not loading", () => {
    const store = useRecurringTransactionsStore();
    expect(store.recurringTransactions).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it("sets the loading flag", () => {
    const store = useRecurringTransactionsStore();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it("replaces the list with setRecurringTransactions", () => {
    const store = useRecurringTransactionsStore();
    const transactions = [buildTransaction(), buildTransaction({ id: "tx-2" })];
    store.setRecurringTransactions(transactions);
    expect(store.recurringTransactions).toEqual(transactions);
  });

  it("updates nextOccurrenceDate for an existing transaction", () => {
    const store = useRecurringTransactionsStore();
    store.setRecurringTransactions([buildTransaction({ id: "tx-1" })]);

    const newDate = new Date(2026, 2, 1);
    store.updateNextOccurrenceDate("tx-1", newDate);

    expect(store.recurringTransactions[0].nextOccurrenceDate).toEqual(newDate);
  });

  it("does nothing when updating a non-existent transaction id", () => {
    const store = useRecurringTransactionsStore();
    store.setRecurringTransactions([buildTransaction({ id: "tx-1" })]);

    store.updateNextOccurrenceDate("non-existent", new Date(2026, 2, 1));

    expect(store.recurringTransactions[0].nextOccurrenceDate).toEqual(
      new Date(2026, 1, 1)
    );
  });
});
