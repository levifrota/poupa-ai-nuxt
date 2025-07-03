<script setup lang="ts">
import { useTransactionsStore } from "@/stores/transactions";
import { useI18n } from '#imports'; // Added
import { computed } from 'vue'; // Ensure computed is imported if not already

const { t } = useI18n(); // Added

const transactionsStore = useTransactionsStore();

// Transform the data to use translated legend types
const chartData = computed(() => {
  return Object.entries(transactionsStore.typesPercentage).map(([type, value]) => ({
    type: t(`transaction_type_${type.toUpperCase()}`, type), // Internationalized, provides fallback to original type
    value,
  }));
});

const formatValue = (value: number): string => `${value.toFixed(0)}%`; // Keep percentage simple for now

// Cores para cada tipo de transação - these might need to be adjusted if types change order or number
const colors = ["#4CAF50", "#2196F3", "#F44336"]; // Green, Blue, Red

const legendItems = computed(() =>
  chartData.value.map((item, i) => ({
    name: item.type,
    color: colors[i % colors.length], // Use modulo to avoid out-of-bounds if more types than colors
    value: formatValue(Number(item.value)),
    inactive: false, // Assuming this might be used for interactivity later
  }))
);
</script>

<template>
  <Card
    class="flex min-w-[210px] flex-col p-3"
    role="figure"
    :aria-label="t('transaction_pie_chart_label')"
  >
    <CardHeader>
      <CardTitle class="text-center text-lg font-semibold">{{ t('transaction_distribution_title') }}</CardTitle>
    </CardHeader>
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
          :aria-label="t('transaction_donut_chart_aria_label')"
        />
        <div class="mt-4">
          <CustomLegend
            :items="legendItems"
            :aria-label="t('chart_legend_aria_label')"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
