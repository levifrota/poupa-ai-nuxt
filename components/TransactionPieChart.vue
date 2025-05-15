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

const formatValue = (value) => `${value}%`;

// Cores para cada tipo de transação
const colors = ["#4CAF50", "#2196F3", "#F44336"];

// Criar itens de legenda personalizados
console.log("chartData: ", chartData);
const legendItems = computed(() =>
  chartData.value.map((item, i) => ({
    name: item.type,
    color: colors[i],
    value: formatValue(item.value),
    inactive: false,
  }))
);
</script>

<template>
  <Card class="flex min-w-[210px] flex-col p-3">
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
        />
        <div class="mt-4">
          <CustomLegend :items="legendItems" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
