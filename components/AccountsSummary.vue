<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCurrentUser } from "vuefire";
import { Button } from "~/components/ui/button/index.js";
import { ScrollArea } from "~/components/ui/scroll-area/index.js";
import UpsertAccountDialog from "~/components/UpsertAccountDialog.vue";
import { useAccountsStore } from "~/stores/accounts.js";
import { useTransactionsStore } from "~/stores/transactions.js";
import { getAccounts, deleteAccount } from "~/service/accountService.js";
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_ICONS } from "~/constants/accounts.js";
import { calculateAccountBalances } from "~/lib/accountBalance.js";

const user = useCurrentUser();
const accountsStore = useAccountsStore();
const transactionsStore = useTransactionsStore();

const isDialogOpen = ref(false);
const editingAccountId = ref<string | undefined>(undefined);

async function fetchAccounts() {
  if (!user.value?.uid) return;
  try {
    accountsStore.setLoading(true);
    const accounts = await getAccounts(user.value.uid);
    accountsStore.setAccounts(accounts);
  } catch (error) {
    console.error("Erro ao carregar contas:", error);
  } finally {
    accountsStore.setLoading(false);
  }
}

onMounted(fetchAccounts);

function openNewAccountDialog() {
  editingAccountId.value = undefined;
  isDialogOpen.value = true;
}

function openEditAccountDialog(accountId: string) {
  editingAccountId.value = accountId;
  isDialogOpen.value = true;
}

async function handleDeleteAccount(accountId: string, accountName: string) {
  if (!user.value?.uid) return;
  if (!confirm(`Tem certeza que deseja excluir a conta "${accountName}"?`)) return;

  try {
    await deleteAccount(user.value.uid, accountId);
    accountsStore.removeAccount(accountId);
  } catch (error) {
    console.error("Erro ao remover conta:", error);
    alert("Erro ao remover conta. Tente novamente.");
  }
}

const accountBalances = computed(() =>
  calculateAccountBalances(transactionsStore.transactions, accountsStore.accounts)
);

const isLoading = computed(() => accountsStore.isLoading);

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
</script>

<template>
  <ScrollArea class="col-span-2 h-full rounded-md border p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Contas</h2>
      <Button size="sm" @click="openNewAccountDialog">Nova conta</Button>
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
      v-else-if="accountBalances.length === 0"
      class="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400"
      role="status"
    >
      <Icon name="lucide:wallet" class="w-12 h-12 mb-2" aria-hidden="true" />
      <p>Nenhuma conta cadastrada</p>
    </div>

    <div v-else class="space-y-4" role="list" aria-label="Saldo por conta">
      <div
        v-for="account in accountBalances"
        :key="account.accountId"
        role="listitem"
        class="flex items-center justify-between gap-2 rounded-md border p-3"
        :aria-label="`${account.name}, ${ACCOUNT_TYPE_LABELS[account.type]}, saldo ${formatCurrency(account.balance)}`"
      >
        <div class="flex items-center gap-3">
          <Icon
            :name="ACCOUNT_TYPE_ICONS[account.type]"
            class="w-6 h-6"
            aria-hidden="true"
          />
          <div>
            <p class="font-medium">{{ account.name }}</p>
            <p class="text-sm text-muted-foreground">
              {{ ACCOUNT_TYPE_LABELS[account.type] }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold">{{ formatCurrency(account.balance) }}</span>
          <Button
            size="sm"
            variant="outline"
            :aria-label="`Editar ${account.name}`"
            @click="openEditAccountDialog(account.accountId)"
          >
            <Icon name="lucide:pencil" class="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            :aria-label="`Excluir ${account.name}`"
            @click="handleDeleteAccount(account.accountId, account.name)"
          >
            <Icon name="lucide:trash-2" class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    <UpsertAccountDialog v-model:is-open="isDialogOpen" :account-id="editingAccountId" />
  </ScrollArea>
</template>
