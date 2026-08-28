<template>
  <div class="container mx-auto max-w-2xl p-6">
    <h1 class="mb-4 text-2xl font-bold">Transação compartilhada</h1>

    <p v-if="!sharedText" class="text-muted-foreground">
      Nenhum texto de notificação foi recebido. No seu celular, toque em
      "Compartilhar" em uma notificação bancária ou de cartão e selecione o
      Poupa.ai para criar uma transação automaticamente a partir dela.
    </p>

    <div v-else class="space-y-4">
      <div class="rounded-md border p-3 text-sm text-muted-foreground">
        <span class="font-medium text-foreground">Texto recebido:</span>
        {{ sharedText }}
      </div>
      <p class="text-sm text-muted-foreground">
        Revise os campos identificados automaticamente e confirme para salvar a
        transação.
      </p>
    </div>

    <UpsertTransactionDialog
      :is-open="isDialogOpen"
      :default-values="parsedDefaults"
      @update:is-open="isDialogOpen = $event"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import UpsertTransactionDialog from "~/components/UpsertTransactionDialog.vue";
import { parseNotificationTransaction } from "~/lib/parseNotificationTransaction";
import { useTransactionsStore } from "~/stores/transactions.js";
import type { TransactionCategory, TransactionType } from "~/constants/transactions.js";

definePageMeta({
  middleware: "auth",
});

const transactionsStore = useTransactionsStore();
const route = useRoute();

const isDialogOpen = ref(false);
const sharedText = ref("");

interface ParsedTransactionDefaults {
  name?: string;
  amount?: number;
  type?: TransactionType;
  category?: TransactionCategory;
}

const parsedDefaults = ref<ParsedTransactionDefaults>({});

onMounted(() => {
  const text = route.query.text ?? route.query.title ?? "";
  sharedText.value = Array.isArray(text) ? (text[0] ?? "") : text;

  if (!sharedText.value) {
    return;
  }

  const parsed = parseNotificationTransaction(sharedText.value);
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
</script>
