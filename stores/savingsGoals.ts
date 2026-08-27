import { defineStore } from "pinia";
import { ref } from "vue";
import type { SavingsGoal } from "@/service/savingsGoalService.js";

export const useSavingsGoalsStore = defineStore("savingsGoals", () => {
  const goals = ref<SavingsGoal[]>([]);
  const isLoading = ref(false);

  function setGoals(list: SavingsGoal[]) {
    goals.value = list;
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  function addGoal(goal: SavingsGoal) {
    goals.value = [...goals.value, goal];
  }

  function updateGoal(goal: SavingsGoal) {
    const index = goals.value.findIndex((g) => g.id === goal.id);
    if (index === -1) return;
    goals.value = [
      ...goals.value.slice(0, index),
      goal,
      ...goals.value.slice(index + 1),
    ];
  }

  function removeGoal(goalId: string) {
    goals.value = goals.value.filter((g) => g.id !== goalId);
  }

  return {
    goals,
    isLoading,
    setGoals,
    setLoading,
    addGoal,
    updateGoal,
    removeGoal,
  };
});
