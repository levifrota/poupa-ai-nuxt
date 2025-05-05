<script setup lang="ts">
import mockup from "@/mockupData.json";
import SummaryCard from "~/app/_components/SummaryCard.vue";

const balanceObj = {
  title: "Saldo",
  value: mockup.balance,
  icon: "lucide:wallet",
};

const summaryList = [
  { title: "Receita", value: mockup.depositsTotal, icon: "lucide:piggy-bank" },
  { title: "Investido", value: mockup.investmentsTotal, icon: "lucide:trending-up" },
  { title: "Despesas", value: mockup.expensesTotal, icon: "lucide:trending-down" },
];
</script>

<template>
  <div class="w-100% flex flex-col items-center space-y-6 sm:block">
    <SummaryCard
      :title="balanceObj.title"
      :value="balanceObj.value"
      :icon="balanceObj.icon"
    />
  </div>

  <div class="grid max-w-[100%] grid-cols-[50%_50%] gap-3 sm:grid-cols-3 sm:gap-6">
    <SummaryCard
      v-for="item in summaryList"
      :key="item.title"
      :title="item.title"
      :value="item.value"
      :icon="item.icon"
    />
  </div>
</template>
