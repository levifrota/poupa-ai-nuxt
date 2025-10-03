<script setup lang="ts">
import { useTransactionsStore } from "@/stores/transactions.js";
import { storeToRefs } from "pinia";
import { computed } from "vue";

// Store para obter os dados das transações
const transactionsStore = useTransactionsStore();
const themesStore = useThemeStore();
const { theme } = storeToRefs(themesStore);

// Mapeamento dos tipos em inglês para português
const typeMapping = {
  DEPOSIT: "Receita",
  INVESTMENT: "Investido",
  EXPENSE: "Despesas",
};

// Transformar os dados para usar as legendas em português
const chartData = computed(() => {
  return Object.entries(transactionsStore.typesPercentage).map(([type, value]) => ({
    type: typeMapping[type as keyof typeof typeMapping] || type,
    value,
    originalType: type,
  }));
});

const formatValue = (value: number): string => `${value}%`;

// Paletas de cores para diferentes temas
const colorPalettes = {
  // Tema claro padrão
  light: {
    DEPOSIT: "#4CAF50", // Verde
    INVESTMENT: "#2196F3", // Azul
    EXPENSE: "#F44336", // Vermelho
  },
  // Tema escuro
  dark: {
    DEPOSIT: "#66BB6A", // Verde mais claro
    INVESTMENT: "#42A5F5", // Azul mais claro
    EXPENSE: "#EF5350", // Vermelho mais claro
  },
  // Tema para daltônicos (deuteranopia)
  deuteranopia: {
    DEPOSIT: "#0072B2", // Azul
    INVESTMENT: "#F0E442", // Amarelo
    EXPENSE: "#CC79A7", // Rosa
  },
  // Tema para daltônicos (protanopia)
  protanopia: {
    DEPOSIT: "#0072B2", // Azul
    INVESTMENT: "#F0E442", // Amarelo
    EXPENSE: "#56B4E9", // Azul claro
  },
  // Tema para daltônicos (tritanopia)
  tritanopia: {
    DEPOSIT: "#009E73", // Verde
    INVESTMENT: "#E69F00", // Laranja
    EXPENSE: "#D55E00", // Vermelho-laranja
  },
  // Tema colorblind geral
  colorblind: {
    DEPOSIT: "#009E73", // Verde
    INVESTMENT: "#0072B2", // Azul
    EXPENSE: "#D55E00", // Laranja
  },
  // Tema alto contraste
  "high-contrast": {
    DEPOSIT: "#00FF00", // Verde brilhante
    INVESTMENT: "#00FFFF", // Ciano brilhante
    EXPENSE: "#FF0000", // Vermelho brilhante
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
  } else if (theme.value === "colorblind") {
    return colorPalettes.colorblind;
  } else if (theme.value === "high-contrast") {
    return colorPalettes["high-contrast"];
  } else {
    return theme.value === "dark" ? colorPalettes.dark : colorPalettes.light;
  }
});

// Cores dinâmicas baseadas no tema
const colors = computed(() => {
  return chartData.value.map(
    (item) =>
      currentColorPalette.value[
        item.originalType as keyof typeof currentColorPalette.value
      ] || "#C9CBCF"
  );
});

const legendItems = computed(() =>
  chartData.value.map((item, i) => ({
    name: item.type,
    color: colors.value[i],
    value: formatValue(Number(item.value)),
    inactive: false,
  }))
);
</script>

<template>
  <Card
    class="flex min-w-[210px] flex-col p-3"
    aria-label="Gráfico de pizza da distribuição de transações"
  >
    <CardContent class="flex-1 overflow-hidden p-0 pb-0">
      <div class="flex flex-col items-center">
        <DonutChart
          :data="chartData"
          index="type"
          category="value"
          radius="60"
          :value-formatter="formatValue"
          :show-legend="false"
          :colors="colors"
          type="donut"
          aria-label="Gráfico de pizza mostrando a porcentagem de cada tipo de transação"
        />
        <div class="mt-4">
          <CustomLegend :items="legendItems" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
