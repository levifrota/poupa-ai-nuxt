<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCurrentUser } from "vuefire";
import { Button } from "~/components/ui/button/index.js";
import { ScrollArea } from "~/components/ui/scroll-area/index.js";
import { useBillsStore } from "~/stores/bills.js";
import { getUpcomingBills, markBillAsPaid } from "~/service/transactionService.js";
import { getDaysUntilDue, isBillDueSoon } from "~/lib/billReminders.js";
import type { Transaction } from "~/constants/transactions.js";

type Bill = Transaction & { dueDate: Date };

const user = useCurrentUser();
const billsStore = useBillsStore();

const processingId = ref<string | undefined>(undefined);

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

async function notifyDueBills(bills: Bill[]) {
  if (bills.length === 0) return;
  if (typeof window === "undefined" || !("Notification" in window)) return;

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return;

  bills.forEach((bill) => {
    new Notification("Conta a pagar", {
      body: `${bill.name} (${formatCurrency(bill.amount)}) ${dueStatusLabel(bill.dueDate)}`,
    });
  });
}

async function fetchBills() {
  if (!user.value?.uid) return;
  try {
    billsStore.setLoading(true);
    const bills = await getUpcomingBills(user.value.uid);
    billsStore.setBills(bills);
  } catch (error) {
    console.error("Erro ao carregar contas a pagar:", error);
  } finally {
    billsStore.setLoading(false);
  }
}

onMounted(async () => {
  await fetchBills();
  await notifyDueBills(dueBills.value);
});

const dueBills = computed(() => {
  return billsStore.bills
    .filter(
      (transaction): transaction is Bill =>
        Boolean(
          transaction.isBill &&
            !transaction.isPaid &&
            transaction.dueDate &&
            isBillDueSoon(transaction.dueDate)
        )
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
});

const isLoading = computed(() => billsStore.isLoading);

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pt-BR");
};

const dueStatusLabel = (dueDate: Date): string => {
  const daysUntilDue = getDaysUntilDue(dueDate);
  if (daysUntilDue < 0) return `vencida há ${Math.abs(daysUntilDue)} dia(s)`;
  if (daysUntilDue === 0) return "vence hoje";
  return `vence em ${daysUntilDue} dia(s)`;
};

async function handleMarkAsPaid(transactionId: string) {
  if (!user.value?.uid) return;

  try {
    processingId.value = transactionId;
    await markBillAsPaid(user.value.uid, transactionId);
    billsStore.markAsPaid(transactionId);
  } catch (error) {
    console.error("Erro ao marcar conta como paga:", error);
    alert("Erro ao marcar conta como paga. Tente novamente.");
  } finally {
    processingId.value = undefined;
  }
}
</script>

<template>
  <ScrollArea
    v-if="isLoading || dueBills.length > 0"
    class="col-span-2 h-full rounded-md border p-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Contas a Pagar</h2>
    </div>

    <div
      v-if="isLoading"
      class="flex justify-center items-center h-20"
      role="status"
      aria-live="polite"
    >
      <span>Carregando contas a pagar...</span>
    </div>

    <div
      v-else
      class="space-y-4"
      role="list"
      aria-label="Contas a pagar próximas do vencimento"
    >
      <div
        v-for="bill in dueBills"
        :key="bill.id"
        role="listitem"
        class="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
        :aria-label="`${bill.name}, ${formatCurrency(bill.amount)}, ${dueStatusLabel(bill.dueDate)}`"
      >
        <div>
          <p class="font-medium">{{ bill.name }}</p>
          <p class="text-sm text-muted-foreground">
            {{ formatCurrency(bill.amount) }} · {{ formatDate(bill.dueDate) }} ·
            {{ dueStatusLabel(bill.dueDate) }}
          </p>
        </div>
        <Button
          size="sm"
          :disabled="processingId === bill.id"
          :aria-label="`Marcar ${bill.name} como paga`"
          @click="handleMarkAsPaid(bill.id)"
        >
          Marcar como paga
        </Button>
      </div>
    </div>
  </ScrollArea>
</template>
