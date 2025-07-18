<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-4 text-2xl font-bold">Transações</h1>
    <DataTable :columns="columns" :data="formattedTransactions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import DataTable from '@/components/transactions/DataTable.vue';
import { columns } from '@/components/transactions/columns';
import { getAllTransactions } from '@/service/transactions';
import { TRANSACTION_CATEGORY_LABELS, type TransactionCategory, type Transaction } from '@/constants/transactions';

const transactions = ref<Transaction[]>([]);

onMounted(async () => {
  transactions.value = await getAllTransactions();
});

const formattedTransactions = computed(() => {
  if (!transactions.value) {
    return [];
  }
  return transactions.value.map((item) => ({
    id: item.id,
    date: item.date,
    description: item.name,
    category: TRANSACTION_CATEGORY_LABELS[item.category as TransactionCategory] || item.category,
    amount: item.type === 'EXPENSE' ? -Math.abs(item.amount) : Math.abs(item.amount),
  }));
});
</script>

<style scoped>
/* Estilos específicos para esta página podem ser adicionados aqui */
</style>
