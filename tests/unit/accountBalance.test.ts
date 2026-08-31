import { describe, it, expect } from "vitest";
import {
  calculateAccountBalances,
  calculateUnassignedBalance,
} from "~/lib/accountBalance";
import { AccountType, type Account } from "~/constants/accounts";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
  type Transaction,
} from "~/constants/transactions";

function buildAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: "acc-1",
    name: "Conta corrente",
    type: AccountType.CHECKING,
    userId: "user-1",
    createdAt: new Date(2026, 0, 1),
    updatedAt: new Date(2026, 0, 1),
    ...overrides,
  };
}

function buildTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-1",
    name: "Mercado",
    amount: 100,
    type: TransactionType.EXPENSE,
    category: TransactionCategory.FOOD,
    paymentMethod: TransactionPaymentMethod.CASH,
    date: new Date(2026, 0, 1),
    userId: "user-1",
    createdAt: new Date(2026, 0, 1),
    updatedAt: new Date(2026, 0, 1),
    ...overrides,
  };
}

describe("calculateAccountBalances", () => {
  it("sums deposits as positive and expenses/investments as negative per account", () => {
    const accounts = [buildAccount({ id: "acc-1", name: "Conta corrente" })];
    const transactions = [
      buildTransaction({ accountId: "acc-1", type: TransactionType.DEPOSIT, amount: 500 }),
      buildTransaction({ accountId: "acc-1", type: TransactionType.EXPENSE, amount: 100 }),
      buildTransaction({ accountId: "acc-1", type: TransactionType.INVESTMENT, amount: 50 }),
    ];

    const result = calculateAccountBalances(transactions, accounts);

    expect(result).toEqual([
      { accountId: "acc-1", name: "Conta corrente", type: AccountType.CHECKING, balance: 350 },
    ]);
  });

  it("returns a balance of 0 for accounts with no transactions", () => {
    const accounts = [buildAccount({ id: "acc-1" })];
    const result = calculateAccountBalances([], accounts);
    expect(result[0].balance).toBe(0);
  });

  it("ignores transactions belonging to other accounts", () => {
    const accounts = [buildAccount({ id: "acc-1" }), buildAccount({ id: "acc-2", name: "Poupança" })];
    const transactions = [
      buildTransaction({ accountId: "acc-1", type: TransactionType.DEPOSIT, amount: 200 }),
      buildTransaction({ accountId: "acc-2", type: TransactionType.DEPOSIT, amount: 900 }),
    ];

    const result = calculateAccountBalances(transactions, accounts);

    expect(result.find((a) => a.accountId === "acc-1")?.balance).toBe(200);
    expect(result.find((a) => a.accountId === "acc-2")?.balance).toBe(900);
  });

  it("ignores transactions without an accountId", () => {
    const accounts = [buildAccount({ id: "acc-1" })];
    const transactions = [
      buildTransaction({ type: TransactionType.DEPOSIT, amount: 200, accountId: undefined }),
    ];

    const result = calculateAccountBalances(transactions, accounts);
    expect(result[0].balance).toBe(0);
  });
});

describe("calculateUnassignedBalance", () => {
  it("sums only transactions without an accountId", () => {
    const transactions = [
      buildTransaction({ type: TransactionType.DEPOSIT, amount: 300, accountId: undefined }),
      buildTransaction({ type: TransactionType.EXPENSE, amount: 50, accountId: undefined }),
      buildTransaction({ type: TransactionType.DEPOSIT, amount: 999, accountId: "acc-1" }),
    ];

    expect(calculateUnassignedBalance(transactions)).toBe(250);
  });

  it("returns 0 when every transaction has an account", () => {
    const transactions = [
      buildTransaction({ type: TransactionType.DEPOSIT, amount: 300, accountId: "acc-1" }),
    ];
    expect(calculateUnassignedBalance(transactions)).toBe(0);
  });
});
