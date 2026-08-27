import { describe, it, expect } from "vitest";
import { buildTransactionsContext, buildChatMessages } from "~/lib/aiChat";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
  type Transaction,
} from "~/constants/transactions";

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

describe("buildTransactionsContext", () => {
  it("returns a fallback message when there are no transactions", () => {
    expect(buildTransactionsContext([])).toBe(
      "Nenhuma transação encontrada para o período."
    );
  });

  it("builds a semicolon-separated summary with date-value-type-category", () => {
    const transactions = [
      buildTransaction({
        date: new Date(2026, 0, 1),
        amount: 50,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
      }),
    ];

    const context = buildTransactionsContext(transactions);

    expect(context).toBe("01/01/2026-R$50-Despesa-Alimentação");
  });

  it("joins multiple transactions with a semicolon", () => {
    const transactions = [
      buildTransaction({ amount: 50, type: TransactionType.EXPENSE }),
      buildTransaction({ amount: 500, type: TransactionType.DEPOSIT }),
    ];

    const context = buildTransactionsContext(transactions);

    expect(context.split(";")).toHaveLength(2);
  });
});

describe("buildChatMessages", () => {
  it("prepends a system message with the transactions context", () => {
    const messages = buildChatMessages([], "Quanto gastei?", "some context");

    expect(messages[0]).toMatchObject({ role: "system" });
    expect(messages[0].content).toContain("some context");
  });

  it("preserves prior history and appends the new user message at the end", () => {
    const history = [
      { role: "user" as const, content: "Oi" },
      { role: "assistant" as const, content: "Olá! Como posso ajudar?" },
    ];

    const messages = buildChatMessages(history, "Quanto gastei?", "context");

    expect(messages).toHaveLength(4);
    expect(messages[1]).toEqual(history[0]);
    expect(messages[2]).toEqual(history[1]);
    expect(messages[3]).toEqual({ role: "user", content: "Quanto gastei?" });
  });
});
