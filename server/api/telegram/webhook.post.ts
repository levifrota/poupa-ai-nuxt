import { timingSafeEqual } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { buildGeminiPartsRequest, callGemini, extractGeminiText } from "~/lib/gemini.js";
import {
  buildTelegramConfirmationText,
  buildTelegramTransactionPrompt,
  buildTelegramVoiceTransactionPrompt,
  isExpired,
  parseGeminiTransactionJson,
  parseTelegramCallbackData,
  buildTelegramConfirmCallbackData,
  buildTelegramCancelCallbackData,
  type ParsedTelegramTransaction,
} from "~/lib/telegramTransaction.js";
import { TransactionPaymentMethod } from "~/constants/transactions.js";
import { getAdminFirestore } from "~/server/utils/firebaseAdmin.js";
import {
  answerTelegramCallbackQuery,
  downloadTelegramFileAsBase64,
  editTelegramMessageText,
  sendTelegramMessage,
} from "~/server/utils/telegramApi.js";

const MAX_MESSAGE_TEXT_LENGTH = 500;

interface TelegramUpdate {
  message?: {
    message_id: number;
    chat: { id: number };
    text?: string;
    voice?: { file_id: string };
  };
  callback_query?: {
    id: string;
    data?: string;
    message?: { message_id: number; chat: { id: number } };
  };
}

