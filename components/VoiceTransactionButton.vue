<script setup lang="ts">
import { ref, watch } from "vue";
import { Button } from "~/components/ui/button/index.js";
import UpsertTransactionDialog from "~/components/UpsertTransactionDialog.vue";
import { useSpeechRecognition } from "~/composables/useSpeechRecognition.js";
import { parseVoiceTransaction } from "~/lib/parseVoiceTransaction.js";
import { useTransactionsStore } from "~/stores/transactions.js";

const transactionsStore = useTransactionsStore();
const { isSupported, isListening, transcript, error, start, stop } = useSpeechRecognition();

const isDialogOpen = ref(false);
const parsedDefaults = ref<Record<string, unknown>>({});

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

function handleSubmit(data: Parameters<typeof transactionsStore.addTransaction>[0] & { id?: string }) {
  if (data.id) {
    transactionsStore.updateTransaction(data as Parameters<typeof transactionsStore.updateTransaction>[0]);
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

    <p v-if="error" role="alert" class="mt-1 text-sm text-red-500">
      Não foi possível reconhecer sua voz. Tente novamente.
    </p>

    <UpsertTransactionDialog
      :is-open="isDialogOpen"
      :default-values="parsedDefaults"
      @update:is-open="isDialogOpen = $event"
      @submit="handleSubmit"
    />
  </div>
</template>
