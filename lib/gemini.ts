import type { ChatMessage } from "~/lib/aiChat.js";

const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface GeminiPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

export interface GeminiRequestBody {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: GeminiPart[];
  };
}

export interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: GeminiPart[];
    };
  }[];
}

/**
 * Converts our internal ChatMessage list into the Gemini `generateContent`
 * request body: the "system" message (if present) becomes `systemInstruction`,
 * "assistant" messages become role "model", and everything else becomes "user".
 */
export function buildGeminiRequestBody(messages: ChatMessage[]): GeminiRequestBody {
  const systemMessage = messages.find((message) => message.role === "system");

  const contents: GeminiContent[] = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  return {
    contents,
    ...(systemMessage && {
      systemInstruction: { parts: [{ text: systemMessage.content }] },
    }),
  };
}

/**
 * Builds a one-shot (no chat history, no system message) Gemini request body
 * from a raw list of parts. Used for single-purpose extraction calls (e.g.
 * the Telegram bot's text/voice transaction parsing) instead of a
 * multi-turn conversation.
 */
export function buildGeminiPartsRequest(parts: GeminiPart[]): GeminiRequestBody {
  return {
    contents: [{ role: "user", parts }],
  };
}

/**
 * Extracts the generated text from a Gemini `generateContent` response,
 * throwing a friendly error if the response has no usable content.
 */
export function extractGeminiText(response: GeminiResponse): string {
  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .join("");

  if (!text) {
    throw new Error("Resposta vazia da IA. Tente novamente.");
  }

  return text;
}

/**
 * Calls the Gemini `generateContent` REST endpoint.
 */
export async function callGemini(
  apiKey: string,
  body: GeminiRequestBody
): Promise<GeminiResponse> {
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini API respondeu com status ${response.status}`);
  }

  return response.json();
}
