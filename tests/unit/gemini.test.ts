import { describe, it, expect } from "vitest";
import { buildGeminiRequestBody, extractGeminiText } from "~/lib/gemini";
import type { ChatMessage } from "~/lib/aiChat";

describe("buildGeminiRequestBody", () => {
  it("extracts the system message into systemInstruction", () => {
    const messages: ChatMessage[] = [
      { role: "system", content: "Você é um assistente financeiro." },
      { role: "user", content: "Oi" },
    ];

    const body = buildGeminiRequestBody(messages);

    expect(body.systemInstruction).toEqual({
      parts: [{ text: "Você é um assistente financeiro." }],
    });
  });

  it("maps user messages to role user and assistant messages to role model", () => {
    const messages: ChatMessage[] = [
      { role: "system", content: "system prompt" },
      { role: "user", content: "Oi" },
      { role: "assistant", content: "Olá!" },
      { role: "user", content: "Quanto gastei?" },
    ];

    const body = buildGeminiRequestBody(messages);

    expect(body.contents).toEqual([
      { role: "user", parts: [{ text: "Oi" }] },
      { role: "model", parts: [{ text: "Olá!" }] },
      { role: "user", parts: [{ text: "Quanto gastei?" }] },
    ]);
  });

  it("omits systemInstruction when there is no system message", () => {
    const messages: ChatMessage[] = [{ role: "user", content: "Oi" }];

    const body = buildGeminiRequestBody(messages);

    expect(body.systemInstruction).toBeUndefined();
    expect(body.contents).toEqual([{ role: "user", parts: [{ text: "Oi" }] }]);
  });
});

describe("extractGeminiText", () => {
  it("extracts and joins text from the first candidate's parts", () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [{ text: "Olá" }, { text: "!" }],
          },
        },
      ],
    };

    expect(extractGeminiText(response)).toBe("Olá!");
  });

  it("throws a friendly error when there are no candidates", () => {
    expect(() => extractGeminiText({})).toThrow("Resposta vazia da IA. Tente novamente.");
  });

  it("throws a friendly error when parts are empty", () => {
    const response = {
      candidates: [{ content: { parts: [] } }],
    };

    expect(() => extractGeminiText(response)).toThrow(
      "Resposta vazia da IA. Tente novamente."
    );
  });
});
