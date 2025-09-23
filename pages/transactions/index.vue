<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between">
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
    <DataTable :columns="columns" :data="formattedTransactions" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import DataTable from '@/components/transactions/DataTable.vue';
import UpsertTransactionDialog from '~/components/UpsertTransactionDialog.vue';
import { Button } from '~/components/ui/button';
import { DialogTrigger } from '~/components/ui/dialog';
import { columns, type Transaction } from '@/components/transactions/columns';
import { useTransactionsStore } from '~/stores/transactions';
import { TRANSACTION_CATEGORY_LABELS, type TransactionCategory } from '@/constants/transactions';
import { deleteTransaction } from '~/service/transactionService';
import { useCurrentUser } from 'vuefire';

const isUpsertTransactionDialogOpen = ref(false);
const selectedTransaction = ref<Transaction | null>(null);

definePageMeta({
  middleware: 'auth'
})

const transactionStore = useTransactionsStore();
const user = useCurrentUser();

function handleSubmit(data) {
  if (data.id) {
    transactionStore.updateTransaction(data);
  } else {
    transactionStore.addTransaction(data);
  }
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
      console.log("Transação excluída com sucesso!");
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
  console.log('Transactions:', transactionStore.transactions);
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
