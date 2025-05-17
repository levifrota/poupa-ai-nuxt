import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { storeToRefs } from "pinia";

// Definindo a interface Transaction aqui temporariamente.
// Idealmente, ela viria de um arquivo de tipos compartilhado.
export interface Transaction {
  id: string;
  date: Date; // Formato YYYY-MM-DD para facilitar a ordenação
  description: string;
  category: string;
  amount: number;
  // Adicionar outros campos de mockupData.json conforme necessário
  // type: 'DEPOSIT' | 'EXPENSE' | 'INVESTMENT'; 
  // paymentMethod: string;
}

const formatDate = (dateInput: Date | string) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: () => h('div', {}, 'Data'),
    cell: ({ row }) => h('div', {}, formatDate(row.getValue('date'))),
  },
  {
    accessorKey: 'description',
    header: () => h('div', {}, 'Descrição'),
    cell: ({ row }) => h('div', {}, row.getValue('description')),
  },
  {
    accessorKey: 'category',
    header: () => h('div', {}, 'Categoria'),
    cell: ({ row }) => h('div', {}, row.getValue('category')),
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Valor'),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = formatCurrency(amount)

      const themeStore = useThemeStore();
      const { theme } = storeToRefs(themeStore);
      
      let amountClass = ''

      if (theme.value === 'protanopia' || theme.value === 'deuteranopia') {
        amountClass = amount < 0 ? 'text-amber-600 dark:text-amber-400' : 'text-sky-600 dark:text-sky-400';
      } else {
        amountClass = amount < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400';
      }

      return h('div', { class: `text-right font-medium ${amountClass}` }, formatted)
    },
  },
]