<script setup lang="ts">
import { ref } from 'vue'
import { columns } from '~/components/transactions/columns'
import UpsertTransactionDialog from '~/components/transactions/UpsertTransactionDialog.vue'
import type { Transaction } from '~/types'

const { transactions, getTransactions, deleteTransaction } = useTransactionsStore()

await getTransactions()

const isDialogOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

function onDelete(id: string) {
  deleteTransaction(id)
}

function onEdit(transaction: Transaction) {
  selectedTransaction.value = transaction
  isDialogOpen.value = true
}

function onAdd() {
  selectedTransaction.value = null
  isDialogOpen.value = true
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">
        Transações
      </h1>
      <UButton @click="onAdd">
        Adicionar transação
      </UButton>
    </div>
    <TransactionsDataTable :columns="columns" :data="transactions" @delete="onDelete" @edit="onEdit" />
    <UpsertTransactionDialog v-model="isDialogOpen" :transaction="selectedTransaction" />
  </div>
</template>
