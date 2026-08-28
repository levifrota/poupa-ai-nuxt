<script setup lang="ts" generic="TData, TValue">
import { computed, ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import type { ColumnDef } from "@tanstack/vue-table";
import type { Transaction } from "~/components/transactions/columns";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}>();

const search = ref("");

// Breakpoint alinhado ao "lg" do Tailwind (1024px): abaixo disso exibimos
// os cards otimizados para toque em vez da tabela.
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 1024);

function matchesSearch(item: TData, term: string): boolean {
  if (!term) return true;
  const normalizedTerm = term.toLowerCase();

  return Object.values(item as Record<string, unknown>).some((value) => {
    if (value === null || value === undefined) return false;
    if (value instanceof Date) {
      return value.toLocaleDateString("pt-BR").includes(normalizedTerm);
    }
    if (Array.isArray(value)) {
      return value.some((entry) => String(entry).toLowerCase().includes(normalizedTerm));
    }
    return String(value).toLowerCase().includes(normalizedTerm);
  });
}

// Filtro compartilhado entre a tabela (desktop) e os cards (mobile), para
// que ambas as visualizações mostrem sempre o mesmo resultado de busca.
const filteredData = computed(() => props.data.filter((item) => matchesSearch(item, search.value)));

// A visualização em cards é usada apenas com o formato de Transaction
// definido em columns.ts (único consumidor deste componente).
const mobileTransactions = computed(() => filteredData.value as unknown as Transaction[]);
</script>

<template>
  <div>
    <!-- Input de Busca -->
    <div class="flex items-center py-4">
      <label for="search-transactions" class="sr-only">Buscar transações</label>
      <Input
        id="search-transactions"
        v-model="search"
        class="max-w-sm"
        placeholder="Buscar transações..."
      />
    </div>

    <!-- Tabela (desktop) -->
    <TransactionsTable
      v-if="!isMobile"
      :columns="columns"
      :data="filteredData"
    />

    <!-- Cards (mobile) -->
    <div
      v-else
      role="list"
      aria-label="Lista de transações"
    >
      <TransactionCard
        v-for="transaction in mobileTransactions"
        :key="transaction.id"
        :transaction="transaction"
      />
      <p v-if="!mobileTransactions.length" role="status" class="py-8 text-sm text-center text-muted-foreground">
        Nenhuma transação encontrada.
      </p>
    </div>
  </div>
</template>
