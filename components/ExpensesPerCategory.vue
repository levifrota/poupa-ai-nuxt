<template>
  <ScrollArea class="col-span-2 h-full rounded-md border p-6" :aria-labelledby="titleId">
    <CardHeader>
      <CardTitle :id="titleId">{{ t('expenses_per_category_title') }}</CardTitle>
    </CardHeader>

    <div v-if="isLoading" role="status" class="flex justify-center items-center h-40">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-hidden="true" />
      <span class="sr-only">{{ t('loading_expenses') }}</span>
    </div>

    <div
      v-else-if="expenses.length === 0"
      class="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400"
    >
      <Icon name="lucide:bar-chart-3" class="w-12 h-12 mb-2" aria-hidden="true" />
      <p>{{ t('no_expenses_recorded') }}</p>
    </div>

    <div v-else class="space-y-4" role="list">
      <div v-for="expense in expenses" :key="expense.category" class="space-y-2" role="listitem">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: expense.color }"
              aria-hidden="true"
            />
            <span class="text-sm font-medium dark:text-white">{{
              expense.translatedCategory
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium dark:text-white">{{
              formatCurrency(expense.amount)
            }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >{{ expense.percentage.toFixed(0) }}%</span
            >
          </div>
        </div>

        <div
          class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
          role="progressbar"
          :aria-valuenow="expense.percentage"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="t('expense_percentage_for_category_aria_label', { category: expense.translatedCategory, percentage: expense.percentage.toFixed(0) })"
        >
          <div
            class="h-2 rounded-full"
            :style="{ width: `${expense.percentage}%`, backgroundColor: expense.color }"
          />
        </div>
      </div>
    </div>
  </ScrollArea>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import mockupData from "@/mockupData.json";
import { storeToRefs } from "pinia";
import { useI18n } from '#imports';

const { t, locale } = useI18n();
const titleId = `expenses-title-${Math.random().toString(36).substring(2, 9)}`;

interface Expense {
  categoryKey: string; // Original key e.g., HOUSING
  translatedCategory: string; // Translated name
  amount: number;
  percentage: number;
  color: string;
}

const isLoading = ref(true);
const expenses = ref<Expense[]>([]);
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

// Keys for translation mapping (matches keys in mockupData and colorPalettes)
const categoryKeys = [
  "HOUSING", "TRANSPORTATION", "FOOD", "HEALTH",
  "UTILITY", "ENTERTAINMENT", "OTHER", "EDUCATION"
];

const colorPalettes = {
  light: { HOUSING: "#FF6384", TRANSPORTATION: "#36A2EB", FOOD: "#FFCE56", HEALTH: "#4BC0C0", UTILITY: "#9966FF", ENTERTAINMENT: "#FF9F40", OTHER: "#C9CBCF", EDUCATION: "#8A2BE2" },
  dark: { HOUSING: "#FF8FA3", TRANSPORTATION: "#64B5F6", FOOD: "#FFE082", HEALTH: "#80CBC4", UTILITY: "#B39DDB", ENTERTAINMENT: "#FFAB91", OTHER: "#E0E0E0", EDUCATION: "#B39DDB" },
  deuteranopia: { HOUSING: "#0072B2", TRANSPORTATION: "#56B4E9", FOOD: "#F0E442", HEALTH: "#009E73", UTILITY: "#CC79A7", ENTERTAINMENT: "#D55E00", OTHER: "#E0E0E0", EDUCATION: "#0072B2" },
  protanopia: { HOUSING: "#0072B2", TRANSPORTATION: "#56B4E9", FOOD: "#F0E442", HEALTH: "#009E73", UTILITY: "#CC79A7", ENTERTAINMENT: "#D55E00", OTHER: "#E0E0E0", EDUCATION: "#0072B2" },
  tritanopia: { HOUSING: "#E69F00", TRANSPORTATION: "#56B4E9", FOOD: "#F0E442", HEALTH: "#009E73", UTILITY: "#CC79A7", ENTERTAINMENT: "#D55E00", OTHER: "#E0E0E0", EDUCATION: "#E69F00" },
};

const currentColorPalette = computed(() => {
  const currentTheme = theme.value as keyof typeof colorPalettes;
  return colorPalettes[currentTheme] || colorPalettes.light;
});

const formatCurrency = (value: number): string => {
  let currencyCode = t('currency_code'); // Get from locale
  return new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
};

const loadExpensesData = () => {
  const expensesData = mockupData.totalExpensePerCategory;
  const palette = currentColorPalette.value;

  const formattedExpenses: Expense[] = expensesData.map((item) => ({
    categoryKey: item.category,
    translatedCategory: t(`category_${item.category.toUpperCase()}`, item.category), // Translate here
    amount: item.totalAmount,
    percentage: item.percentageOfTotal,
    color: palette[item.category as keyof typeof palette] || "#C9CBCF",
  }));

  expenses.value = formattedExpenses;
  isLoading.value = false;
};

const updateColorsAndTranslations = () => {
  if (expenses.value.length > 0) {
    const palette = currentColorPalette.value;
    expenses.value = expenses.value.map((expense) => ({
      ...expense,
      translatedCategory: t(`category_${expense.categoryKey.toUpperCase()}`, expense.categoryKey),
      color: palette[expense.categoryKey as keyof typeof palette] || "#C9CBCF",
    }));
  }
};

watch(theme, updateColorsAndTranslations);
watch(locale, updateColorsAndTranslations); // Also update translations if locale changes

onMounted(() => {
  loadExpensesData();
});
</script>
