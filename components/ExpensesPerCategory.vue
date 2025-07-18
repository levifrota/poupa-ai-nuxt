<template>
  <ScrollArea class="col-span-2 h-full rounded-md border p-6">
    <CardHeader>
      <CardTitle>Gastos por Categoria</CardTitle>
    </CardHeader>

    <div v-if="isLoading" class="flex justify-center items-center h-40" role="status" aria-live="polite">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span class="sr-only">Carregando...</span>
    </div>

    <div
      v-else-if="expenses.length === 0"
      class="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400"
      role="status"
    >
      <Icon name="lucide:bar-chart-3" class="w-12 h-12 mb-2" aria-hidden="true" />
      <p>Nenhuma despesa registrada</p>
    </div>

    <div v-else class="space-y-4" role="list">
      <div
        v-for="expense in expenses"
        :key="expense.category"
        class="space-y-2"
        role="listitem"
        :aria-label="`${expense.category}: ${formatCurrency(expense.amount)} (${expense.percentage}%)`"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: expense.color }"
              aria-hidden="true"
            />
            <span class="text-sm font-medium dark:text-white">{{
              expense.category
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium dark:text-white">{{
              formatCurrency(expense.amount)
            }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >{{ expense.percentage }}%</span
            >
          </div>
        </div>

        <div
          class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
          role="progressbar"
          :aria-valuenow="expense.percentage"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Progresso de gastos para ${expense.category}`"
        >
          <div
            class="h-2 rounded-full"
            :style="{ width: `${expense.percentage}%`, backgroundColor: expense.color }"
          />
        </div>
      </div>
    </div>
  </ScrollArea>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import mockupData from "@/mockupData.json";
import { storeToRefs } from "pinia";

// Interface para os dados de despesas por categoria
interface Expense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const isLoading = ref(true);
const expenses = ref<Expense[]>([]);
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

// Mapeamento de categorias em inglês para português
const categoryTranslations = {
  HOUSING: "Moradia",
  TRANSPORTATION: "Transporte",
  FOOD: "Alimentação",
  HEALTH: "Saúde",
  UTILITY: "Utilidades",
  ENTERTAINMENT: "Lazer",
  OTHER: "Outros",
  EDUCATION: "Educação",
};

// Paletas de cores para diferentes temas
const colorPalettes = {
  // Tema claro padrão
  light: {
    HOUSING: "#FF6384",
    TRANSPORTATION: "#36A2EB",
    FOOD: "#FFCE56",
    HEALTH: "#4BC0C0",
    UTILITY: "#9966FF",
    ENTERTAINMENT: "#FF9F40",
    OTHER: "#C9CBCF",
    EDUCATION: "#8A2BE2",
  },
  // Tema escuro
  dark: {
    HOUSING: "#FF8FA3",
    TRANSPORTATION: "#64B5F6",
    FOOD: "#FFE082",
    HEALTH: "#80CBC4",
    UTILITY: "#B39DDB",
    ENTERTAINMENT: "#FFAB91",
    OTHER: "#E0E0E0",
    EDUCATION: "#B39DDB",
  },
  // Tema para daltônicos (deuteranopia - dificuldade com verde/vermelho)
  deuteranopia: {
    HOUSING: "#0072B2",
    TRANSPORTATION: "#56B4E9",
    FOOD: "#F0E442",
    HEALTH: "#009E73",
    UTILITY: "#CC79A7",
    ENTERTAINMENT: "#D55E00",
    OTHER: "#E0E0E0",
    EDUCATION: "#0072B2",
  },
  // Tema para daltônicos (protanopia - dificuldade com vermelho)
  protanopia: {
    HOUSING: "#0072B2",
    TRANSPORTATION: "#56B4E9",
    FOOD: "#F0E442",
    HEALTH: "#009E73",
    UTILITY: "#CC79A7",
    ENTERTAINMENT: "#D55E00",
    OTHER: "#E0E0E0",
    EDUCATION: "#0072B2",
  },
  // Tema para daltônicos (tritanopia - dificuldade com azul)
  tritanopia: {
    HOUSING: "#E69F00",
    TRANSPORTATION: "#56B4E9",
    FOOD: "#F0E442",
    HEALTH: "#009E73",
    UTILITY: "#CC79A7",
    ENTERTAINMENT: "#D55E00",
    OTHER: "#E0E0E0",
    EDUCATION: "#E69F00",
  },
};

// Função para obter a paleta de cores atual com base no tema
const currentColorPalette = computed(() => {
  if (theme.value === "deuteranopia") {
    return colorPalettes.deuteranopia;
  } else if (theme.value === "protanopia") {
    return colorPalettes.protanopia;
  } else if (theme.value === "tritanopia") {
    return colorPalettes.tritanopia;
  } else {
    // Usar tema claro ou escuro padrão
    return theme.value === "dark" || theme.value === "high-contrast"
      ? colorPalettes.dark
      : colorPalettes.light;
  }
});

// Função para atualizar as cores quando o tema mudar
const updateColorsOnThemeChange = () => {
  if (expenses.value.length > 0) {
    expenses.value = expenses.value.map((expense) => ({
      ...expense,
      color:
        currentColorPalette.value[
          Object.keys(categoryTranslations).find(
            (key) =>
              categoryTranslations[key as keyof typeof categoryTranslations] ===
              expense.category
          ) as keyof typeof currentColorPalette.value
        ] || "#C9CBCF",
    }));
  }
};

// Observar mudanças no tema
watch(
  () => theme.value,
  () => {
    updateColorsOnThemeChange();
  }
);

// Função para formatar valores monetários
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Função para carregar os dados do mockupData.json
const loadExpensesData = () => {
  // Usar os dados do mockupData.json
  const expensesData = mockupData.totalExpensePerCategory;

  // Transformar os dados para o formato esperado pelo componente
  const formattedExpenses: Expense[] = expensesData.map((item) => ({
    category:
      categoryTranslations[item.category as keyof typeof categoryTranslations] ||
      item.category,
    amount: item.totalAmount,
    percentage: item.percentageOfTotal,
    color:
      currentColorPalette.value[
        item.category as keyof typeof currentColorPalette.value
      ] || "#C9CBCF",
  }));

  expenses.value = formattedExpenses;
  isLoading.value = false;
};

// Inicialização do componente
onMounted(() => {
  //   // Carregar os dados com um pequeno delay para simular carregamento
  //   setTimeout(() => {
  loadExpensesData();
  //   }, 1000);
});
</script>
