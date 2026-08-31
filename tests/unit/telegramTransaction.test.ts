import { describe, it, expect } from "vitest";
import { TransactionCategory, TransactionType } from "~/constants/transactions";
import {
  buildLinkCodeFromBytes,
  buildTelegramCancelCallbackData,
  buildTelegramConfirmCallbackData,
  buildTelegramConfirmationText,
  getSaoPauloDateString,
  isExpired,
  parseGeminiTransactionJson,
  parseTelegramCallbackData,
  resolveTelegramTransactionDate,
} from "~/lib/telegramTransaction";

describe("buildLinkCodeFromBytes", () => {
  it("maps random bytes deterministically to alphabet characters", () => {
    const code = buildLinkCodeFromBytes([0, 1, 2, 3]);
    expect(code).toHaveLength(4);
    expect(code).toMatch(/^[A-Z2-9]+$/);
  });

  it("produces the same code for the same bytes", () => {
    expect(buildLinkCodeFromBytes([5, 10, 15])).toBe(buildLinkCodeFromBytes([5, 10, 15]));
  });
});

describe("parseGeminiTransactionJson", () => {
  it("parses a valid JSON response", () => {
    const raw = JSON.stringify({
      name: "Mercado",
      amount: 120.5,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
    });

    expect(parseGeminiTransactionJson(raw)).toEqual({
      name: "Mercado",
      amount: 120.5,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      date: null,
    });
  });

  it("parses an explicit date mentioned by the user", () => {
    const raw = JSON.stringify({
      name: "Mercado",
      amount: 120.5,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      date: "2026-08-15",
    });

    expect(parseGeminiTransactionJson(raw).date).toBe("2026-08-15");
  });

  it("throws a friendly error for a malformed date", () => {
    const raw = JSON.stringify({
      name: "Mercado",
      amount: 120.5,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      date: "15/08/2026",
    });

    expect(() => parseGeminiTransactionJson(raw)).toThrow(/data/);
  });

  it("strips a markdown json fence before parsing", () => {
    const raw = `\`\`\`json\n${JSON.stringify({
      name: "Uber",
      amount: 25,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.TRANSPORTATION,
    })}\n\`\`\``;

    expect(parseGeminiTransactionJson(raw).name).toBe("Uber");
  });

  it("throws the error message reported by Gemini", () => {
    const raw = JSON.stringify({ error: "Não entendi o valor da transação." });
    expect(() => parseGeminiTransactionJson(raw)).toThrow("Não entendi o valor da transação.");
  });

  it("throws a friendly error for a missing name", () => {
    const raw = JSON.stringify({
      amount: 10,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
    });
    expect(() => parseGeminiTransactionJson(raw)).toThrow(/nome/);
  });

  it("throws a friendly error for a non-positive amount", () => {
    const raw = JSON.stringify({
      name: "Mercado",
      amount: -5,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
    });
    expect(() => parseGeminiTransactionJson(raw)).toThrow(/valor/);
  });

  it("throws a friendly error for an invalid type", () => {
    const raw = JSON.stringify({
      name: "Mercado",
      amount: 10,
      type: "INVALID",
      category: TransactionCategory.FOOD,
    });
    expect(() => parseGeminiTransactionJson(raw)).toThrow(/tipo/);
  });

  it("throws a friendly error for an invalid category", () => {
    const raw = JSON.stringify({
      name: "Mercado",
      amount: 10,
      type: TransactionType.EXPENSE,
      category: "INVALID",
    });
    expect(() => parseGeminiTransactionJson(raw)).toThrow(/categoria/);
  });

  it("throws when the response isn't valid JSON", () => {
    expect(() => parseGeminiTransactionJson("não é json")).toThrow();
  });
});

describe("buildTelegramConfirmationText", () => {
  it("formats the confirmation message in Portuguese with a currency amount", () => {
    const text = buildTelegramConfirmationText({
      name: "Mercado",
      amount: 120.5,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      date: "2026-08-15",
    });

    expect(text).toContain("Mercado");
    expect(text).toContain("Despesa");
    expect(text).toMatch(/R\$\s?120,50/);
    expect(text).toContain("15/08/2026");
  });
});

describe("getSaoPauloDateString", () => {
  it("formats a date as YYYY-MM-DD in the América/São Paulo timezone", () => {
    expect(getSaoPauloDateString(new Date("2026-08-15T02:00:00Z"))).toBe("2026-08-14");
  });
});

describe("resolveTelegramTransactionDate", () => {
  it("uses the parsed date when the user mentioned one", () => {
    const resolved = resolveTelegramTransactionDate("2026-08-15");
    expect(resolved.toISOString()).toBe("2026-08-15T00:00:00.000Z");
  });

  it("falls back to today (América/São Paulo) when no date was mentioned", () => {
    const now = new Date("2026-08-15T02:00:00Z");
    const resolved = resolveTelegramTransactionDate(null, now);
    expect(resolved.toISOString()).toBe("2026-08-14T00:00:00.000Z");
  });
});

describe("callback data helpers", () => {
  it("round-trips a confirm callback", () => {
    const data = buildTelegramConfirmCallbackData("abc123");
    expect(parseTelegramCallbackData(data)).toEqual({ action: "confirm", pendingId: "abc123" });
  });

  it("round-trips a cancel callback", () => {
    const data = buildTelegramCancelCallbackData("abc123");
    expect(parseTelegramCallbackData(data)).toEqual({ action: "cancel", pendingId: "abc123" });
  });

  it("returns undefined for unrecognized callback data", () => {
    expect(parseTelegramCallbackData("unknown:abc")).toBeUndefined();
  });
});

describe("isExpired", () => {
  it("returns true when now is after expiresAt", () => {
    const expiresAt = new Date("2024-01-01T00:00:00Z");
    const now = new Date("2024-01-01T00:00:01Z");
    expect(isExpired(expiresAt, now)).toBe(true);
  });

  it("returns false when now is before expiresAt", () => {
    const expiresAt = new Date("2024-01-01T00:00:01Z");
    const now = new Date("2024-01-01T00:00:00Z");
    expect(isExpired(expiresAt, now)).toBe(false);
  });
});
