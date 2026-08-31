import { describe, it, expect } from "vitest";
import { parseVoiceTransaction } from "~/lib/parseVoiceTransaction";
import { TransactionCategory, TransactionType } from "~/constants/transactions";

describe("parseVoiceTransaction", () => {
  it("parses an expense with amount, category and name", () => {
    const result = parseVoiceTransaction("gastei 50 reais em mercado");

    expect(result).toEqual({
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      amount: 50,
      name: "Mercado",
    });
  });

  it("parses a deposit with a decimal amount using comma", () => {
    const result = parseVoiceTransaction("recebi 1500,50 de salário");

    expect(result.type).toBe(TransactionType.DEPOSIT);
    expect(result.category).toBe(TransactionCategory.SALARY);
    expect(result.amount).toBe(1500.5);
  });

  it("parses an investment", () => {
    const result = parseVoiceTransaction("investi 200 reais");

    expect(result.type).toBe(TransactionType.INVESTMENT);
    expect(result.amount).toBe(200);
  });

  it("recognizes transportation category keywords", () => {
    const result = parseVoiceTransaction("paguei 30 reais de uber");

    expect(result.type).toBe(TransactionType.EXPENSE);
    expect(result.category).toBe(TransactionCategory.TRANSPORTATION);
  });

  it("returns undefined fields when nothing recognizable is found", () => {
    const result = parseVoiceTransaction("olá tudo bem");

    expect(result.type).toBeUndefined();
    expect(result.category).toBeUndefined();
    expect(result.amount).toBeUndefined();
    expect(result.name).toBeUndefined();
  });

  it("is case-insensitive", () => {
    const result = parseVoiceTransaction("GASTEI 20 REAIS EM FARMÁCIA");

    expect(result.type).toBe(TransactionType.EXPENSE);
    expect(result.category).toBe(TransactionCategory.HEALTH);
    expect(result.amount).toBe(20);
    expect(result.name).toBe("Farmácia");
  });
});
