<script setup lang="ts">
// import DonutChart from "@/components/ui/chart-donut/DonutChart.vue";
// import CustomLegend from "@/components/ui/chart-donut/CustomLegend.vue";
import { useTransactionsStore } from "@/stores/transactions";

// Store para obter os dados das transações
const transactionsStore = useTransactionsStore();

// Mapeamento dos tipos em inglês para português
const typeMapping = {
  DEPOSIT: "Receita",
  INVESTMENT: "Investido",
  EXPENSE: "Despesas",
};

// Transformar os dados para usar as legendas em português
const chartData = computed(() => {
  return Object.entries(transactionsStore.typesPercentage).map(([type, value]) => ({
    type: typeMapping[type] || type,
    value,
  }));
});

const formatValue = (value: number): string => `${value}%`;

// Cores para cada tipo de transação
const colors = ["#4CAF50", "#2196F3", "#F44336"];

const legendItems = computed(() =>
  chartData.value.map((item, i) => ({
    name: item.type,
    color: colors[i],
    value: formatValue(Number(item.value)),
    inactive: false,
  }))
);
</script>

<template>
  <Card class="flex min-w-[210px] flex-col p-3" aria-label="Gráfico de pizza da distribuição de transações">
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
