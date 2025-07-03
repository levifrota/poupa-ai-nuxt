<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-4 text-2xl font-bold">{{ t('transactions_page_title') }}</h1>
    <DataTable :columns="columns" :data="formattedTransactions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DataTable from '@/components/transactions/DataTable.vue';
import { columns, type Transaction } from '@/components/transactions/columns';
import mockupData from '~/mockupData.json';
// import { TRANSACTION_CATEGORY_LABELS, type TransactionCategory } from '@/constants/transactions'; // No longer needed if using t()
import { useI18n } from '#imports';

const { t } = useI18n();

// Interface for the raw data from mockupData.json
interface MockupTransaction {
  id: string;
  name: string; // Mapped to description
  type: 'DEPOSIT' | 'EXPENSE' | 'INVESTMENT';
  amount: number;
  category: string; // This is the key, e.g., "HOUSING", "FOOD"
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
    date: item.date,
    description: item.name,
    // Use t() for category translation, falling back to item.category if key not found
    category: t(`category_${item.category.toUpperCase()}`, item.category),
    amount: item.type === 'EXPENSE' ? -Math.abs(item.amount) : Math.abs(item.amount),
  }));
});
</script>

<style scoped>
/* Estilos específicos para esta página podem ser adicionados aqui */
</style>
