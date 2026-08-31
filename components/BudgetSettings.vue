<template>
  <div class="bg-card rounded-lg p-6 shadow-sm mb-6">
    <h2 class="text-xl font-semibold mb-2">Orçamentos por Categoria</h2>
    <p class="text-sm text-muted-foreground mb-4">
      Defina um limite mensal para cada categoria de despesa. Você será alertado quando
      estiver perto de ultrapassar o limite.
    </p>

    <div v-if="isLoading" class="flex items-center gap-2" role="status" aria-live="polite">
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
      <span>Carregando orçamentos...</span>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="option in TRANSACTION_CATEGORY_OPTIONS"
        :key="option.value"
        class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <label :for="`budget-${option.value}`" class="text-sm font-medium">
          {{ option.label }}
        </label>
        <div class="flex items-center gap-2">
          <MoneyInput
            :id="`budget-${option.value}`"
            class="w-40"
            :model-value="budgetsStore.getBudgetFor(option.value) ?? 0"
            :aria-label="`Limite mensal para ${option.label}`"
            @update:model-value="(value) => handleBudgetChange(option.value, value)"
          />
          <span v-if="savingCategory === option.value" class="text-xs text-muted-foreground">
            Salvando...
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCurrentUser } from "vuefire";
import { MoneyInput } from "~/components/ui/money-input/index.js";
import { TRANSACTION_CATEGORY_OPTIONS, type TransactionCategory } from "~/constants/transactions.js";
import { getBudgets, setBudget } from "~/service/budgetService.js";
import { useBudgetsStore } from "~/stores/budgets.js";

const user = useCurrentUser();
const budgetsStore = useBudgetsStore();
const isLoading = ref(false);
const savingCategory = ref<string | null>(null);

async function fetchBudgets() {
  if (!user.value?.uid) return;

  try {
    isLoading.value = true;
    const budgets = await getBudgets(user.value.uid);
    budgetsStore.setBudgets(budgets);
  } catch (error) {
    console.error("Erro ao carregar orçamentos:", error);
  } finally {
    isLoading.value = false;
  }
}

async function handleBudgetChange(category: TransactionCategory, monthlyLimit: number) {
  if (!user.value?.uid) return;

  try {
    savingCategory.value = category;
    budgetsStore.setBudget(category, monthlyLimit);
    await setBudget(user.value.uid, category, monthlyLimit);
  } catch (error) {
    console.error("Erro ao salvar orçamento:", error);
    alert("Erro ao salvar orçamento. Tente novamente.");
  } finally {
    savingCategory.value = null;
  }
}

onMounted(fetchBudgets);
</script>
