<script setup>
import { ref } from 'vue';
import SummaryCard from '~/components/SummaryCard.vue';
import { useTransactionsStore } from '@/stores/transactions';
import { computed } from 'vue';
import UpsertTransactionDialog from '~/components/UpsertTransactionDialog.vue';
import { Button } from '~/components/ui/button';
import { DialogTrigger } from '~/components/ui/dialog';

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
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Objeto para o card de saldo
const balanceObj = computed(() => ({
  title: 'Saldo',
  value: formatCurrency(transactionsStore.balance),
  icon: 'lucide:wallet',
}));

// Lista de cards de resumo
const summaryList = computed(() => [
  {
    title: 'Receita',
    value: formatCurrency(transactionsStore.depositsTotal),
    icon: 'lucide:piggy-bank',
  },
  {
    title: 'Investido',
    value: formatCurrency(transactionsStore.investmentsTotal),
    icon: 'lucide:trending-up',
  },
  {
    title: 'Despesas',
    value: formatCurrency(transactionsStore.expensesTotal),
    icon: 'lucide:trending-down',
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
        <UpsertTransactionDialog :is-open="isUpsertTransactionDialogOpen" @update:is-open="isUpsertTransactionDialogOpen = $event" @submit="handleSubmit">
          <DialogTrigger as-child>
            <Button size="icon">
              <Icon name="lucide:plus" class="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </UpsertTransactionDialog>
      </template>
    </SummaryCard>
  </div>

  <div class="grid max-w-[100%] grid-cols-[50%_50%] gap-3 sm:grid-cols-3 sm:gap-6">
    <SummaryCard
      v-for="item in summaryList"
      :key="item.title"
      :title="item.title"
      :value="item.value"
      :icon="item.icon"
    />
  </div>
</template>
