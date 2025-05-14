<script setup>
import SummaryCard from "~/app/_components/SummaryCard.vue";
import { useTransactionsStore } from "@/stores/transactions";
import { computed } from "vue";

// Usar a store de transações para obter os valores calculados
const transactionsStore = useTransactionsStore();

// Formatar valores monetários
const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Objeto para o card de saldo
const balanceObj = computed(() => ({
  title: "Saldo",
  value: formatCurrency(transactionsStore.balance),
  icon: "lucide:wallet",
}));

// Lista de cards de resumo
const summaryList = computed(() => [
  {
    title: "Receita",
    value: formatCurrency(transactionsStore.depositsTotal),
    icon: "lucide:piggy-bank",
  },
  {
    title: "Investido",
    value: formatCurrency(transactionsStore.investmentsTotal),
    icon: "lucide:trending-up",
  },
  {
    title: "Despesas",
    value: formatCurrency(transactionsStore.expensesTotal),
    icon: "lucide:trending-down",
  },
]);
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
