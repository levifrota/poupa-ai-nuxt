<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-4 text-2xl font-bold">Transações</h1>
    <DataTable :columns="columns" :data="formattedTransactions" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
import { computed } from 'vue';
import DataTable from '@/components/transactions/DataTable.vue';
import { columns, type Transaction } from '@/components/transactions/columns';
import { useTransactionsStore } from '~/stores/transactions';
import { TRANSACTION_CATEGORY_LABELS, type TransactionCategory } from '@/constants/transactions';

const transactionStore = useTransactionsStore();

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
