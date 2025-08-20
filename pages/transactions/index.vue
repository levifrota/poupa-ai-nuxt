<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between">
      <h1 class="mb-4 text-2xl font-bold">Transações</h1>
      <UpsertTransactionDialog :is-open="isUpsertTransactionDialogOpen" @update:is-open="isUpsertTransactionDialogOpen = $event" @submit="handleSubmit">
        <DialogTrigger as-child>
          <Button>Adicionar transação</Button>
        </DialogTrigger>
      </UpsertTransactionDialog>
    </div>
    <DataTable :columns="columns" :data="formattedTransactions" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DataTable from '@/components/transactions/DataTable.vue';
import UpsertTransactionDialog from '~/components/UpsertTransactionDialog.vue';
import { Button } from '~/components/ui/button';
import { DialogTrigger } from '~/components/ui/dialog';
import { columns, type Transaction } from '@/components/transactions/columns';

const isUpsertTransactionDialogOpen = ref(false);
import { useTransactionsStore } from '~/stores/transactions';
import { TRANSACTION_CATEGORY_LABELS, type TransactionCategory } from '@/constants/transactions';
definePageMeta({
  middleware: 'auth'
})

const transactionStore = useTransactionsStore();

function handleSubmit(data) {
  if (data.id) {
    transactionStore.updateTransaction(data);
  } else {
    transactionStore.addTransaction(data);
  }
}

const formattedTransactions = computed<Transaction[]>(() => {
  if (!transactionStore.transactions) {
    return [];
  }
  return transactionStore.transactions.map((item) => ({
    id: item.id,
    date: item.date,
    description: item.description,
    category: TRANSACTION_CATEGORY_LABELS[item.category as TransactionCategory] || item.category,
    amount: item.type === 'EXPENSE' ? -Math.abs(item.amount) : Math.abs(item.amount),
  }));
});
</script>

<style scoped>
/* Estilos específicos para esta página podem ser adicionados aqui */
</style>
