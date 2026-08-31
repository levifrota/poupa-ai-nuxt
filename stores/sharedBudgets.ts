import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  SharedBudget,
  SharedBudgetInvite,
} from "@/service/sharedBudgetService.js";

export const useSharedBudgetsStore = defineStore("sharedBudgets", () => {
  const sharedBudgets = ref<SharedBudget[]>([]);
  const pendingInvites = ref<SharedBudgetInvite[]>([]);
  const categoryBudgetsByBudgetId = ref<Record<string, Record<string, number>>>({});
  const isLoading = ref(false);

  function setSharedBudgets(list: SharedBudget[]) {
    sharedBudgets.value = list;
  }

  function addSharedBudget(budget: SharedBudget) {
    sharedBudgets.value = [...sharedBudgets.value, budget];
  }

  function removeSharedBudget(sharedBudgetId: string) {
    sharedBudgets.value = sharedBudgets.value.filter((b) => b.id !== sharedBudgetId);
    const updated = { ...categoryBudgetsByBudgetId.value };
    Reflect.deleteProperty(updated, sharedBudgetId);
    categoryBudgetsByBudgetId.value = updated;
  }

  function updateSharedBudget(budget: SharedBudget) {
    const index = sharedBudgets.value.findIndex((b) => b.id === budget.id);
    if (index === -1) return;
    sharedBudgets.value = [
      ...sharedBudgets.value.slice(0, index),
      budget,
      ...sharedBudgets.value.slice(index + 1),
    ];
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  function setPendingInvites(list: SharedBudgetInvite[]) {
    pendingInvites.value = list;
  }

  function removeInvite(inviteId: string) {
    pendingInvites.value = pendingInvites.value.filter((i) => i.id !== inviteId);
  }

  function setCategoryBudgets(sharedBudgetId: string, list: { category: string; monthlyLimit: number }[]) {
    categoryBudgetsByBudgetId.value = {
      ...categoryBudgetsByBudgetId.value,
      [sharedBudgetId]: Object.fromEntries(
        list.map((budget) => [budget.category, budget.monthlyLimit])
      ),
    };
  }

  function setCategoryBudget(sharedBudgetId: string, category: string, monthlyLimit: number) {
    categoryBudgetsByBudgetId.value = {
      ...categoryBudgetsByBudgetId.value,
      [sharedBudgetId]: {
        ...categoryBudgetsByBudgetId.value[sharedBudgetId],
        [category]: monthlyLimit,
      },
    };
  }

  function getCategoryBudgetsFor(sharedBudgetId: string): Record<string, number> {
    return categoryBudgetsByBudgetId.value[sharedBudgetId] ?? {};
  }

  return {
    sharedBudgets,
    pendingInvites,
    categoryBudgetsByBudgetId,
    isLoading,
    setSharedBudgets,
    addSharedBudget,
    removeSharedBudget,
    updateSharedBudget,
    setLoading,
    setPendingInvites,
    removeInvite,
    setCategoryBudgets,
    setCategoryBudget,
    getCategoryBudgetsFor,
  };
});
