import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  transactionsToCsv,
  downloadTransactionsCsv,
} from "~/lib/exportTransactions";
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
    amount: 123.45,
    type: TransactionType.EXPENSE,
    category: TransactionCategory.FOOD,
    paymentMethod: TransactionPaymentMethod.CASH,
    date: new Date(2026, 0, 15), // 15/01/2026 local time
    userId: "user-1",
    createdAt: new Date(2026, 0, 15),
    updatedAt: new Date(2026, 0, 15),
    ...overrides,
  };
}

describe("transactionsToCsv", () => {
  it("returns only the BOM + header row when there are no transactions", () => {
    const csv = transactionsToCsv([]);
    expect(csv).toBe(
      "\uFEFFData;Nome;Tipo;Categoria;Método de Pagamento;Valor;Tags"
    );
  });

  it("formats a single transaction with all fields", () => {
    const csv = transactionsToCsv([buildTransaction()]);
    const lines = csv.split("\n");

    expect(lines).toHaveLength(2);
    expect(lines[1]).toBe("15/01/2026;Mercado;Despesa;Alimentação;Dinheiro;123,45;");
  });

  it("joins tags with a comma and space", () => {
    const csv = transactionsToCsv([
      buildTransaction({ tags: ["viagem", "reembolsável"] }),
    ]);
    const [, row] = csv.split("\n");
    expect(row).toContain("viagem, reembolsável");
  });

  it("outputs an empty tags field when tags are undefined", () => {
    const csv = transactionsToCsv([buildTransaction({ tags: undefined })]);
    const [, row] = csv.split("\n");
    expect(row.endsWith(";")).toBe(true);
  });

  it("formats negative amounts with a comma decimal separator", () => {
    const csv = transactionsToCsv([buildTransaction({ amount: -50.5 })]);
    const [, row] = csv.split("\n");
    expect(row).toContain(";-50,50;");
  });

  it("escapes and quotes fields containing a semicolon", () => {
    const csv = transactionsToCsv([buildTransaction({ name: "Mercado; Padaria" })]);
    const [, row] = csv.split("\n");
    expect(row).toContain('"Mercado; Padaria"');
  });

  it("escapes and quotes fields containing double quotes by doubling them", () => {
    const csv = transactionsToCsv([buildTransaction({ name: 'Compra "especial"' })]);
    const [, row] = csv.split("\n");
    expect(row).toContain('"Compra ""especial"""');
  });

  it("escapes and quotes fields containing a newline", () => {
    const csv = transactionsToCsv([buildTransaction({ name: "Linha1\nLinha2" })]);
    expect(csv).toContain('"Linha1\nLinha2"');
  });

  it("falls back to the raw category value when no label exists", () => {
    const csv = transactionsToCsv([
      buildTransaction({ category: "UNKNOWN_CATEGORY" as TransactionCategory }),
    ]);
    const [, row] = csv.split("\n");
    expect(row).toContain(";UNKNOWN_CATEGORY;");
  });

  it("falls back to the raw payment method value when no label exists", () => {
    const csv = transactionsToCsv([
      buildTransaction({
        paymentMethod: "UNKNOWN_METHOD" as TransactionPaymentMethod,
      }),
    ]);
    const [, row] = csv.split("\n");
    expect(row).toContain(";UNKNOWN_METHOD;");
  });

  it("maps each transaction type to its Portuguese label", () => {
    const csv = transactionsToCsv([
      buildTransaction({ type: TransactionType.DEPOSIT }),
      buildTransaction({ type: TransactionType.INVESTMENT }),
    ]);
    const [, depositRow, investmentRow] = csv.split("\n");
    expect(depositRow).toContain(";Depósito;");
    expect(investmentRow).toContain(";Investimento;");
  });

  it("produces one row per transaction, in order", () => {
    const csv = transactionsToCsv([
      buildTransaction({ name: "Primeira" }),
      buildTransaction({ name: "Segunda" }),
      buildTransaction({ name: "Terceira" }),
    ]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(4);
    expect(lines[1]).toContain("Primeira");
    expect(lines[2]).toContain("Segunda");
    expect(lines[3]).toContain("Terceira");
  });
});

describe("downloadTransactionsCsv", () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
  });

  it("creates a link, clicks it, and cleans up the object URL", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(document.body, "removeChild");

    downloadTransactionsCsv([buildTransaction()], "custom.csv");

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("uses the provided file name for the download link", () => {
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, "appendChild");

    downloadTransactionsCsv([buildTransaction()], "meu-arquivo.csv");

    const link = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(link.download).toBe("meu-arquivo.csv");
  });

  it("falls back to a date-based file name when none is provided", () => {
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, "appendChild");

    downloadTransactionsCsv([buildTransaction()]);

    const link = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(link.download).toMatch(/^transacoes-\d{4}-\d{2}-\d{2}\.csv$/);
  });
});
