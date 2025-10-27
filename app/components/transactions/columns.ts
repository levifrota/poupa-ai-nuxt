import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { storeToRefs } from "pinia";
import { useNuxtApp } from '#app'
import Button from '@/components/ui/button/Button.vue'
import { TRANSACTION_TYPE_OPTIONS, TRANSACTION_PAYMENT_METHOD_LABELS, type TransactionType, type TransactionPaymentMethod } from '~/constants/transactions.js'

export interface Transaction {
  id: string;
  date: Date;
  name: string;
  category: string;
  amount: number;
  type: 'DEPOSIT' | 'EXPENSE' | 'INVESTMENT'; 
  paymentMethod: string;
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
    accessorKey: 'name',
    header: () => h('div', {}, 'Nome'),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
  },
  {
    accessorKey: 'type',
    header: () => h('div', {}, 'Tipo'),
    cell: ({ row }) => {
      const type = row.getValue('type') as TransactionType;      
      const label = TRANSACTION_TYPE_OPTIONS.find((opt: { value: TransactionType; label: string }) => opt.value === type)?.label || type;
      
      let typeClass = '';
      const themeStore = useThemeStore();
      const { theme } = storeToRefs(themeStore);

      if (theme.value === 'protanopia' || theme.value === 'deuteranopia') {
        typeClass = type === 'EXPENSE' ? 'text-amber-600 dark:text-amber-400' : 
          type === 'DEPOSIT' ? 'text-sky-600 dark:text-sky-400' : 
          'text-purple-600 dark:text-purple-400';
      } else {
        typeClass = type === 'EXPENSE' ? 'text-red-600 dark:text-red-400' : 
          type === 'DEPOSIT' ? 'text-green-600 dark:text-green-400' : 
          'text-blue-600 dark:text-blue-400';
      }

      return h('div', { class: `font-medium ${typeClass}` }, label);
    },
  },
  {
    accessorKey: 'category',
    header: () => h('div', {}, 'Categoria'),
    cell: ({ row }) => h('div', {}, row.getValue('category')),
  },
  {
    accessorKey: 'paymentMethod',
    header: () => h('div', {}, 'Método de Pagamento'),
    cell: ({ row }) => {
      const paymentMethod = row.getValue('paymentMethod') as TransactionPaymentMethod;
      const label = TRANSACTION_PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;
      return h('div', { class: 'text-sm text-muted-foreground' }, label);
    },
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Valor'),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = formatCurrency(amount)

      const { $pinia } = useNuxtApp();
      const themeStore = useThemeStore($pinia);
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
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Ações'),
    cell: ({ row }) => {
      const transaction = row.original;
      
      return h('div', { class: 'flex items-center justify-center gap-2' }, [
        // Botão de Editar
        h(Button, {
          variant: 'ghost',
          size: 'sm',
          onClick: () => {
            const event = new CustomEvent('edit-transaction', { 
              detail: { transaction } 
            });
            window.dispatchEvent(event);
          },
          'aria-label': `Editar transação ${transaction.name}`,
          class: 'h-8 w-8 p-0 hover:bg-muted'
        }, [
          h('svg', {
            class: 'h-4 w-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            xmlns: 'http://www.w3.org/2000/svg'
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
            })
          ])
        ]),
        
        // Botão de Excluir
        h(Button, {
          variant: 'ghost',
          size: 'sm',
          onClick: () => {
            const event = new CustomEvent('delete-transaction', { 
              detail: { transaction } 
            });
            window.dispatchEvent(event);
          },
          'aria-label': `Excluir transação ${transaction.name}`,
          class: 'h-8 w-8 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive'
        }, [
          h('svg', {
            class: 'h-4 w-4',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            xmlns: 'http://www.w3.org/2000/svg'
          }, [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '2',
              d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            })
          ])
        ])
      ]);
    },
  }
]