<script setup lang="ts">
import { identity } from "@vueuse/core";
import { ref, computed, watch, onMounted } from "vue";
import { TRANSACTION_PAYMENT_METHOD_LABELS } from "~/constants/transactions";

const props = defineProps<{
  date: string | Date | null;
  category: string;
  amount: number;
  name: string;
  paymentMethod: string;
  id?: string;
}>();

const expanded = ref(false);
const toggle = () => {
  expanded.value = !expanded.value;
};

const formattedDate = computed(() => {
  if (!props.date) return ""; 

  let dateObj: Date;
  if (typeof props.date === "string") {
    const [year, month, day] = props.date.split("-").map(Number);
    dateObj = new Date(year, month - 1, day);
  } else if (props.date instanceof Date) {
    dateObj = props.date;
  } else {
    return "";
  }

  return dateObj
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/de/g, "/")
    .replace(/\./g, "")
    .toUpperCase();
});

const paymentMethodLabel = computed(() => {
  return TRANSACTION_PAYMENT_METHOD_LABELS[props.paymentMethod] ?? props.paymentMethod;
});

const handleEditTransaction = () => {
  const transaction = {
    date: props.date,
    category: props.category,
    amount: props.amount,
    name: props.name,
    paymentMethod: props.paymentMethod,
    id: props.id,
  };

  const event = new CustomEvent("edit-transaction", { detail: { transaction } });
  window.dispatchEvent(event);
};

// Log props when component mounts and whenever they change
onMounted(() => {
  console.log("TransactionCard mounted props:", props);
});

watch(
  () => props,
  (newVal) => {
    console.log("TransactionCard props changed:", newVal);
  },
  { immediate: true, deep: true }
);

// Lógica
</script>

<template>
  <div class="p-2 mb-2 border rounded-sm shadow-md bg-card text-card-foreground">
    <div class="cursor-pointer" @click="toggle">
      <div class="flex items-center justify-between p-2 mb-5">
        <span
          class="px-2 py-1 text-sm font-semibold rounded-full"
          :class="props.amount < 0 ? 'bg-red-400 text-white' : 'bg-green-500 text-green-50'"
        >
          {{ props.category }}
        </span>

        <p class="font-semibold">{{ props.category }}</p>
      </div>

      <div class="flex items-center justify-between p-2 mb-2">
        <p class="font-medium" :class="props.amount < 0 ? 'text-red-400' : 'text-primary'">
          R$ {{ props.amount.toFixed(2) }}
        </p>

        <p class="text-sm text-muted-foreground">
          {{ formattedDate }}
        </p>
      </div>
    </div>

    <div class="overflow-hidden transition-all duration-300" :style="{ maxHeight: expanded ? '500px' : '0px' }">
      <div class="p-2">
        <p class="text-muted-foreground">{{ props.name }}</p>
        <p class="text-muted-foreground">Categoria: {{ props.category }}</p>
      </div>

  <div class="w-full h-px mb-5 bg-gradient-to-r from-transparent via-border to-transparent" />

      <div class="p-2">
        <p>Método de Pagamento: {{ paymentMethodLabel }}</p>

        <p class="font-medium" :class="props.amount < 0 ? 'text-red-400' : 'text-green-500'">
          Valor: R$ {{ props.amount.toFixed(2) }}
        </p>
      </div>

      <div class="flex w-full mt-6 space-x-2 justify-evenly">
        <button class="px-4 py-2 text-sm rounded shadow cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80" @click="handleEditTransaction">
          Editar
        </button>
        <button class="px-4 py-2 text-sm font-semibold text-white rounded shadow cursor-pointer bg-destructive hover:bg-destructive/80">
          Excluir
        </button>
      </div>
    </div>
  </div>
</template>
