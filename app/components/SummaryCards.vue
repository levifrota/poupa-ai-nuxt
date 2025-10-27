<script setup>
import SummaryCard from "@/components/SummaryCard.vue";
import { useTransactionsStore } from "../../stores/transactions";
import { ref, computed } from "vue";
import UpsertTransactionDialog from "@/components/UpsertTransactionDialog.vue";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

const { $pinia } = useNuxtApp();
const transactionsStore = useTransactionsStore($pinia);

// Referências reativas para os dados da store
const balance = ref(0);
const depositsTotal = ref(0);
const investmentsTotal = ref(0);
const expensesTotal = ref(0);

let transactionsStoreInstance = null;

if (process.client) {
  onMounted(async () => {
    await nextTick();
    // Inicializar a store após o componente estar montado
    transactionsStoreInstance = useTransactionsStore();

    // Sincronizar valores
    balance.value = transactionsStoreInstance.balance;
    depositsTotal.value = transactionsStoreInstance.depositsTotal;
    investmentsTotal.value = transactionsStoreInstance.investmentsTotal;
    expensesTotal.value = transactionsStoreInstance.expensesTotal;

    // Watch para mudanças nos valores
    watch(
      () => transactionsStoreInstance.balance,
      (newVal) => {
        balance.value = newVal;
      }
    );

    watch(
      () => transactionsStoreInstance.depositsTotal,
      (newVal) => {
        depositsTotal.value = newVal;
      }
    );

    watch(
      () => transactionsStoreInstance.investmentsTotal,
      (newVal) => {
        investmentsTotal.value = newVal;
      }
    );

    watch(
      () => transactionsStoreInstance.expensesTotal,
      (newVal) => {
        expensesTotal.value = newVal;
      }
    );
  });
}

const isUpsertTransactionDialogOpen = ref(false);

function handleSubmit(data) {
  if (!transactionsStoreInstance) return;

  if (data.id) {
    transactionsStoreInstance.updateTransaction(data);
  } else {
    transactionsStoreInstance.addTransaction(data);
  }
}

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
  value: formatCurrency(balance.value),
  icon: "lucide:wallet",
}));

// Lista de cards de resumo
const summaryList = computed(() => [
  {
    title: "Receita",
    value: formatCurrency(depositsTotal.value),
    icon: "lucide:piggy-bank",
  },
  {
    title: "Investido",
    value: formatCurrency(investmentsTotal.value),
    icon: "lucide:trending-up",
  },
  {
    title: "Despesas",
    value: formatCurrency(expensesTotal.value),
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
    >
      <template #action>
        <UpsertTransactionDialog
          :is-open="isUpsertTransactionDialogOpen"
          class="h[20%] sm:h-auto relative sm:absolute right-0 sm:right-4 justify-center"
          @update:is-open="isUpsertTransactionDialogOpen = $event"
          @submit="handleSubmit"
        >
          <DialogTrigger as-child class="w-full">
            <Button class="cursor-pointer" aria-label="Adicionar transação">
              <span>Adicionar Transação</span>
              <Icon name="lucide:plus" class="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </UpsertTransactionDialog>
      </template>
    </SummaryCard>
  </div>

  <div
    class="grid max-w-[100%] grid-cols-[45%_45%] justify-center gap-3 sm:grid-cols-3 sm:gap-6"
  >
    <SummaryCard
      v-for="item in summaryList"
      :key="item.title"
      :title="item.title"
      :value="item.value"
      :icon="item.icon"
    />
  </div>
</template>
