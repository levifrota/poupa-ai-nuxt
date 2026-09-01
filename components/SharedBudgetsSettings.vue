<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCurrentUser } from "vuefire";
import { Button } from "~/components/ui/button/index.js";
import { Input } from "~/components/ui/input/index.js";
import { MoneyInput } from "~/components/ui/money-input/index.js";
import UpsertSharedBudgetDialog from "~/components/UpsertSharedBudgetDialog.vue";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  type TransactionCategory,
} from "~/constants/transactions.js";
import { useSharedBudgetsStore } from "~/stores/sharedBudgets.js";
import {
  getSharedBudgetsForUser,
  getSharedBudgetCategoryBudgets,
  setSharedBudgetCategoryBudget,
  inviteMemberToSharedBudget,
  removeSharedBudgetMember,
  deleteSharedBudget,
  type SharedBudget,
} from "~/service/sharedBudgetService.js";

const user = useCurrentUser();
const sharedBudgetsStore = useSharedBudgetsStore();

const isLoading = ref(false);
const isCreateDialogOpen = ref(false);
const invitingBudgetId = ref<string | null>(null);
const inviteEmailByBudgetId = ref<Record<string, string>>({});
const inviteErrorByBudgetId = ref<Record<string, string>>({});
const savingCategoryKey = ref<string | null>(null);
const fetchError = ref<string | null>(null);

