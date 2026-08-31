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
  /** ISO date ("YYYY-MM-DD") explicitly mentioned by the user, or `null` if not mentioned. */
  date: string | null;
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
 *
 * `referenceDate` ("YYYY-MM-DD") is today's date from the server's point of
 * view, used so Gemini can resolve relative dates like "ontem" or "sexta-feira passada".
 */
export function buildTelegramTransactionPrompt(messageText: string, referenceDate: string): string {
  const categories = Object.values(TransactionCategory).join(", ");
  const types = Object.values(TransactionType).join(", ");

  return `Você é um assistente que extrai dados de uma transação financeira a partir de uma mensagem em português.

A data de hoje é ${referenceDate} (formato YYYY-MM-DD).

Categorias válidas: ${categories}
Tipos válidos: ${types}

Responda APENAS com um JSON (sem markdown, sem texto extra) no formato:
{"name": string, "amount": number, "type": string, "category": string, "date": string | null}

Regras:
- "amount" deve ser um número positivo (ex: 45.9), nunca uma string.
- "type" e "category" devem ser exatamente um dos valores válidos acima.
- "date" deve estar no formato "YYYY-MM-DD". Se o usuário mencionar uma data (absoluta, como "15/08", ou relativa, como "ontem", "anteontem", "sexta-feira passada"), calcule a data com base em ${referenceDate} e retorne-a. Se nenhuma data for mencionada, retorne null.
- Se não conseguir identificar algum campo com confiança, responda com {"error": "motivo em português"}.

Mensagem: "${messageText}"`;
}

/**
 * Same extraction task, but for a transcribed voice note: asks Gemini to
 * transcribe the audio in Portuguese and extract the same JSON in one call.
 */
export function buildTelegramVoiceTransactionPrompt(referenceDate: string): string {
  const categories = Object.values(TransactionCategory).join(", ");
  const types = Object.values(TransactionType).join(", ");

  return `Você é um assistente que transcreve um áudio em português brasileiro descrevendo uma transação financeira e extrai seus dados.

A data de hoje é ${referenceDate} (formato YYYY-MM-DD).

Categorias válidas: ${categories}
Tipos válidos: ${types}

Responda APENAS com um JSON (sem markdown, sem texto extra) no formato:
{"name": string, "amount": number, "type": string, "category": string, "date": string | null}

Regras:
- "amount" deve ser um número positivo (ex: 45.9), nunca uma string.
- "type" e "category" devem ser exatamente um dos valores válidos acima.
- "date" deve estar no formato "YYYY-MM-DD". Se o usuário mencionar uma data (absoluta, como "15/08", ou relativa, como "ontem", "anteontem", "sexta-feira passada"), calcule a data com base em ${referenceDate} e retorne-a. Se nenhuma data for mencionada, retorne null.
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
  const rawDate = payload.date;

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
  if (rawDate !== null && rawDate !== undefined) {
    if (typeof rawDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      throw new Error("Não consegui identificar a data da transação.");
    }
    if (Number.isNaN(new Date(`${rawDate}T00:00:00`).getTime())) {
      throw new Error("Não consegui identificar a data da transação.");
    }
  }
  const date = typeof rawDate === "string" ? rawDate : null;

  return { name, amount, type, category, date };
}

/**
 * Returns today's date as "YYYY-MM-DD" in the América/São Paulo timezone,
 * used both as Gemini's reference date and as the fallback resolved date
 * when the user doesn't mention one explicitly.
 */
export function getSaoPauloDateString(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(now);
}

/**
 * Resolves a parsed transaction's date (an ISO "YYYY-MM-DD" string, or
 * `null` when the user didn't mention one) into a concrete `Date`, defaulting
 * to today (América/São Paulo) when not specified.
 */
export function resolveTelegramTransactionDate(date: string | null, now: Date = new Date()): Date {
  const isoDate = date ?? getSaoPauloDateString(now);
  return new Date(`${isoDate}T00:00:00Z`);
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
  const formattedDate = resolveTelegramTransactionDate(parsed.date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });

  return (
    `📋 Confirma esse lançamento?\n\n` +
    `📛 Nome: ${parsed.name}\n` +
    `💰 Valor: ${formattedAmount}\n` +
    `🔀 Tipo: ${TYPE_LABELS[parsed.type]}\n` +
    `🏷️ Categoria: ${TRANSACTION_CATEGORY_LABELS[parsed.category]}\n` +
    `📅 Data: ${formattedDate}`
  );
}
