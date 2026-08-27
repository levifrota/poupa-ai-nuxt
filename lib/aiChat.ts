import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_TYPE_OPTIONS,
  type Transaction,
  type TransactionCategory,
} from "~/constants/transactions.js";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Builds a compact, semicolon-separated summary of transactions to be used
 * as context for the AI chat, mirroring the format used by the AI report
 * feature ({DATA}-{VALOR}-{TIPO}-{CATEGORIA}).
 */
export function buildTransactionsContext(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return "Nenhuma transação encontrada para o período.";
  }

  return transactions
    .map(
      (transaction) =>
        `${new Date(transaction.date).toLocaleDateString("pt-BR")}-R$${transaction.amount}-${
          TRANSACTION_TYPE_OPTIONS.find((opt) => opt.value === transaction.type)?.label ||
          transaction.type
        }-${TRANSACTION_CATEGORY_LABELS[transaction.category as TransactionCategory]}`
    )
    .join(";");
}

/**
 * Builds the full message list (system + history + new user message) to send
 * to the AI model, injecting the transactions context into the system prompt.
 */
export function buildChatMessages(
  history: ChatMessage[],
  userMessage: string,
  transactionsContext: string
): ChatMessage[] {
  const systemMessage: ChatMessage = {
    role: "system",
    content: `Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças, respondendo perguntas sobre o histórico de transações do usuário. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{VALOR}-{TIPO}-{CATEGORIA}. São elas: ${transactionsContext}. Se não houver dados suficientes para responder, informe isso ao usuário de forma clara.`,
  };

  return [systemMessage, ...history, { role: "user", content: userMessage }];
}
