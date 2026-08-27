import { defineStore } from "pinia";
import { ref } from "vue";
import type { CategoryBudget } from "@/service/budgetService.js";

export const useBudgetsStore = defineStore("budgets", () => {
  // Mapa de categoria -> limite mensal
  const budgets = ref<Record<string, number>>({});

  function setBudgets(list: CategoryBudget[]) {
    budgets.value = Object.fromEntries(
      list.map((budget) => [budget.category, budget.monthlyLimit])
    );
  }

  function setBudget(category: string, monthlyLimit: number) {
    budgets.value = { ...budgets.value, [category]: monthlyLimit };
  }

  function removeBudget(category: string) {
    const updated = { ...budgets.value };
    delete updated[category];
    budgets.value = updated;
  }

  function getBudgetFor(category: string): number | undefined {
    return budgets.value[category];
  }

  return {
    budgets,
    setBudgets,
    setBudget,
    removeBudget,
    getBudgetFor,
  };
});
