import { describe, it, expect } from "vitest";
import { parseNotificationTransaction } from "~/lib/parseNotificationTransaction";
import { TransactionCategory, TransactionType } from "~/constants/transactions";

describe("parseNotificationTransaction", () => {
  it("parses a card purchase notification with amount, category and merchant", () => {
    const result = parseNotificationTransaction(
      "Compra aprovada no valor de R$ 45,90 em Mercado Central"
    );

    expect(result.type).toBe(TransactionType.EXPENSE);
    expect(result.category).toBe(TransactionCategory.FOOD);
    expect(result.amount).toBe(45.9);
    expect(result.name).toBe("Mercado central");
  });

  it("parses a Pix deposit notification without a merchant name", () => {
    const result = parseNotificationTransaction("Você recebeu um Pix de R$ 100,00");

    expect(result.type).toBe(TransactionType.DEPOSIT);
    expect(result.amount).toBe(100);
    expect(result.name).toBeUndefined();
  });

  it("parses a subscription payment notification", () => {
    const result = parseNotificationTransaction(
      "Pagamento aprovado de R$ 39,90 para NETFLIX"
    );

    expect(result.type).toBe(TransactionType.EXPENSE);
    expect(result.category).toBe(TransactionCategory.ENTERTAINMENT);
    expect(result.amount).toBe(39.9);
    expect(result.name).toBe("Netflix");
  });

  it("parses an investment application notification", () => {
    const result = parseNotificationTransaction(
      "Aplicação realizada no valor de R$ 500,00"
    );

    expect(result.type).toBe(TransactionType.INVESTMENT);
    expect(result.amount).toBe(500);
  });

  it("returns undefined fields when nothing recognizable is found", () => {
    const result = parseNotificationTransaction("Olá, tudo bem?");

    expect(result.type).toBeUndefined();
    expect(result.category).toBeUndefined();
    expect(result.amount).toBeUndefined();
    expect(result.name).toBeUndefined();
  });
});
