import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction } from "@/constants/transactions.js";

export const useBillsStore = defineStore("bills", () => {
  // Contas a pagar do usuário, independente do período selecionado
  const bills = ref<Transaction[]>([]);
  const isLoading = ref(false);

  function setBills(newBills: Transaction[]) {
    bills.value = newBills;
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading;
  }

  // Marca uma conta como paga após a confirmação do usuário
  function markAsPaid(transactionId: string) {
    const bill = bills.value.find((b) => b.id === transactionId);
    if (bill) {
      bill.isPaid = true;
    }
  }

  return {
    bills,
    isLoading,
    setBills,
    setLoading,
    markAsPaid,
  };
});
