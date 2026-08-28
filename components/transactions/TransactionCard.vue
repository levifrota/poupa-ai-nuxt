<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { TRANSACTION_PAYMENT_METHOD_LABELS, TRANSACTION_TYPE_OPTIONS } from "~/constants/transactions";
import { useFormatCurrency } from "~/composables/useFormatCurrency";
import { useThemeStore } from "~/composables/useThemeStore";
import type { Transaction } from "~/components/transactions/columns";

const props = defineProps<{
  transaction: Transaction;
}>();

const expanded = ref(false);
const { formatCurrency } = useFormatCurrency();
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

function toggle() {
  expanded.value = !expanded.value;
}

const formattedDate = computed(() => {
  const date = props.transaction.date;
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

const paymentMethodLabel = computed(() => {
  const method = props.transaction.paymentMethod;
  return TRANSACTION_PAYMENT_METHOD_LABELS[method as keyof typeof TRANSACTION_PAYMENT_METHOD_LABELS] ?? method;
});

const typeLabel = computed(() => {
  return (
    TRANSACTION_TYPE_OPTIONS.find((option) => option.value === props.transaction.type)?.label ??
    props.transaction.type
  );
});

// Cores adaptadas ao tema, incluindo paletas para daltonismo — mesma lógica
// usada em components/transactions/columns.ts para manter consistência
// entre a tabela (desktop) e o card (mobile).
const isColorblindTheme = computed(
  () => theme.value === "protanopia" || theme.value === "deuteranopia"
);

const amountColorClass = computed(() => {
  const isExpense = props.transaction.amount < 0;
  if (isColorblindTheme.value) {
    return isExpense ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400";
  }
  return isExpense ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400";
});

const typeColorClass = computed(() => {
  if (isColorblindTheme.value) {
    return props.transaction.type === "EXPENSE"
      ? "text-amber-600 dark:text-amber-400"
      : props.transaction.type === "DEPOSIT"
        ? "text-sky-600 dark:text-sky-400"
        : "text-purple-600 dark:text-purple-400";
  }
  return props.transaction.type === "EXPENSE"
    ? "text-red-600 dark:text-red-400"
    : props.transaction.type === "DEPOSIT"
      ? "text-green-600 dark:text-green-400"
      : "text-blue-600 dark:text-blue-400";
});

const formattedAmount = computed(() => formatCurrency(props.transaction.amount));

const cardAccessibleLabel = computed(() => {
  const state = expanded.value ? "Recolher detalhes" : "Expandir detalhes";
  const { name, category } = props.transaction;
  return `${name}, ${category}, ${typeLabel.value}, ${formattedAmount.value}, ${formattedDate.value}. ${state}`;
});

// Segue o mesmo contrato de eventos globais usado pela tabela desktop (ver
// components/transactions/columns.ts), para que pages/transactions/index.vue
// trate a edição/exclusão da mesma forma independente da visualização
// (tabela ou card).
function handleEditTransaction() {
  window.dispatchEvent(
    new CustomEvent("edit-transaction", { detail: { transaction: props.transaction } })
  );
}

function handleDeleteTransaction() {
  window.dispatchEvent(
    new CustomEvent("delete-transaction", { detail: { transaction: props.transaction } })
  );
}
</script>

<template>
  <div
    class="p-2 mb-2 border rounded-sm shadow-md bg-card text-card-foreground"
    role="listitem"
  >
    <!-- Cabeçalho clicável -->
    <button
      class="w-full text-left cursor-pointer"
      type="button"
      :aria-expanded="expanded"
      :aria-controls="`transaction-details-${transaction.id}`"
      :aria-label="cardAccessibleLabel"
      @click="toggle"
    >
      <div class="flex items-center justify-between p-2 mb-5">
        <span
          class="px-2 py-1 text-sm font-semibold rounded-full bg-secondary text-secondary-foreground"
          aria-hidden="true"
        >
          {{ transaction.category }}
        </span>

        <p class="font-semibold" aria-hidden="true">
          {{ transaction.name }}
        </p>
      </div>

      <div class="flex items-center justify-between p-2 mb-2">
        <p class="font-medium" :class="amountColorClass" aria-hidden="true">
          {{ formattedAmount }}
        </p>

        <p class="text-sm text-muted-foreground" aria-hidden="true">
          {{ formattedDate }}
        </p>
      </div>
    </button>

    <!-- Conteúdo expandido -->
    <transition name="expand">
      <div
        v-show="expanded"
        :id="`transaction-details-${transaction.id}`"
        class="overflow-hidden transition-all duration-300"
        role="region"
        :aria-label="`Detalhes da transação ${transaction.name}`"
      >
        <div class="p-2">
          <p class="text-muted-foreground">Categoria: {{ transaction.category }}</p>
          <p class="font-medium" :class="typeColorClass">Tipo: {{ typeLabel }}</p>
        </div>

        <div
          class="w-full h-px mb-5 bg-gradient-to-r from-transparent via-border to-transparent"
        />

        <div class="p-2">
          <p>Método de Pagamento: {{ paymentMethodLabel }}</p>
          <p class="font-medium" :class="amountColorClass">Valor: {{ formattedAmount }}</p>
        </div>

        <div class="flex w-full mt-6 space-x-2 justify-evenly">
          <button
            class="px-4 py-2 text-sm rounded shadow cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80"
            type="button"
            :aria-label="`Editar transação ${transaction.name}`"
            @click="handleEditTransaction"
          >
            Editar
          </button>

          <button
            class="px-4 py-2 text-sm font-semibold text-white rounded shadow cursor-pointer bg-destructive hover:bg-destructive/80"
            type="button"
            :aria-label="`Excluir transação ${transaction.name}`"
            @click="handleDeleteTransaction"
          >
            Excluir
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Animação de expansão */
.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
