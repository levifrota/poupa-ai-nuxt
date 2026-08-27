import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction } from "@/constants/transactions.js";

export const useRecurringTransactionsStore = defineStore(
  "recurringTransactions",
  () => {
    // Transações recorrentes do usuário, independente do período selecionado
    const recurringTransactions = ref<Transaction[]>([]);
    const isLoading = ref(false);

    function setRecurringTransactions(transactions: Transaction[]) {
      recurringTransactions.value = transactions;
    }

    function setLoading(loading: boolean) {
      isLoading.value = loading;
    }

    // Avança a data da próxima ocorrência após confirmar ou pular uma transação
    function updateNextOccurrenceDate(transactionId: string, nextOccurrenceDate: Date) {
      const transaction = recurringTransactions.value.find(
        (t) => t.id === transactionId
      );
      if (transaction) {
        transaction.nextOccurrenceDate = nextOccurrenceDate;
      }
    }

    return {
      recurringTransactions,
      isLoading,
      setRecurringTransactions,
      setLoading,
      updateNextOccurrenceDate,
    };
  }
);
