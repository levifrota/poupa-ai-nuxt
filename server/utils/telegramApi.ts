const TELEGRAM_API_BASE = "https://api.telegram.org";

export interface TelegramInlineKeyboardButton {
  text: string;
  callback_data: string;
}

export interface TelegramSendMessageOptions {
  replyToMessageId?: number;
  inlineKeyboard?: TelegramInlineKeyboardButton[][];
}

function getTelegramApiUrl(botToken: string, method: string): string {
  return `${TELEGRAM_API_BASE}/bot${botToken}/${method}`;
}

async function callTelegramApi<T = unknown>(
  botToken: string,
  method: string,
  payload: Record<string, unknown>
): Promise<T> {
  const response = await fetch(getTelegramApiUrl(botToken, method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || data.ok === false) {
    throw new Error(`Telegram API (${method}) respondeu com erro: ${JSON.stringify(data)}`);
  }

  return data.result as T;
}

export async function sendTelegramMessage(
  botToken: string,
  chatId: number | string,
  text: string,
  options: TelegramSendMessageOptions = {}
): Promise<{ message_id: number }> {
  return callTelegramApi(botToken, "sendMessage", {
    chat_id: chatId,
    text,
    reply_to_message_id: options.replyToMessageId,
    ...(options.inlineKeyboard && {
      reply_markup: { inline_keyboard: options.inlineKeyboard },
    }),
  });
}

export async function editTelegramMessageText(
  botToken: string,
  chatId: number | string,
  messageId: number,
  text: string
): Promise<void> {
  await callTelegramApi(botToken, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
  });
}

export async function answerTelegramCallbackQuery(
  botToken: string,
  callbackQueryId: string,
  text?: string
): Promise<void> {
  await callTelegramApi(botToken, "answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text && { text }),
  });
}

/**
 * Resolves a Telegram file id (e.g. from a voice message) to its downloadable
 * bytes, base64-encoded (ready to send to Gemini as `inline_data`).
 */
export async function downloadTelegramFileAsBase64(
  botToken: string,
  fileId: string
): Promise<string> {
  const file = await callTelegramApi<{ file_path: string }>(botToken, "getFile", {
    file_id: fileId,
  });

  const fileUrl = `${TELEGRAM_API_BASE}/file/bot${botToken}/${file.file_path}`;
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Falha ao baixar arquivo do Telegram (status ${response.status})`);
  }

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
