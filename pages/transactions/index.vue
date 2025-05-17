<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-4 text-2xl font-bold">Transações</h1>
    <DataTable :columns="columns" :data="formattedTransactions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DataTable from '@/components/transactions/DataTable.vue';
import { columns, type Transaction } from '@/components/transactions/columns';
import mockupData from '~/mockupData.json';
import { TRANSACTION_CATEGORY_LABELS, type TransactionCategory } from '@/constants/transactions';

// Interface para os dados brutos do mockupData.json
interface MockupTransaction {
  id: string;
  name: string; // Mapeado para description
  type: 'DEPOSIT' | 'EXPENSE' | 'INVESTMENT';
  amount: number;
  category: string;
  paymentMethod: string;
  date: Date; // ISO string date
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

const formattedTransactions = computed<Transaction[]>(() => {
  if (!mockupData || !mockupData.totalTransactions) {
    return [];
  }
  return (mockupData.totalTransactions as MockupTransaction[]).map((item: MockupTransaction) => ({
    id: item.id,
    date: item.date, // Passar a string ISO da data diretamente para columns.ts formatar
    description: item.name,
    category: TRANSACTION_CATEGORY_LABELS[item.category as TransactionCategory] || item.category,
    // Ajusta o valor para negativo se for uma despesa, conforme a lógica anterior e a esperada por columns.ts
    amount: item.type === 'EXPENSE' ? -Math.abs(item.amount) : Math.abs(item.amount),
  }));
});
</script>

<style scoped>
/* Estilos específicos para esta página podem ser adicionados aqui */
</style>
