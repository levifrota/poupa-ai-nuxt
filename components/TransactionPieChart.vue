<script setup lang="ts">
import type { ChartConfig } from "@/components/ui/chart";
import type { Theme } from "@/composables/useThemeStore";
import { useTransactionsStore } from "@/stores/transactions.js";
import { Donut } from "@unovis/ts";
import { VisDonut, VisSingleContainer } from "@unovis/vue";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from "@/components/ui/chart";
import CustomLegend from "@/components/PieChartLegend.vue";

// Store para obter os dados das transações
const transactionsStore = useTransactionsStore();
const themesStore = useThemeStore();
const { theme } = storeToRefs(themesStore);

// Mapeamento dos tipos em inglês para português
const typeMapping = {
  DEPOSIT: "Receita",
  INVESTMENT: "Investido",
  EXPENSE: "Despesas",
} as const;

type TransactionType = keyof typeof typeMapping;

const formatValue = (value: number): string => `${value}%`;

// Paletas de cores para diferentes temas
const colorPalettes: Record<Theme, Record<TransactionType, string>> = {
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
const currentColorPalette = computed(() => colorPalettes[theme.value] ?? colorPalettes.light);

// Configuração do gráfico no formato exigido pelo componente Chart do shadcn-vue,
// já refletindo a paleta de cores do tema atual (incluindo os temas de acessibilidade
// para daltonismo e alto contraste).
const chartConfig = computed<ChartConfig>(() => {
  const palette = currentColorPalette.value;
  return {
    DEPOSIT: { label: typeMapping.DEPOSIT, color: palette.DEPOSIT },
    INVESTMENT: { label: typeMapping.INVESTMENT, color: palette.INVESTMENT },
    EXPENSE: { label: typeMapping.EXPENSE, color: palette.EXPENSE },
  };
});

// Dados do gráfico: cada linha carrega a própria chave de categoria (ex.: "DEPOSIT")
// com o valor já formatado, para que o tooltip do shadcn-vue consiga casar o dado
// com a entrada correspondente em `chartConfig`.
const chartData = computed(() => {
  return Object.entries(transactionsStore.typesPercentage).map(([type, value]) => {
    const originalType = type as TransactionType;
    const rawValue = Number(value);
    return {
      originalType,
      label: typeMapping[originalType] ?? type,
      rawValue,
      [originalType]: formatValue(rawValue),
    };
  });
});

type ChartRow = (typeof chartData.value)[number];

const totalValue = computed(() => chartData.value.reduce((sum, item) => sum + item.rawValue, 0));

const legendItems = computed(() =>
  chartData.value.map((item) => ({
    name: item.label,
    color: chartConfig.value[item.originalType]?.color ?? "#C9CBCF",
    value: formatValue(item.rawValue),
    inactive: false,
  }))
);

// Resumo textual usado como alternativa não visual ao gráfico (WCAG 1.1.1).
const chartSummary = computed(
  () =>
    `Gráfico de pizza da distribuição de transações: ${chartData.value
      .map((item) => `${item.label} ${formatValue(item.rawValue)}`)
      .join(", ")}`
);

const donutValue = (d: ChartRow) => d.rawValue;
const donutColor = (d: ChartRow) => chartConfig.value[d.originalType]?.color ?? "#C9CBCF";

const tooltipTriggers = computed(() => ({
  [Donut.selectors.segment]: componentToString(chartConfig.value, ChartTooltipContent, {
    hideLabel: true,
  }) as (data: unknown, x: number | Date) => string,
}));
</script>

<template>
  <Card class="flex min-w-[210px] flex-col p-3">
    <CardContent class="flex-1 overflow-hidden p-0 pb-0">
      <div class="flex flex-col items-center">
        <figure :aria-label="chartSummary">
          <ChartContainer :config="chartConfig" class="aspect-square w-[160px]" aria-hidden="true">
            <VisSingleContainer :data="chartData" :margin="{ top: 10, bottom: 10 }">
              <VisDonut
                :value="donutValue"
                :color="donutColor"
                :arc-width="20"
                :radius="60"
                :show-background="false"
                :central-label="formatValue(totalValue)"
              />
              <ChartTooltip :triggers="tooltipTriggers" />
            </VisSingleContainer>
          </ChartContainer>
        </figure>
        <div class="mt-4">
          <CustomLegend :items="legendItems" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
