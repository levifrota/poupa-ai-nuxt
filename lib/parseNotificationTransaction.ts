import { TransactionType } from "~/constants/transactions";
import type { ParsedVoiceTransaction } from "~/lib/parseVoiceTransaction";
import { detectAmount, detectCategory } from "~/lib/parseVoiceTransaction";

export type { ParsedVoiceTransaction as ParsedNotificationTransaction };

const EXPENSE_KEYWORDS = [
  "compra aprovada",
  "compra realizada",
  "compra efetuada",
  "pagamento aprovado",
  "pagamento realizado",
  "pagamento efetuado",
  "cobrança",
  "débito",
  "debito",
  "fatura",
];

const DEPOSIT_KEYWORDS = [
  "pix recebido",
  "você recebeu",
  "voce recebeu",
  "recebimento",
  "depósito recebido",
  "deposito recebido",
  "transferência recebida",
  "transferencia recebida",
];

const INVESTMENT_KEYWORDS = [
  "aplicação realizada",
  "aplicacao realizada",
  "investimento realizado",
  "resgate",
];

function detectType(normalized: string): TransactionType | undefined {
  if (EXPENSE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return TransactionType.EXPENSE;
  }
  if (DEPOSIT_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return TransactionType.DEPOSIT;
  }
  if (INVESTMENT_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return TransactionType.INVESTMENT;
  }
  return undefined;
}

function detectMerchantName(normalized: string): string | undefined {
  const match = normalized.match(/\b(?:em|para|de)\s+([a-zà-úA-ZÀ-Ú0-9\s]+)$/);
  if (!match) {
    return undefined;
  }
  const captured = match[1].trim();
  if (!captured) {
    return undefined;
  }
  return captured.charAt(0).toUpperCase() + captured.slice(1);
}

/**
 * Interpreta o texto de uma notificação bancária/de cartão compartilhada com o
 * app (ex: "Compra aprovada no valor de R$ 45,90 em MERCADO XYZ") e extrai os
 * campos possíveis de uma transação. Campos não identificados ficam
 * undefined e devem ser preenchidos manualmente pelo usuário antes de salvar.
 */
export function parseNotificationTransaction(text: string): ParsedVoiceTransaction {
  const normalized = text.trim().toLowerCase();

  return {
    type: detectType(normalized),
    category: detectCategory(normalized),
    amount: detectAmount(normalized),
    name: detectMerchantName(normalized),
  };
}