function isValidSecretToken(received: string | undefined, expected: string): boolean {
  if (!received) return false;
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

async function handleStartCommand(
  botToken: string,
  chatId: number,
  text: string
): Promise<void> {
  const db = getAdminFirestore();
  const code = text.split(" ")[1]?.trim().toUpperCase();

  if (!code) {
    await sendTelegramMessage(
      botToken,
      chatId,
      "👋 Para vincular sua conta, gere um código em Configurações no Poupa.ai e envie /start <código> aqui."
    );
    return;
  }

  const codeDocRef = db.collection("telegramLinkCodes").doc(code);
  const codeDoc = await codeDocRef.get();
  const codeData = codeDoc.data();

  if (!codeDoc.exists || !codeData || isExpired((codeData.expiresAt as Timestamp).toDate())) {
    await sendTelegramMessage(botToken, chatId, "❌ Código inválido ou expirado.");
    return;
  }

  await db.collection("telegramLinks").doc(String(chatId)).set({
    uid: codeData.uid,
    linkedAt: FieldValue.serverTimestamp(),
  });
  await codeDocRef.delete();

  await sendTelegramMessage(
    botToken,
    chatId,
    "✅ Conta vinculada com sucesso! Agora envie uma mensagem de texto ou um áudio descrevendo uma transação para registrá-la."
  );
}

async function parseTransactionFromMessage(
  geminiApiKey: string,
  botToken: string,
  message: NonNullable<TelegramUpdate["message"]>
): Promise<ParsedTelegramTransaction> {
  if (message.voice) {
    const audioBase64 = await downloadTelegramFileAsBase64(botToken, message.voice.file_id);
    const request = buildGeminiPartsRequest([
      { text: buildTelegramVoiceTransactionPrompt() },
      { inline_data: { mime_type: "audio/ogg", data: audioBase64 } },
    ]);
    const response = await callGemini(geminiApiKey, request);
    return parseGeminiTransactionJson(extractGeminiText(response));
  }

  const text = (message.text ?? "").slice(0, MAX_MESSAGE_TEXT_LENGTH);
  const request = buildGeminiPartsRequest([{ text: buildTelegramTransactionPrompt(text) }]);
  const response = await callGemini(geminiApiKey, request);
  return parseGeminiTransactionJson(extractGeminiText(response));
}

async function handleTransactionMessage(
  geminiApiKey: string,
  botToken: string,
  chatId: number,
  message: NonNullable<TelegramUpdate["message"]>
): Promise<void> {
  const db = getAdminFirestore();
  const linkDoc = await db.collection("telegramLinks").doc(String(chatId)).get();
  const linkData = linkDoc.data();

  if (!linkDoc.exists || !linkData) {
    await sendTelegramMessage(
      botToken,
      chatId,
      "🔒 Você ainda não vinculou sua conta. Gere um código em Configurações no Poupa.ai e envie /start <código>."
    );
    return;
  }

  if (!message.text && !message.voice) {
    await sendTelegramMessage(
      botToken,
      chatId,
      "🤔 Não entendi esse tipo de mensagem. Envie um texto ou áudio descrevendo a transação."
    );
    return;
  }

  let parsed: ParsedTelegramTransaction;
  try {
    parsed = await parseTransactionFromMessage(geminiApiKey, botToken, message);
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Erro ao processar a mensagem.";
    await sendTelegramMessage(botToken, chatId, `⚠️ ${messageText}`);
    return;
  }

  const pendingRef = await db.collection("telegramPendingTransactions").add({
    uid: linkData.uid,
    chatId,
    ...parsed,
    createdAt: FieldValue.serverTimestamp(),
  });

  await sendTelegramMessage(botToken, chatId, buildTelegramConfirmationText(parsed), {
    inlineKeyboard: [
      [
        { text: "✅ Confirmar", callback_data: buildTelegramConfirmCallbackData(pendingRef.id) },
        { text: "❌ Cancelar", callback_data: buildTelegramCancelCallbackData(pendingRef.id) },
      ],
    ],
  });
}

async function handleCallbackQuery(
  botToken: string,
  callbackQuery: NonNullable<TelegramUpdate["callback_query"]>
): Promise<void> {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  const parsedCallback = callbackQuery.data ? parseTelegramCallbackData(callbackQuery.data) : undefined;

  if (!chatId || !messageId || !parsedCallback) {
    await answerTelegramCallbackQuery(botToken, callbackQuery.id);
    return;
  }

  const db = getAdminFirestore();
  const pendingRef = db.collection("telegramPendingTransactions").doc(parsedCallback.pendingId);
  const pendingDoc = await pendingRef.get();
  const pending = pendingDoc.data();

  if (!pendingDoc.exists || !pending || pending.chatId !== chatId) {
    await answerTelegramCallbackQuery(botToken, callbackQuery.id, "Essa transação não existe mais.");
    await editTelegramMessageText(botToken, chatId, messageId, "⌛ Essa confirmação expirou.");
    return;
  }

  if (parsedCallback.action === "cancel") {
    await pendingRef.delete();
    await answerTelegramCallbackQuery(botToken, callbackQuery.id);
    await editTelegramMessageText(botToken, chatId, messageId, "❌ Lançamento cancelado.");
    return;
  }

  await db.collection("users").doc(pending.uid).collection("transactions").add({
    name: pending.name,
    amount: pending.amount,
    type: pending.type,
    category: pending.category,
    paymentMethod: TransactionPaymentMethod.OTHER,
    date: Timestamp.now(),
    tags: [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await pendingRef.delete();

  await answerTelegramCallbackQuery(botToken, callbackQuery.id, "Transação salva!");
  await editTelegramMessageText(botToken, chatId, messageId, "✅ Transação salva com sucesso!");
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secretToken = getHeader(event, "x-telegram-bot-api-secret-token");

  if (!isValidSecretToken(secretToken, config.telegramWebhookSecret)) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const update = await readBody<TelegramUpdate>(event);
  const botToken = config.telegramBotToken;

  try {
    if (update.callback_query) {
      await handleCallbackQuery(botToken, update.callback_query);
    } else if (update.message) {
      const chatId = update.message.chat.id;
      if (update.message.text?.startsWith("/start")) {
        await handleStartCommand(botToken, chatId, update.message.text);
      } else {
        await handleTransactionMessage(config.geminiApiKey, botToken, chatId, update.message);
      }
    }
  } catch (error) {
    // Always resolve with 200 so Telegram doesn't retry-flood the webhook;
    // log for observability instead.
    console.error("Erro ao processar webhook do Telegram:", error);
  }

  return { ok: true };
});
