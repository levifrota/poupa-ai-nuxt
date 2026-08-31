<script setup>
import SummaryCard from "~/components/SummaryCard.vue";
import { useTransactionsStore } from "@/stores/transactions";
import { ref, computed } from "vue";
import UpsertTransactionDialog from "~/components/UpsertTransactionDialog.vue";
import VoiceTransactionButton from "~/components/VoiceTransactionButton.vue";
import { Button } from "~/components/ui/button";
import { DialogTrigger } from "~/components/ui/dialog";
import { useMoney } from "~/composables/useMoney";

// Usar a store de transações para obter os valores calculados
const transactionsStore = useTransactionsStore();

const isUpsertTransactionDialogOpen = ref(false);

function handleSubmit(data) {
  if (data.id) {
    transactionsStore.updateTransaction(data);
  } else {
    transactionsStore.addTransaction(data);
  }
}

// Formatar valores monetários
const { formatCurrency } = useFormatCurrency();

// Descrições por extenso para leitores de tela
const balanceMoney = useMoney(computed(() => transactionsStore.balance));
const depositsMoney = useMoney(computed(() => transactionsStore.depositsTotal));
const investmentsMoney = useMoney(computed(() => transactionsStore.investmentsTotal));
const expensesMoney = useMoney(computed(() => transactionsStore.expensesTotal));

// Objeto para o card de saldo
const balanceObj = computed(() => ({
  title: "Saldo",
  value: formatCurrency(transactionsStore.balance),
  ariaValue: balanceMoney.ariaLabel.value,
  icon: "lucide:wallet",
}));

// Lista de cards de resumo
const summaryList = computed(() => [
  {
    title: "Receita",
    value: formatCurrency(transactionsStore.depositsTotal),
    ariaValue: depositsMoney.ariaLabel.value,
    icon: "lucide:piggy-bank",
  },
  {
    title: "Investido",
    value: formatCurrency(transactionsStore.investmentsTotal),
    ariaValue: investmentsMoney.ariaLabel.value,
    icon: "lucide:trending-up",
  },
  {
    title: "Despesas",
    value: formatCurrency(transactionsStore.expensesTotal),
    ariaValue: expensesMoney.ariaLabel.value,
    icon: "lucide:trending-down",
  },
]);
</script>

<template>
  <div class="w-100% flex flex-col items-center space-y-6 sm:block">
    <SummaryCard
      :title="balanceObj.title"
      :value="balanceObj.value"
      :aria-value="balanceObj.ariaValue"
      :icon="balanceObj.icon"
    >
      <template #action>
        <div
          class="h[20%] sm:h-auto relative sm:absolute right-0 sm:right-4 flex items-center gap-2 justify-center max-[375px]:block"
        >
          <VoiceTransactionButton />
          <UpsertTransactionDialog
            :is-open="isUpsertTransactionDialogOpen"
            @update:is-open="isUpsertTransactionDialogOpen = $event"
            @submit="handleSubmit"
          >
            <DialogTrigger as-child class="w-full">
              <Button
                class="cursor-pointer max-[600px]:w-[85%]"
                aria-label="Adicionar transação"
              >
                <span>Adicionar Transação</span>
                <Icon name="lucide:plus" class="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </UpsertTransactionDialog>
        </div>
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
      :aria-value="item.ariaValue"
      :icon="item.icon"
    />
  </div>
</template>
