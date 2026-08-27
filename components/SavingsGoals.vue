<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCurrentUser } from "vuefire";
import { Button } from "~/components/ui/button/index.js";
import { ScrollArea } from "~/components/ui/scroll-area/index.js";
import UpsertSavingsGoalDialog from "~/components/UpsertSavingsGoalDialog.vue";
import { useSavingsGoalsStore } from "~/stores/savingsGoals.js";
import { getSavingsGoals, deleteSavingsGoal } from "~/service/savingsGoalService.js";

const user = useCurrentUser();
const savingsGoalsStore = useSavingsGoalsStore();

const isDialogOpen = ref(false);
const editingGoalId = ref<string | undefined>(undefined);

async function fetchGoals() {
  if (!user.value?.uid) return;
  try {
    savingsGoalsStore.setLoading(true);
    const goals = await getSavingsGoals(user.value.uid);
    savingsGoalsStore.setGoals(goals);
  } catch (error) {
    console.error("Erro ao carregar metas de economia:", error);
  } finally {
    savingsGoalsStore.setLoading(false);
  }
}

onMounted(fetchGoals);

function openNewGoalDialog() {
  editingGoalId.value = undefined;
  isDialogOpen.value = true;
}

function openEditGoalDialog(goalId: string) {
  editingGoalId.value = goalId;
  isDialogOpen.value = true;
}

async function handleDeleteGoal(goalId: string, goalName: string) {
  if (!user.value?.uid) return;
  if (!confirm(`Tem certeza que deseja excluir a meta "${goalName}"?`)) return;

  try {
    await deleteSavingsGoal(user.value.uid, goalId);
    savingsGoalsStore.removeGoal(goalId);
  } catch (error) {
    console.error("Erro ao remover meta de economia:", error);
    alert("Erro ao remover meta de economia. Tente novamente.");
  }
}

const goals = computed(() => {
  return savingsGoalsStore.goals.map((goal) => {
    const percentage = goal.targetAmount > 0
      ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
      : 0;
    const isCompleted = goal.currentAmount >= goal.targetAmount;
    const daysRemaining = Math.ceil(
      (goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const isOverdue = !isCompleted && daysRemaining < 0;

    return {
      ...goal,
      percentage,
      isCompleted,
      daysRemaining,
      isOverdue,
    };
  });
});

const isLoading = computed(() => savingsGoalsStore.isLoading);

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pt-BR");
};
</script>

<template>
  <ScrollArea class="col-span-2 h-full rounded-md border p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Metas de Economia</h2>
      <Button size="sm" @click="openNewGoalDialog">Nova meta</Button>
    </div>

    <div
      v-if="isLoading"
      class="flex justify-center items-center h-40"
      role="status"
      aria-live="polite"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span class="sr-only">Carregando...</span>
    </div>

    <div
      v-else-if="goals.length === 0"
      class="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400"
      role="status"
    >
      <Icon name="lucide:piggy-bank" class="w-12 h-12 mb-2" aria-hidden="true" />
      <p>Nenhuma meta de economia criada</p>
    </div>

    <div v-else class="space-y-4" role="list">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="space-y-2"
        role="listitem"
        :aria-label="`${goal.name}: ${formatCurrency(goal.currentAmount)} de ${formatCurrency(
          goal.targetAmount
        )} (${goal.percentage}%), prazo em ${formatDate(goal.deadline)}${
          goal.isCompleted ? ', meta concluída' : ''
        }${goal.isOverdue ? ', prazo vencido' : ''}`"
      >
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium dark:text-white">{{ goal.name }}</span>
          <div class="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              :aria-label="`Editar meta ${goal.name}`"
              @click="openEditGoalDialog(goal.id)"
            >
              <Icon name="lucide:pencil" class="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              :aria-label="`Excluir meta ${goal.name}`"
              @click="handleDeleteGoal(goal.id, goal.name)"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div
          class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
          role="progressbar"
          :aria-valuenow="goal.percentage"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Progresso da meta ${goal.name}`"
        >
          <div
            class="h-2 rounded-full"
            :class="goal.isCompleted ? 'bg-green-500' : 'bg-primary'"
            :style="{ width: `${goal.percentage}%` }"
          />
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatCurrency(goal.currentAmount) }} de {{ formatCurrency(goal.targetAmount) }}
          ({{ goal.percentage }}%) — prazo em {{ formatDate(goal.deadline) }}
        </p>

        <p
          v-if="goal.isCompleted"
          class="text-xs text-green-600 dark:text-green-400 font-semibold"
        >
          Meta concluída! 🎉
        </p>
        <p
          v-else-if="goal.isOverdue"
          class="text-xs text-red-600 dark:text-red-400 font-semibold"
          role="alert"
        >
          Prazo vencido
        </p>
      </div>
    </div>

    <UpsertSavingsGoalDialog
      v-model:is-open="isDialogOpen"
      :goal-id="editingGoalId"
    />
  </ScrollArea>
</template>
