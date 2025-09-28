<template>
  <ScrollArea class="m-0 mt-0 flex flex-col sm:m-0 sm:overflow-hidden sm:p-6">
    <div class="m-3 flex flex-col justify-between sm:flex-row">
      <h1 class="self-center py-2 text-2xl font-bold sm:self-auto md:py-0">Painel</h1>

      <div
        class="flex flex-wrap flex-row items-center justify-center gap-3 sm:justify-normal"
      >
        <TimeSelect @update:date-range="handleDateRangeUpdate" />
        <AiReportButton :start-date="selectedStartDate" :end-date="selectedEndDate" />
      </div>
    </div>

    <div class="grid grid-cols-[1fr] gap-6 sm:overflow-hidden sm:grid-cols-[2fr_1fr]">
      <div class="flex flex-col gap-6 sm:overflow-hidden">
        <SummaryCards />

        <div
          class="grid grid-cols-1 gap-y-6 sm:h-auto sm:grid-rows-1 sm:gap-y-6 md:grid-cols-3 md:gap-6"
        >
          <TransactionPieChart />
          <ExpensesPerCategory />
        </div>
      </div>

      <LastTransactions />
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import TimeSelect from "@/components/TimeSelect.vue";
import type { DateRange } from "reka-ui";
import { toDate } from "reka-ui/date";

definePageMeta({
  middleware: "auth",
});

const selectedStartDate = ref(new Date());
const selectedEndDate = ref(new Date());

const handleDateRangeUpdate = (dateRange: DateRange) => {
  if (dateRange.start && dateRange.end) {
    selectedStartDate.value = toDate(dateRange.start);
    selectedEndDate.value = toDate(dateRange.end);
  }
};
</script>
