<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between flex-col sm:flex-row">
      <h1 class="mb-4 text-2xl font-bold">Transações</h1>
      <UpsertTransactionDialog
        :is-open="isUpsertTransactionDialogOpen"
        :default-values="selectedTransaction"
        :transaction-id="selectedTransaction?.id"
        @update:is-open="handleDialogClose"
        @submit="handleSubmit"
      >
        <DialogTrigger as-child>
          <Button>Adicionar transação</Button>
        </DialogTrigger>
      </UpsertTransactionDialog>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center h-40">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span class="ml-2">Carregando transações...</span>
    </div>
    <div v-else-if="error" class="text-red-500 text-center p-4">
      {{ error }}
    </div>
    <DataTable v-else :columns="columns" :data="formattedTransactions" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import DataTable from '@/components/transactions/DataTable.vue';
import UpsertTransactionDialog from '~/components/UpsertTransactionDialog.vue';
import { Button } from '~/components/ui/button/index.js';
import { DialogTrigger } from '~/components/ui/dialog/index.js';
import { columns, type Transaction } from '~/components/transactions/columns.js';
import { useTransactionsStore } from '~/stores/transactions.js';
import { TRANSACTION_CATEGORY_LABELS, type TransactionCategory } from '~/constants/transactions.js';
import { deleteTransaction, getTransactions } from '~/service/transactionService.js';
import { useCurrentUser } from 'vuefire';

const isUpsertTransactionDialogOpen = ref(false);
const selectedTransaction = ref<Transaction | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

definePageMeta({
  middleware: 'auth'
})

const transactionStore = useTransactionsStore();
const user = useCurrentUser();

async function fetchTransactions() {
  if (!user.value?.uid) {
    error.value = "Usuário não autenticado";
    return;
  }


  try {
    isLoading.value = true;
    error.value = null;
    const transaction = await getTransactions(user.value.uid);
    transactionStore.setTransactions(transaction);
  } catch (err) {
    console.error(err);
    error.value = "Erro ao carregar transações";
  } finally {
    isLoading.value = false;
  }
}

function handleSubmit(data) {
  if (data.id) {
    transactionStore.updateTransaction(data);
  } else {
    transactionStore.addTransaction(data);
  }
  fetchTransactions();
}

function handleDialogClose(isOpen: boolean) {
  isUpsertTransactionDialogOpen.value = isOpen;
  if (!isOpen) {
    selectedTransaction.value = null;
  }
}

// Função para lidar com edição de transação
function handleEditTransaction(event: CustomEvent) {
  const { transaction } = event.detail;
  selectedTransaction.value = transaction;
  isUpsertTransactionDialogOpen.value = true;
}

// Função para lidar com exclusão de transação
async function handleDeleteTransaction(event: CustomEvent) {
  const { transaction } = event.detail;

  if (confirm(`Tem certeza que deseja excluir a transação "${transaction.name}"?`)) {
    try {
      if (!user.value?.uid) {
        console.error("Usuário não autenticado");
        return;
      }

      await deleteTransaction(user.value.uid, transaction.id);
      transactionStore.deleteTransaction(transaction.id);
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      alert("Erro ao excluir transação. Tente novamente.");
    }
  }
}

// Adicionar event listeners
onMounted(() => {
  window.addEventListener('edit-transaction', handleEditTransaction);
  window.addEventListener('delete-transaction', handleDeleteTransaction);

  fetchTransactions();
});

// Remover event listeners
onUnmounted(() => {
  window.removeEventListener('edit-transaction', handleEditTransaction);
  window.removeEventListener('delete-transaction', handleDeleteTransaction);
});

const formattedTransactions = computed<Transaction[]>(() => {
  if (!transactionStore.transactions) {
    return [];
  }
  return transactionStore.transactions.map((item) => ({
    id: item.id,
    date: item.date,
    name: item.name,
    type: item.type,
    category: TRANSACTION_CATEGORY_LABELS[item.category as TransactionCategory] || item.category,
    paymentMethod: item.paymentMethod,
    amount: item.type === 'EXPENSE' ? -Math.abs(item.amount) : Math.abs(item.amount),
  }));
});
</script>

<style scoped>
/* Estilos específicos para esta página podem ser adicionados aqui */
</style>
