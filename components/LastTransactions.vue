<script setup lang="ts">
import { TransactionType, TRANSACTION_PAYMENT_METHOD_ICONS } from "~/constants/transactions";
import { useTransactionsStore } from "@/stores/transactions";
import { computed } from "vue";
import { useI18n } from '#imports';

const { t, locale } = useI18n();
const titleId = `last-transactions-title-${Math.random().toString(36).substring(2, 9)}`;

const transactionsStore = useTransactionsStore();
const transactions = computed(() => transactionsStore.lastTransactions);

const getAmountColor = (transaction) => {
  if (transaction.type === TransactionType.EXPENSE) return "text-red-500";
  if (transaction.type === TransactionType.DEPOSIT) return "text-primary";
  return "text-white"; // Or a default text color from your theme
};

const getAmountPrefix = (transaction) => {
  if (transaction.type === TransactionType.EXPENSE) return "-";
  if (transaction.type === TransactionType.DEPOSIT) return "+";
  return "";
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat(locale.value, { // Use reactive locale
    style: "currency",
    currency: t('currency_code'), // Use translated currency code
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value, { // Use reactive locale
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Function to get translated payment method name for alt text
const getPaymentMethodAltText = (paymentMethodKey: string) => {
  if (!paymentMethodKey) return t('payment_method_other_alt');
  return t(`payment_method_${paymentMethodKey.toUpperCase()}_alt`, t('payment_method_other_alt'));
}

</script>

<template>
  <ScrollArea class="rounded-md border p-3.5" :aria-labelledby="titleId">
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle :id="titleId" class="font-bold">{{ t('last_transactions_title') }}</CardTitle>
      <Button variant="outline" class="rounded-full" as-child>
        <NuxtLink to="/transactions">{{ t('view_more_button') }}</NuxtLink>
      </Button>
    </CardHeader>
    <CardContent class="space-y-6" role="list">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex items-center justify-between"
        role="listitem"
      >
        <div class="flex items-center gap-3">
          <div class="rounded-lg bg-opacity-[3%] p-3">
            <NuxtImg
              :src="
                TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod] ||
                TRANSACTION_PAYMENT_METHOD_ICONS.OTHER
              "
              height="20"
              width="20"
              :alt="getPaymentMethodAltText(transaction.paymentMethod)"
            />
          </div>
          <div class="">
            <p class="text-sm font-bold">{{ transaction.name }}</p>
            <p class="text-sm text-muted-foreground">
              {{ formatDate(transaction.date) }}
            </p>
          </div>
        </div>

        <p :class="['text-sm font-bold', getAmountColor(transaction)]">
          {{ getAmountPrefix(transaction) }} {{ formatCurrency(transaction.amount) }}
        </p>
      </div>
      <div v-if="transactions.length === 0" class="text-center text-muted-foreground py-4">
        {{ t('no_recent_transactions') }}
      </div>
    </CardContent>
  </ScrollArea>
</template>
