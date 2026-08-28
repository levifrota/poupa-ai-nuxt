<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCurrentUser } from "vuefire";
import { Button } from "~/components/ui/button/index.js";
import { ScrollArea } from "~/components/ui/scroll-area/index.js";
import { RECURRENCE_FREQUENCY_LABELS } from "~/constants/transactions.js";
import { useRecurringTransactionsStore } from "~/stores/recurringTransactions.js";
import {
  getRecurringTransactions,
  confirmRecurringOccurrence,
  skipRecurringOccurrence,
} from "~/service/transactionService.js";
import { isOccurrenceDue, calculateNextOccurrenceDate } from "~/lib/recurrence.js";
import type { RecurrenceFrequency, Transaction } from "~/constants/transactions.js";

type DueTransaction = Transaction & {
  nextOccurrenceDate: Date;
  recurrenceFrequency: RecurrenceFrequency;
};

const user = useCurrentUser();
const recurringTransactionsStore = useRecurringTransactionsStore();

const processingId = ref<string | undefined>(undefined);

async function fetchRecurringTransactions() {
  if (!user.value?.uid) return;
  try {
    recurringTransactionsStore.setLoading(true);
    const transactions = await getRecurringTransactions(user.value.uid);
    recurringTransactionsStore.setRecurringTransactions(transactions);
  } catch (error) {
    console.error("Erro ao carregar transações recorrentes:", error);
  } finally {
    recurringTransactionsStore.setLoading(false);
  }
}

onMounted(fetchRecurringTransactions);

const dueTransactions = computed(() => {
  return recurringTransactionsStore.recurringTransactions.filter(
    (transaction): transaction is DueTransaction =>
      Boolean(
        transaction.nextOccurrenceDate &&
          transaction.recurrenceFrequency &&
          isOccurrenceDue(transaction.nextOccurrenceDate)
      )
  );
});

const isLoading = computed(() => recurringTransactionsStore.isLoading);

const { formatCurrency } = useFormatCurrency();

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pt-BR");
};

async function handleConfirm(transactionId: string) {
  if (!user.value?.uid) return;
  const transaction = dueTransactions.value.find((t) => t.id === transactionId);
  if (!transaction) return;

  try {
    processingId.value = transactionId;
    await confirmRecurringOccurrence(user.value.uid, transaction);
    const nextOccurrenceDate = calculateNextOccurrenceDate(
      transaction.nextOccurrenceDate,
      transaction.recurrenceFrequency
    );
    recurringTransactionsStore.updateNextOccurrenceDate(transactionId, nextOccurrenceDate);
  } catch (error) {
    console.error("Erro ao confirmar transação recorrente:", error);
    alert("Erro ao confirmar transação recorrente. Tente novamente.");
  } finally {
    processingId.value = undefined;
  }
}

async function handleSkip(transactionId: string) {
  if (!user.value?.uid) return;
  const transaction = dueTransactions.value.find((t) => t.id === transactionId);
  if (!transaction) return;

  try {
    processingId.value = transactionId;
    await skipRecurringOccurrence(user.value.uid, transaction);
    const nextOccurrenceDate = calculateNextOccurrenceDate(
      transaction.nextOccurrenceDate,
      transaction.recurrenceFrequency
    );
    recurringTransactionsStore.updateNextOccurrenceDate(transactionId, nextOccurrenceDate);
  } catch (error) {
    console.error("Erro ao pular transação recorrente:", error);
    alert("Erro ao pular transação recorrente. Tente novamente.");
  } finally {
    processingId.value = undefined;
  }
}
</script>

<template>
  <ScrollArea
    v-if="isLoading || dueTransactions.length > 0"
    class="col-span-2 h-full rounded-md border p-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Transações Recorrentes Pendentes</h2>
    </div>

    <div
      v-if="isLoading"
      class="flex justify-center items-center h-20"
      role="status"
      aria-live="polite"
    >
      <span>Carregando transações recorrentes...</span>
    </div>

    <div v-else class="space-y-4" role="list" aria-label="Transações recorrentes pendentes">
      <div
        v-for="transaction in dueTransactions"
        :key="transaction.id"
        role="listitem"
        class="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
        :aria-label="`${transaction.name}, ${formatCurrency(transaction.amount)}, vencida em ${formatDate(transaction.nextOccurrenceDate)}, frequência ${RECURRENCE_FREQUENCY_LABELS[transaction.recurrenceFrequency]}`"
      >
        <div>
          <p class="font-medium">{{ transaction.name }}</p>
          <p class="text-sm text-muted-foreground">
            {{ formatCurrency(transaction.amount) }} · vencida em
            {{ formatDate(transaction.nextOccurrenceDate) }} ·
            {{ RECURRENCE_FREQUENCY_LABELS[transaction.recurrenceFrequency] }}
          </p>
        </div>
        <div class="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            :disabled="processingId === transaction.id"
            :aria-label="`Pular esta ocorrência de ${transaction.name}`"
            @click="handleSkip(transaction.id)"
          >
            Pular
          </Button>
          <Button
            size="sm"
            :disabled="processingId === transaction.id"
            :aria-label="`Confirmar transação recorrente ${transaction.name}`"
            @click="handleConfirm(transaction.id)"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  </ScrollArea>
</template>
