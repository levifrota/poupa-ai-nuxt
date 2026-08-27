import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_OPTIONS,
  type Transaction,
  type TransactionCategory,
  type TransactionPaymentMethod,
  type TransactionType,
} from "~/constants/transactions.js";

const CSV_HEADERS = [
  "Data",
  "Nome",
  "Tipo",
  "Categoria",
  "Método de Pagamento",
  "Valor",
  "Tags",
];

function escapeCsvField(value: string): string {
  if (/[";\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

function formatAmount(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

function transactionTypeLabel(type: TransactionType): string {
  return TRANSACTION_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

/**
 * Converte uma lista de transações em uma string CSV (separada por ponto e vírgula,
 * compatível com Excel em pt-BR).
 */
export function transactionsToCsv(transactions: Transaction[]): string {
  const rows = transactions.map((transaction) => {
    const fields = [
      formatDate(transaction.date),
      transaction.name,
      transactionTypeLabel(transaction.type),
      TRANSACTION_CATEGORY_LABELS[transaction.category as TransactionCategory] ??
        transaction.category,
      TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod as TransactionPaymentMethod] ??
        transaction.paymentMethod,
      formatAmount(transaction.amount),
      (transaction.tags ?? []).join(", "),
    ];
    return fields.map(escapeCsvField).join(";");
  });

  // BOM (\uFEFF) garante acentuação correta ao abrir no Excel
  return "\uFEFF" + [CSV_HEADERS.join(";"), ...rows].join("\n");
}

/**
 * Gera e dispara o download de um arquivo CSV com as transações fornecidas.
 */
export function downloadTransactionsCsv(
  transactions: Transaction[],
  fileName = `transacoes-${new Date().toISOString().split("T")[0]}.csv`
): void {
  const csvContent = transactionsToCsv(transactions);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
