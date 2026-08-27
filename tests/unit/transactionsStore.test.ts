import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useTransactionsStore } from "~/stores/transactions";
import { TransactionType, TransactionCategory, TransactionPaymentMethod } from "~/constants/transactions";

function buildTransaction(overrides: Partial<Parameters<ReturnType<typeof useTransactionsStore>["addTransaction"]>[0]> = {}) {
  return {
    name: "Transação",
    amount: 100,
    type: TransactionType.EXPENSE,
    category: TransactionCategory.FOOD,
    paymentMethod: TransactionPaymentMethod.CASH,
    date: new Date(2026, 0, 1),
    ...overrides,
  };
}

describe("useTransactionsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty state", () => {
    const store = useTransactionsStore();
    expect(store.transactions).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.balance).toBe(0);
  });

  it("sets loading and error state", () => {
    const store = useTransactionsStore();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);

    store.setError("Erro ao buscar transações");
    expect(store.error).toBe("Erro ao buscar transações");

    store.setError(null);
    expect(store.error).toBeNull();
  });

  it("replaces transactions with setTransactions", () => {
    const store = useTransactionsStore();
    const transactions = [
      {
        id: "1",
        name: "Salário",
        amount: 1000,
        type: TransactionType.DEPOSIT,
        category: TransactionCategory.SALARY,
        paymentMethod: TransactionPaymentMethod.BANK_TRANSFER,
        date: new Date(),
        userId: "u1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    store.setTransactions(transactions);
    expect(store.transactions).toEqual(transactions);
  });

  it("computes deposits, expenses and investments totals", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction({ type: TransactionType.DEPOSIT, amount: 500 }));
    store.addTransaction(buildTransaction({ type: TransactionType.EXPENSE, amount: 100 }));
    store.addTransaction(buildTransaction({ type: TransactionType.INVESTMENT, amount: 200 }));

    expect(store.depositsTotal).toBe(500);
    expect(store.expensesTotal).toBe(100);
    expect(store.investmentsTotal).toBe(200);
  });

  it("computes balance as deposits minus expenses minus investments", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction({ type: TransactionType.DEPOSIT, amount: 1000 }));
    store.addTransaction(buildTransaction({ type: TransactionType.EXPENSE, amount: 300 }));
    store.addTransaction(buildTransaction({ type: TransactionType.INVESTMENT, amount: 200 }));

    expect(store.balance).toBe(500);
  });

  it("returns zero balance when there are no transactions", () => {
    const store = useTransactionsStore();
    expect(store.balance).toBe(0);
  });

  it("groups expenses per category with correct percentages", () => {
    const store = useTransactionsStore();
    store.addTransaction(
      buildTransaction({ type: TransactionType.EXPENSE, category: TransactionCategory.FOOD, amount: 75 })
    );
    store.addTransaction(
      buildTransaction({ type: TransactionType.EXPENSE, category: TransactionCategory.HOUSING, amount: 25 })
    );

    const perCategory = store.totalExpensePerCategory;
    expect(perCategory).toHaveLength(2);

    const food = perCategory.find((c) => c.category === TransactionCategory.FOOD);
    const housing = perCategory.find((c) => c.category === TransactionCategory.HOUSING);

    expect(food?.totalAmount).toBe(75);
    expect(food?.percentageOfTotal).toBe(75);
    expect(housing?.totalAmount).toBe(25);
    expect(housing?.percentageOfTotal).toBe(25);
  });

  it("returns an empty array for totalExpensePerCategory when there are no expenses", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction({ type: TransactionType.DEPOSIT, amount: 100 }));
    expect(store.totalExpensePerCategory).toEqual([]);
  });

  it("computes percentages per transaction type", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction({ type: TransactionType.DEPOSIT, amount: 50 }));
    store.addTransaction(buildTransaction({ type: TransactionType.EXPENSE, amount: 30 }));
    store.addTransaction(buildTransaction({ type: TransactionType.INVESTMENT, amount: 20 }));

    expect(store.typesPercentage).toEqual({ DEPOSIT: 50, EXPENSE: 30, INVESTMENT: 20 });
  });

  it("returns all-zero percentages when there are no transactions", () => {
    const store = useTransactionsStore();
    expect(store.typesPercentage).toEqual({ DEPOSIT: 0, EXPENSE: 0, INVESTMENT: 0 });
  });

  it("returns at most the last 10 transactions sorted by date desc", () => {
    const store = useTransactionsStore();
    for (let i = 0; i < 15; i++) {
      store.addTransaction(
        buildTransaction({ name: `Transação ${i}`, date: new Date(2026, 0, i + 1) })
      );
    }

    const last = store.lastTransactions;
    expect(last).toHaveLength(10);
    expect(last[0].name).toBe("Transação 14");
    expect(last[9].name).toBe("Transação 5");
  });

  it("adds a transaction with a generated id and timestamps", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction({ name: "Nova transação" }));

    expect(store.transactions).toHaveLength(1);
    const [transaction] = store.transactions;
    expect(transaction.name).toBe("Nova transação");
    expect(transaction.id).toBeTruthy();
    expect(transaction.createdAt).toBeInstanceOf(Date);
    expect(transaction.updatedAt).toBeInstanceOf(Date);
  });

  it("updates an existing transaction", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction({ name: "Original" }));
    const [original] = store.transactions;

    store.updateTransaction({ ...original, name: "Atualizado" });

    expect(store.transactions[0].name).toBe("Atualizado");
  });

  it("does nothing when updating a transaction id that does not exist", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction({ name: "Original" }));

    store.updateTransaction({
      ...store.transactions[0],
      id: "non-existent-id",
      name: "Não deveria mudar nada",
    });

    expect(store.transactions).toHaveLength(1);
    expect(store.transactions[0].name).toBe("Original");
  });

  it("deletes a transaction by id", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction({ name: "Para remover" }));
    const [transaction] = store.transactions;

    store.deleteTransaction(transaction.id);

    expect(store.transactions).toHaveLength(0);
  });

  it("does nothing when deleting a non-existent transaction id", () => {
    const store = useTransactionsStore();
    store.addTransaction(buildTransaction());

    store.deleteTransaction("non-existent-id");

    expect(store.transactions).toHaveLength(1);
  });
});
