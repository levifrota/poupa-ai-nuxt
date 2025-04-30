<script setup lang="ts">
import mockup from '@/mockupData.json'
import SummaryCard from '~/app/_components/SummaryCard.vue'

const summaryList = [
  { title: 'Deposits', value: mockup.depositsTotal, icon: 'lucide:plus-circle' },
  { title: 'Investments', value: mockup.investmentsTotal, icon: 'lucide:trending-up' },
  { title: 'Expenses', value: mockup.expensesTotal, icon: 'lucide:credit-card' },
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <SummaryCard
      v-for="item in summaryList"
      :key="item.title"
      :title="item.title"
      :value="item.value"
      :icon="item.icon"
    />
  </div>
</template>