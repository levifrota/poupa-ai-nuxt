<script setup>
import SummaryCard from "~/components/SummaryCard.vue";
import { useTransactionsStore } from "@/stores/transactions";
import { computed } from "vue";
import { useI18n } from '#imports'; // Added

const { t, locale } = useI18n(); // Added

const transactionsStore = useTransactionsStore();

// Formatar valores monetários
const formatCurrency = (value) => {
  // Determine currency code based on locale, or use a default if not specified.
  // This is a simplified approach. Real multi-currency would be more complex.
  let currencyCode = 'BRL'; // Default
  if (locale.value.startsWith('en')) {
    currencyCode = 'USD';
  }
  // Add more currency codes as needed for other locales

  return new Intl.NumberFormat(locale.value, { // Use reactive locale
    style: "currency",
    currency: currencyCode, // Use dynamic currency code
  }).format(value);
};

const balanceObj = computed(() => ({
  title: t('balance_title'), // Internationalized
  value: formatCurrency(transactionsStore.balance),
  icon: "lucide:wallet",
}));

const summaryList = computed(() => [
  {
    title: t('revenue_title'), // Internationalized
    value: formatCurrency(transactionsStore.depositsTotal),
    icon: "lucide:piggy-bank",
  },
  {
    title: t('invested_title'), // Internationalized
    value: formatCurrency(transactionsStore.investmentsTotal),
    icon: "lucide:trending-up",
  },
  {
    title: t('expenses_title'), // Internationalized
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
      role="region"
      :aria-label="balanceObj.title"
    />
  </div>

  <div class="grid max-w-[100%] grid-cols-[50%_50%] gap-3 sm:grid-cols-3 sm:gap-6">
    <SummaryCard
      v-for="item in summaryList"
      :key="item.title"
      :title="item.title"
      :value="item.value"
      :icon="item.icon"
      role="region"
      :aria-label="item.title"
    />
  </div>
</template>