async function fetchSharedBudgets() {
  if (!user.value?.uid) return;
  try {
    isLoading.value = true;
    fetchError.value = null;
    const budgets = await getSharedBudgetsForUser(user.value.uid);
    sharedBudgetsStore.setSharedBudgets(budgets);

    await Promise.all(
      budgets.map(async (budget) => {
        const categoryBudgets = await getSharedBudgetCategoryBudgets(budget.id);
        sharedBudgetsStore.setCategoryBudgets(budget.id, categoryBudgets);
      })
    );
  } catch (error) {
    console.error("Erro ao carregar orçamentos compartilhados:", error);
    fetchError.value =
      error instanceof Error ? error.message : "Erro ao carregar orçamentos compartilhados.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchSharedBudgets);

function isOwner(budget: SharedBudget): boolean {
  return budget.ownerId === user.value?.uid;
}

async function handleCategoryBudgetChange(
  sharedBudgetId: string,
  category: TransactionCategory,
  monthlyLimit: number
) {
  const key = `${sharedBudgetId}:${category}`;
  try {
    savingCategoryKey.value = key;
    sharedBudgetsStore.setCategoryBudget(sharedBudgetId, category, monthlyLimit);
    await setSharedBudgetCategoryBudget(sharedBudgetId, category, monthlyLimit);
  } catch (error) {
    console.error("Erro ao salvar orçamento compartilhado:", error);
    alert("Erro ao salvar orçamento. Tente novamente.");
  } finally {
    savingCategoryKey.value = null;
  }
}

async function handleInvite(budget: SharedBudget) {
  const email = (inviteEmailByBudgetId.value[budget.id] ?? "").trim();
  inviteErrorByBudgetId.value = { ...inviteErrorByBudgetId.value, [budget.id]: "" };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    inviteErrorByBudgetId.value = {
      ...inviteErrorByBudgetId.value,
      [budget.id]: "Informe um e-mail válido.",
    };
    return;
  }

  if (!user.value?.uid || !user.value.email) return;

  try {
    invitingBudgetId.value = budget.id;
    await inviteMemberToSharedBudget(
      budget.id,
      budget.name,
      user.value.uid,
      user.value.email,
      email
    );
    inviteEmailByBudgetId.value = { ...inviteEmailByBudgetId.value, [budget.id]: "" };
  } catch (error) {
    console.error("Erro ao convidar membro:", error);
    inviteErrorByBudgetId.value = {
      ...inviteErrorByBudgetId.value,
      [budget.id]: "Erro ao enviar convite. Tente novamente.",
    };
  } finally {
    invitingBudgetId.value = null;
  }
}

async function handleRemoveMember(budget: SharedBudget, memberEmail: string, memberIndex: number) {
  const memberUid = budget.memberUids[memberIndex];
  if (!memberUid) return;
  if (!confirm(`Remover ${memberEmail} deste orçamento compartilhado?`)) return;

  try {
    await removeSharedBudgetMember(budget.id, memberUid, memberEmail);
    sharedBudgetsStore.updateSharedBudget({
      ...budget,
      memberUids: budget.memberUids.filter((uid) => uid !== memberUid),
      memberEmails: budget.memberEmails.filter((email) => email !== memberEmail),
    });
  } catch (error) {
    console.error("Erro ao remover membro:", error);
    alert("Erro ao remover membro. Tente novamente.");
  }
}

async function handleLeave(budget: SharedBudget) {
  if (!user.value?.uid || !user.value.email) return;
  if (!confirm(`Sair do orçamento compartilhado "${budget.name}"?`)) return;

  try {
    await removeSharedBudgetMember(budget.id, user.value.uid, user.value.email);
    sharedBudgetsStore.removeSharedBudget(budget.id);
  } catch (error) {
    console.error("Erro ao sair do orçamento compartilhado:", error);
    alert("Erro ao sair do orçamento compartilhado. Tente novamente.");
  }
}

async function handleDelete(budget: SharedBudget) {
  if (!confirm(`Excluir o orçamento compartilhado "${budget.name}"? Esta ação não pode ser desfeita.`)) return;

  try {
    await deleteSharedBudget(budget.id);
    sharedBudgetsStore.removeSharedBudget(budget.id);
  } catch (error) {
    console.error("Erro ao excluir orçamento compartilhado:", error);
    alert("Erro ao excluir orçamento compartilhado. Tente novamente.");
  }
}

const sharedBudgets = computed(() => sharedBudgetsStore.sharedBudgets);
</script>

<template>
  <div
    class="bg-card rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6"
    role="region"
    aria-label="Orçamentos compartilhados"
  >
    <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
      <h2 class="text-xl font-semibold">Orçamentos Compartilhados</h2>
      <Button size="sm" @click="isCreateDialogOpen = true">Novo Orçamento</Button>
    </div>
    <p class="text-sm text-muted-foreground mb-4">
      Convide outras pessoas por e-mail para acompanhar limites de gastos em conjunto.
    </p>

    <div v-if="fetchError" role="alert" class="text-red-500 mb-2">{{ fetchError }}</div>

    <div
      v-if="isLoading"
      class="flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
      <span>Carregando orçamentos compartilhados...</span>
    </div>

    <div
      v-else-if="sharedBudgets.length === 0"
      class="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400"
      role="status"
    >
      <Icon name="lucide:users" class="w-10 h-10 mb-2" aria-hidden="true" />
      <p>Nenhum orçamento compartilhado ainda</p>
    </div>

    <div v-else class="space-y-6" role="list" aria-label="Lista de orçamentos compartilhados">
      <div
        v-for="budget in sharedBudgets"
        :key="budget.id"
        role="listitem"
        class="rounded-md border p-4 space-y-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <p class="font-semibold">{{ budget.name }}</p>
            <span
              v-if="isOwner(budget)"
              class="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground"
            >
              Dono
            </span>
          </div>
          <Button
            v-if="isOwner(budget)"
            size="sm"
            variant="outline"
            :aria-label="`Excluir orçamento compartilhado ${budget.name}`"
            @click="handleDelete(budget)"
          >
            <Icon name="lucide:trash-2" class="w-4 h-4" />
          </Button>
          <Button
            v-else
            size="sm"
            variant="outline"
            :aria-label="`Sair do orçamento compartilhado ${budget.name}`"
            @click="handleLeave(budget)"
          >
            Sair
          </Button>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2">Membros</h3>
          <ul class="space-y-1" aria-label="Membros do orçamento compartilhado">
            <li
              v-for="(email, index) in budget.memberEmails"
              :key="email"
              class="flex items-center justify-between text-sm"
            >
              <span>
                {{ email }}
                <span v-if="email === budget.ownerEmail" class="text-muted-foreground">
                  (dono)
                </span>
              </span>
              <Button
                v-if="isOwner(budget) && email !== budget.ownerEmail"
                size="sm"
                variant="outline"
                :aria-label="`Remover ${email}`"
                @click="handleRemoveMember(budget, email, index)"
              >
                <Icon name="lucide:x" class="w-3.5 h-3.5" />
              </Button>
            </li>
          </ul>
        </div>

        <div v-if="isOwner(budget)">
          <h3 class="text-sm font-medium mb-2">Convidar por e-mail</h3>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              v-model="inviteEmailByBudgetId[budget.id]"
              type="email"
              placeholder="email@exemplo.com"
              class="w-full sm:w-60"
              :aria-label="`E-mail para convidar para ${budget.name}`"
              @keyup.enter="handleInvite(budget)"
            />
            <Button
              size="sm"
              :disabled="invitingBudgetId === budget.id"
              @click="handleInvite(budget)"
            >
              {{ invitingBudgetId === budget.id ? "Enviando..." : "Convidar" }}
            </Button>
          </div>
          <p
            v-if="inviteErrorByBudgetId[budget.id]"
            role="alert"
            class="text-sm text-red-500 mt-1"
          >
            {{ inviteErrorByBudgetId[budget.id] }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2">Limites por Categoria</h3>
          <div class="space-y-3">
            <div
              v-for="option in TRANSACTION_CATEGORY_OPTIONS"
              :key="option.value"
              class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <label :for="`shared-budget-${budget.id}-${option.value}`" class="text-sm">
                {{ option.label }}
              </label>
              <div class="flex items-center gap-2">
                <MoneyInput
                  :id="`shared-budget-${budget.id}-${option.value}`"
                  class="w-40"
                  :model-value="
                    sharedBudgetsStore.getCategoryBudgetsFor(budget.id)[option.value] ?? 0
                  "
                  :aria-label="`Limite mensal para ${option.label} em ${budget.name}`"
                  @update:model-value="
                    (value) => handleCategoryBudgetChange(budget.id, option.value, value)
                  "
                />
                <span
                  v-if="savingCategoryKey === `${budget.id}:${option.value}`"
                  class="text-xs text-muted-foreground"
                >
                  Salvando...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UpsertSharedBudgetDialog v-model:is-open="isCreateDialogOpen" />
  </div>
</template>
