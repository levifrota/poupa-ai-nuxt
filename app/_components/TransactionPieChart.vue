<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import mockup from '@/mockupData.json'

const series = Object.values(mockup.typesPercentage)
const options = {
  labels: Object.keys(mockup.typesPercentage),
  legend: { position: 'bottom' },
  responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }],
}
</script>

<template>
  <div class="bg-card p-4 rounded-lg shadow-sm">
    <h3 class="text-lg font-semibold mb-2">Transaction Breakdown</h3>
    <VueApexCharts type="pie" :series="series" :options="options" width="100%" />
  </div>
</template>