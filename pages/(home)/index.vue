<template>
  <ScrollArea class="m-0 mt-0 flex flex-col sm:m-0 sm:overflow-hidden sm:p-6">
    <div class="m-3 flex flex-col justify-between sm:flex-row">
      <h1 class="self-center py-2 text-2xl font-bold sm:self-auto md:py-0">Painel</h1>

      <div
        class="flex flex-wrap flex-row items-center justify-center gap-3 sm:justify-normal"
      >
        <TimeSelect />
        <AiReportButton />
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

// const month = 3; // Março
// const loading = ref(false);
// const dashboard = ref<unknown>(null);
// const error = ref("");

// const loadDashboard = async () => {
//   loading.value = true;
//   error.value = "";
//   try {
//     const result = await getDashboard(month.toString());
//     dashboard.value = result;
//   } catch (err: unknown) {
//     error.value = "Erro ao buscar dashboard";
//     console.error(err);
//   } finally {
//     loading.value = false;
//   }
// };
// import { useUser } from '@clerk/vue'
// import { ScrollArea } from '#components';
// import { getDashboard } from "~/data/get-dashboard/index";

// const route = useRoute();
// const { user } = useUser();

// const month = ref(route.query.month || new Date().getMonth() + 1);
// const dashboard = ref(null);
// const userCanAddTransaction = ref(false);

// onMounted(async () => {
//   if (!user.value) {
//     return navigateTo('/login');
//   }

//   if (typeof window !== 'undefined') {
//     localStorage.setItem('userId', user.value.id);
//   }

//   dashboard.value = await getDashboard(month.value);
//   userCanAddTransaction.value = await canUserAddTransaction();
// });

// watch(() => route.query.month, async (newMonth) => {
//   if (newMonth) {
//     month.value = newMonth;
//     dashboard.value = await getDashboard(month.value);
//   script});
</script>
