<script setup lang="ts">
import mockup from '@/mockupData.json'

interface Tx {
  id: string
  name: string
  date: string
  amount: number
}
const transactions = mockup.lastTransactions as Tx[]
</script>

<template>
  <div class="overflow-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th class="px-3 py-2 text-left text-xs font-medium uppercase">Name</th>
          <th class="px-3 py-2 text-left text-xs font-medium uppercase">Date</th>
          <th class="px-3 py-2 text-right text-xs font-medium uppercase">Amount</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="tx in transactions" :key="tx.id">
          <td class="px-3 py-2 text-left text-sm">{{ tx.name }}</td>
          <td class="px-3 py-2 text-left text-sm">{{ tx.date }}</td>
          <td class="px-3 py-2 text-right text-sm">{{ tx.amount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>