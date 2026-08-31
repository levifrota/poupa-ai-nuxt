import { defineStore } from "pinia";
import { ref } from "vue";
import type { ChatMessage } from "@/lib/aiChat.js";

export const useAiChatStore = defineStore("aiChat", () => {
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);

  function addMessage(message: ChatMessage) {
    messages.value = [...messages.value, message];
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  function clearMessages() {
    messages.value = [];
  }

  return {
    messages,
    isLoading,
    addMessage,
    setLoading,
    clearMessages,
  };
});
