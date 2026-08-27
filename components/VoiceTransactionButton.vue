<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Button } from "~/components/ui/button/index.js";
import UpsertTransactionDialog from "~/components/UpsertTransactionDialog.vue";
import { useSpeechRecognition } from "~/composables/useSpeechRecognition.js";
import { parseVoiceTransaction } from "~/lib/parseVoiceTransaction.js";
import { useTransactionsStore } from "~/stores/transactions.js";
import type { TransactionCategory, TransactionType } from "~/constants/transactions.js";

const transactionsStore = useTransactionsStore();
const {
  isSupported,
  isListening,
  transcript,
  error,
  start,
  stop,
} = useSpeechRecognition();

const isDialogOpen = ref(false);

interface ParsedTransactionDefaults {
  name?: string;
  amount?: number;
  type?: TransactionType;
  category?: TransactionCategory;
}

const parsedDefaults = ref<ParsedTransactionDefaults>({});

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed":
    "Permissão de microfone negada. Habilite o acesso ao microfone nas configurações do navegador.",
  "service-not-allowed":
    "Permissão de microfone negada. Habilite o acesso ao microfone nas configurações do navegador.",
  "audio-capture":
    "Nenhum microfone foi encontrado. Verifique se há um microfone conectado.",
  "no-speech": "Nenhuma fala foi detectada. Tente falar novamente.",
  network: "Erro de rede ao reconhecer a voz. Verifique sua conexão.",
  aborted: "Reconhecimento de voz cancelado.",
};

const errorMessage = computed(() => {
  if (!error.value) {
    return null;
  }
  return (
    ERROR_MESSAGES[error.value] ?? "Não foi possível reconhecer sua voz. Tente novamente."
  );
});

watch(transcript, (value) => {
  if (!value) {
    return;
  }

  const parsed = parseVoiceTransaction(value);
  parsedDefaults.value = {
    ...(parsed.name && { name: parsed.name }),
    ...(parsed.amount !== undefined && { amount: parsed.amount }),
    ...(parsed.type && { type: parsed.type }),
    ...(parsed.category && { category: parsed.category }),
  };
  isDialogOpen.value = true;
});

function handleSubmit(
  data: Parameters<typeof transactionsStore.addTransaction>[0] & { id?: string }
) {
  if (data.id) {
    transactionsStore.updateTransaction(
      data as Parameters<typeof transactionsStore.updateTransaction>[0]
    );
  } else {
    transactionsStore.addTransaction(data);
  }
}

function handleMicClick() {
  if (isListening.value) {
    stop();
  } else {
    start();
  }
}
</script>

<template>
  <div v-if="isSupported" class="inline-block">
    <Button
      type="button"
      variant="outline"
      size="icon"
      :aria-pressed="isListening"
      :aria-label="isListening ? 'Parar gravação de voz' : 'Adicionar transação por voz'"
      class="cursor-pointer"
      @click="handleMicClick"
    >
      <Icon :name="isListening ? 'lucide:mic' : 'lucide:mic-off'" class="h-4 w-4" />
    </Button>

    <p v-if="errorMessage" role="alert" class="mt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <UpsertTransactionDialog
      :is-open="isDialogOpen"
      :default-values="parsedDefaults"
      @update:is-open="isDialogOpen = $event"
      @submit="handleSubmit"
    />
  </div>
</template>
