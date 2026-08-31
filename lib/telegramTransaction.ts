import {
  TransactionCategory,
  TransactionType,
  TRANSACTION_CATEGORY_LABELS,
} from "~/constants/transactions.js";

export interface ParsedTelegramTransaction {
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

const LINK_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sem O/0/I/1 (ambíguos)
export const TELEGRAM_LINK_CODE_LENGTH = 8;
export const TELEGRAM_LINK_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutos

export const TELEGRAM_CONFIRM_CALLBACK_PREFIX = "tgc:";
export const TELEGRAM_CANCEL_CALLBACK_PREFIX = "tgx:";

export type TelegramCallbackAction =
  | { action: "confirm"; pendingId: string }
  | { action: "cancel"; pendingId: string };

export function buildTelegramConfirmCallbackData(pendingId: string): string {
  return `${TELEGRAM_CONFIRM_CALLBACK_PREFIX}${pendingId}`;
}

export function buildTelegramCancelCallbackData(pendingId: string): string {
  return `${TELEGRAM_CANCEL_CALLBACK_PREFIX}${pendingId}`;
}

/**
 * Parses a Telegram inline-keyboard `callback_data` string (limited to 64
 * bytes by Telegram, hence only carrying a short action prefix + a Firestore
 * doc id instead of the full transaction payload).
 */
export function parseTelegramCallbackData(data: string): TelegramCallbackAction | undefined {
  if (data.startsWith(TELEGRAM_CONFIRM_CALLBACK_PREFIX)) {
    return { action: "confirm", pendingId: data.slice(TELEGRAM_CONFIRM_CALLBACK_PREFIX.length) };
  }
  if (data.startsWith(TELEGRAM_CANCEL_CALLBACK_PREFIX)) {
    return { action: "cancel", pendingId: data.slice(TELEGRAM_CANCEL_CALLBACK_PREFIX.length) };
  }
  return undefined;
}

/**
 * Pure expiry check for linking codes and pending transactions.
 */
export function isExpired(expiresAt: Date, now: Date = new Date()): boolean {
  return now.getTime() > expiresAt.getTime();
}

/**
 * Builds a random, single-use linking code from a source of random bytes.
 * Pure/testable: the caller supplies the random bytes (e.g. from
 * `crypto.getRandomValues`), so this function itself has no side effects.
 */
export function buildLinkCodeFromBytes(randomBytes: number[]): string {
  return randomBytes
    .map((byte) => LINK_CODE_ALPHABET[byte % LINK_CODE_ALPHABET.length])
    .join("");
}

/**
 * Builds the instruction prompt sent to Gemini to extract transaction fields
 * from free-form Portuguese text (typed or transcribed from voice).
 */
export function buildTelegramTransactionPrompt(messageText: string): string {
  const categories = Object.values(TransactionCategory).join(", ");
  const types = Object.values(TransactionType).join(", ");

  return `Você é um assistente que extrai dados de uma transação financeira a partir de uma mensagem em português.

Categorias válidas: ${categories}
Tipos válidos: ${types}

Responda APENAS com um JSON (sem markdown, sem texto extra) no formato:
{"name": string, "amount": number, "type": string, "category": string}

Regras:
- "amount" deve ser um número positivo (ex: 45.9), nunca uma string.
- "type" e "category" devem ser exatamente um dos valores válidos acima.
- Se não conseguir identificar algum campo com confiança, responda com {"error": "motivo em português"}.

Mensagem: "${messageText}"`;
}

/**
 * Same extraction task, but for a transcribed voice note: asks Gemini to
 * transcribe the audio in Portuguese and extract the same JSON in one call.
 */
export function buildTelegramVoiceTransactionPrompt(): string {
  const categories = Object.values(TransactionCategory).join(", ");
  const types = Object.values(TransactionType).join(", ");

  return `Você é um assistente que transcreve um áudio em português brasileiro descrevendo uma transação financeira e extrai seus dados.

Categorias válidas: ${categories}
Tipos válidos: ${types}

Responda APENAS com um JSON (sem markdown, sem texto extra) no formato:
{"name": string, "amount": number, "type": string, "category": string}

Regras:
- "amount" deve ser um número positivo (ex: 45.9), nunca uma string.
- "type" e "category" devem ser exatamente um dos valores válidos acima.
- Se não conseguir identificar algum campo com confiança, responda com {"error": "motivo em português"}.`;
}

/**
 * Strips an optional ```json ... ``` markdown fence (Gemini frequently wraps
 * JSON responses in one, even when explicitly asked not to) before parsing.
 */
function extractJsonPayload(rawText: string): unknown {
  const trimmed = rawText.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonText = fenceMatch ? fenceMatch[1] : trimmed;

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error("Não consegui entender a resposta da IA. Tente novamente.");
  }
}

/**
 * Parses and validates Gemini's raw text response into a
 * `ParsedTelegramTransaction`, throwing a friendly Portuguese error if the
 * fields are missing, malformed, or Gemini reported it couldn't understand
 * the message.
 */
export function parseGeminiTransactionJson(rawText: string): ParsedTelegramTransaction {
  const payload = extractJsonPayload(rawText) as Record<string, unknown>;

  if (typeof payload.error === "string") {
    throw new Error(payload.error);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const amount = typeof payload.amount === "number" ? payload.amount : NaN;
  const type = payload.type as TransactionType;
  const category = payload.category as TransactionCategory;

  if (!name) {
    throw new Error("Não consegui identificar o nome da transação.");
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Não consegui identificar um valor válido para a transação.");
  }
  if (!Object.values(TransactionType).includes(type)) {
    throw new Error("Não consegui identificar o tipo da transação.");
  }
  if (!Object.values(TransactionCategory).includes(category)) {
    throw new Error("Não consegui identificar a categoria da transação.");
  }

  return { name, amount, type, category };
}

const TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.EXPENSE]: "Despesa",
  [TransactionType.DEPOSIT]: "Receita",
  [TransactionType.INVESTMENT]: "Investimento",
};

/**
 * Builds the human-readable confirmation message shown before saving,
 * matching the app-wide "never auto-save without confirmation" convention.
 */
export function buildTelegramConfirmationText(parsed: ParsedTelegramTransaction): string {
  const formattedAmount = parsed.amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    `📋 Confirma esse lançamento?\n\n` +
    `📛 Nome: ${parsed.name}\n` +
    `💰 Valor: ${formattedAmount}\n` +
    `🔀 Tipo: ${TYPE_LABELS[parsed.type]}\n` +
    `🏷️ Categoria: ${TRANSACTION_CATEGORY_LABELS[parsed.category]}`
  );
}
