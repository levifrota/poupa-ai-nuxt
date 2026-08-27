<script setup lang="ts">
import { ref, nextTick } from "vue";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import askAiChat from "@/app/_actions/ai-chat/index.js";
import { useAiChatStore } from "~/stores/aiChat.js";
import type { ChatMessage } from "~/lib/aiChat.js";

const aiChatStore = useAiChatStore();
const userMessage = ref("");
const scrollAreaRef = ref<InstanceType<typeof ScrollArea> | null>(null);

function renderMessage(content: string): string {
  return DOMPurify.sanitize(marked.parse(content) as string);
}

async function scrollToBottom() {
  await nextTick();
  const viewport = scrollAreaRef.value?.$el?.querySelector(
    "[data-reka-scroll-area-viewport]"
  );
  if (viewport) {
    viewport.scrollTop = viewport.scrollHeight;
  }
}

async function handleSendMessage() {
  const message = userMessage.value.trim();
  if (!message || aiChatStore.isLoading) return;

  const history: ChatMessage[] = aiChatStore.messages;

  aiChatStore.addMessage({ role: "user", content: message });
  userMessage.value = "";
  aiChatStore.setLoading(true);
  scrollToBottom();

  try {
    const reply = await askAiChat({ message, history });
    aiChatStore.addMessage({ role: "assistant", content: reply });
  } catch (error) {
    console.error("Erro completo:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro ao processar sua pergunta. Tente novamente.";
    aiChatStore.addMessage({ role: "assistant", content: errorMessage });
  } finally {
    aiChatStore.setLoading(false);
    scrollToBottom();
  }
}

function handleClearChat() {
  aiChatStore.clearMessages();
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button aria-label="Abrir chat com IA sobre suas finanças">
        Chat IA
        <Icon name="lucide:message-circle" class="mr-2" />
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90%] max-w-[90%] sm:max-h-none sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle>Converse com a IA sobre suas finanças</DialogTitle>
        <DialogDescription>
          Pergunte sobre suas transações, gastos e finanças em geral. <br />
          <span className="text-red-500">
            Atenção: A ferramenta pode não ser precisa e pode gerar erros. Use as
            informações com cuidado.
          </span>
        </DialogDescription>
      </DialogHeader>

      <ScrollArea ref="scrollAreaRef" class="prose h-[350px] max-h-[350px]">
        <div
          v-if="aiChatStore.messages.length === 0"
          class="text-sm text-gray-500 dark:text-gray-400"
          role="status"
        >
          Faça uma pergunta sobre suas finanças para começar.
        </div>
        <div v-else role="list" aria-label="Histórico da conversa" class="space-y-3">
          <div
            v-for="(message, index) in aiChatStore.messages"
            :key="index"
            role="listitem"
            class="rounded-md p-2"
            :class="
              message.role === 'user'
                ? 'bg-primary/10 ml-6'
                : 'bg-gray-100 dark:bg-gray-800 mr-6'
            "
          >
            <p class="text-xs font-semibold mb-1">
              {{ message.role === "user" ? "Você" : "IA" }}
            </p>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div
              class="text-sm whitespace-pre-wrap break-words"
              v-html="renderMessage(message.content)"
            />
          </div>
        </div>
        <div v-if="aiChatStore.isLoading" role="status" aria-live="polite" class="mt-2">
          <Icon name="lucide:loader-circle" class="animate-spin" aria-hidden="true" />
          <span class="sr-only">Aguardando resposta da IA</span>
        </div>
      </ScrollArea>

      <form class="flex gap-2" @submit.prevent="handleSendMessage">
        <label for="ai-chat-message" class="sr-only">Sua pergunta</label>
        <Input
          id="ai-chat-message"
          v-model="userMessage"
          placeholder="Ex: Quanto gastei com alimentação este mês?"
          :disabled="aiChatStore.isLoading"
        />
        <Button
          type="submit"
          :disabled="aiChatStore.isLoading || !userMessage.trim()"
          aria-label="Enviar pergunta"
        >
          <Icon name="lucide:send" />
        </Button>
      </form>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">Fechar</Button>
        </DialogClose>
        <Button
          v-if="aiChatStore.messages.length > 0"
          variant="ghost"
          aria-label="Limpar histórico da conversa"
          @click="handleClearChat"
        >
          Limpar conversa
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
