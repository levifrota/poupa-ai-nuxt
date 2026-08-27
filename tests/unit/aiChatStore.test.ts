import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAiChatStore } from "~/stores/aiChat";

describe("useAiChatStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty message list and not loading", () => {
    const store = useAiChatStore();
    expect(store.messages).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it("appends messages with addMessage, preserving order", () => {
    const store = useAiChatStore();
    store.addMessage({ role: "user", content: "Oi" });
    store.addMessage({ role: "assistant", content: "Olá!" });

    expect(store.messages).toEqual([
      { role: "user", content: "Oi" },
      { role: "assistant", content: "Olá!" },
    ]);
  });

  it("sets the loading flag", () => {
    const store = useAiChatStore();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it("clears all messages with clearMessages", () => {
    const store = useAiChatStore();
    store.addMessage({ role: "user", content: "Oi" });
    store.clearMessages();
    expect(store.messages).toEqual([]);
  });
});
