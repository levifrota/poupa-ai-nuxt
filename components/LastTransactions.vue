<script setup lang="ts">
import {
  TransactionType,
  TRANSACTION_PAYMENT_METHOD_ICONS,
  type Transaction,
} from "~/constants/transactions.js";

// Store para obter os dados das transações
const transactionsStore = useTransactionsStore();

// Obter as últimas transações da store
const transactions = computed(() => transactionsStore.lastTransactions);

const getAmountColor = (transaction: Transaction) => {
  if (transaction.type === TransactionType.EXPENSE) {
    return "text-red-500";
  }
  if (transaction.type === TransactionType.DEPOSIT) {
    return "text-primary";
  }
  return "text-white";
};

const getAmountPrefix = (transaction: Transaction) => {
  if (transaction.type === TransactionType.EXPENSE) {
    return "-";
  }
  if (transaction.type === TransactionType.DEPOSIT) {
    return "+";
  }
  return "";
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};
</script>

<template>
  <ScrollArea class="rounded-md border p-3.5">
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle class="font-bold">Últimas Transações</CardTitle>
      <Button variant="outline" class="rounded-full" as-child>
        <NuxtLink to="/transactions" aria-label="Ver todas as transações"
          >Ver mais</NuxtLink
        >
      </Button>
    </CardHeader>
    <CardContent class="space-y-6" role="list">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex items-center justify-between"
        role="listitem"
        :aria-label="`${transaction.name}, ${new Date(
          transaction.date
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}, ${getAmountPrefix(transaction)}${formatCurrency(transaction.amount)}`"
      >
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-opacity-[3%] p-3">
            <NuxtImg
              :src="
                TRANSACTION_PAYMENT_METHOD_ICONS[
                  transaction.paymentMethod as keyof typeof TRANSACTION_PAYMENT_METHOD_ICONS
                ] || TRANSACTION_PAYMENT_METHOD_ICONS.OTHER
              "
              height="20"
              width="20"
              :alt="transaction.paymentMethod || 'Payment'"
            />
          </div>
          <div class="">
            <p class="text-sm font-bold">{{ transaction.name }}</p>
            <p class="text-sm text-muted-foreground">
              {{
                new Date(transaction.date).toLocaleDateString("pt-Br", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              }}
            </p>
          </div>
        </div>

        <p :class="['text-sm font-bold', getAmountColor(transaction)]">
          {{ getAmountPrefix(transaction) }}
          {{ formatCurrency(transaction.amount) }}
        </p>
      </div>
    </CardContent>
  </ScrollArea>
</template>
