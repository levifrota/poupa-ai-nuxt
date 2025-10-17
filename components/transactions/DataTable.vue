<script setup lang="ts">
import { ref, computed } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import Table from "./Table.vue";
import TransactionCard from "./TransactionCard.vue";
import { useWindowSize } from "./windowSize"; // seu composable para detectar largura

// Props que virão da API
const props = defineProps<{
  data: any[]; // dados da API
  columns: ColumnDef<any>[]; // estrutura da tabela
}>();

// Campo de busca
const search = ref("");
// Computed para filtrar os dados da API
const filteredData = computed(() => {
  if (!search.value) return props.data ?? [];
  const q = search.value.toLowerCase();
  return (props.data ?? []).filter(item =>
    Object.values(item).some(v => String(v ?? "").toLowerCase().includes(q))
  );
});

// Responsividade
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 1025);

// Referência para tabela (opcional)
const tableRef = ref<InstanceType<typeof Table> | null>(null);
</script>

<template>
  <div class="p-6 space-y-4">
    <!-- Input de busca -->
    <input
      type="text"
      placeholder="Buscar transações..."
      class="w-full max-w-sm px-3 py-2 border rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      v-model="search"
    />

    <!-- Desktop: tabela -->
    <Table
      v-if="!isMobile"
      ref="tableRef"
      :columns="columns"
      :data="filteredData"
    />

    <!-- Mobile: cards -->
    <div v-else class="grid gap-4">
      <TransactionCard
        v-for="(item, index) in [...filteredData].reverse()"
        :key="index"
        v-bind="item"
      />
      <div v-if="filteredData.length === 0" class="text-center text-gray-500">
        Nenhum item para mostrar.
      </div>
    </div>
  </div>
</template>
