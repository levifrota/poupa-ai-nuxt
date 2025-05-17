<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, SortingState } from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel, // Importar para funcionalidade de filtro/busca
  useVueTable,
} from "@tanstack/vue-table";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string; // Chave para buscar (ex: 'description')
}>();

const sorting = ref<SortingState>([{ id: "date", desc: true }]); // Ordenar por data, mais novas primeiro
const globalFilter = ref(""); // Para a funcionalidade de busca global

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // Habilitar filtro
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return globalFilter.value;
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting.value)
        : updaterOrValue;
  },
  onGlobalFilterChange: (updaterOrValue) => {
    globalFilter.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(globalFilter.value)
        : updaterOrValue;
  },
  // Configuração para busca global (se searchKey não for especificado, busca em todas as colunas)
  // Se props.searchKey for fornecido, podemos configurar o filtro para uma coluna específica
  // globalFilterFn: // Pode ser customizado se necessário
});
</script>

<template>
  <div>
    <!-- Input de Busca -->
    <div class="flex items-center py-4">
      <Input
        class="max-w-sm"
        placeholder="Buscar transações..."
        :model-value="globalFilter"
        @update:model-value="table.setGlobalFilter($event)"
      />
    </div>
    <!-- Tabela -->
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
