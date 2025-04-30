<template>
  <ScrollArea class="m-0 mt-0 flex flex-col sm:m-0 sm:overflow-hidden sm:p-6">
    <div class="m-3 flex flex-col sm:m-0 sm:overflow-hidden sm:p-6">
      <h1 class="self-center py-2 text-2xl font-bold sm:self-auto md:py-0">Painel</h1>

      <div class="flex flex-row items-center justify-between gap-3 sm:justify-normal">
        <Button variant="outline"> <Icon name="lucide:bot" /> Relatório IA </Button>
      </div>
    </div>

    <div class="grid grid-cols-[2fr,-1fr] gap-6 sm:overflow-hidden lg:grid-cols-[2fr,1fr]">
      <div class="flex flex-col gap-6 sm:overflow-hidden">
        <!-- Inserir SummaryCards -->

        <div class="grid grid-cols-1 gap-y-6 sm:h-auto sm:grid-rows-1 sm:gap-y-6 md:grid-cols-3 md:gap-6">
          <!-- Inserir TransactionsPieChart e ExpensesPerCategory -->
        </div>
      </div>

      <!-- Inserir LastTransactions -->
    </div>

  </ScrollArea>
</template>

<script setup lang="ts">
// import { ref } from "#imports";
// import { getDashboard } from "~/data/get-dashboard";

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
</script>
