import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction } from '@/constants/transactions'
import { TransactionType } from '@/constants/transactions'

export const useTransactionsStore = defineStore('transactions', () => {
  // Armazena as transações filtradas pelo TimeSelect
  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Atualiza as transações
  function setTransactions(newTransactions: Transaction[]) {
    transactions.value = newTransactions
  }

  // Define o estado de carregamento
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  // Define as mensagens de erro
  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  // Cálculos derivados para os valores financeiros
  const balance = computed(() => {
    return transactions.value.reduce((total, transaction) => {
      if (transaction.type === TransactionType.DEPOSIT) {
        return total + transaction.amount
      } else if (transaction.type === TransactionType.EXPENSE) {
        return total - transaction.amount
      } else {
        return total - transaction.amount // Investimentos também reduzem o saldo
      }
    }, 0)
  })

  const depositsTotal = computed(() => {
    return transactions.value
      .filter(t => t.type === TransactionType.DEPOSIT)
      .reduce((total, t) => total + t.amount, 0)
  })

  const expensesTotal = computed(() => {
    return transactions.value
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((total, t) => total + t.amount, 0)
  })

  const investmentsTotal = computed(() => {
    return transactions.value
      .filter(t => t.type === TransactionType.INVESTMENT)
      .reduce((total, t) => total + t.amount, 0)
  })

  // Cálculo das porcentagens por tipo
  const typesPercentage = computed(() => {
    const total = depositsTotal.value + expensesTotal.value + investmentsTotal.value
    if (total === 0) return { DEPOSIT: 0, EXPENSE: 0, INVESTMENT: 0 }
    
    return {
      DEPOSIT: Math.round((depositsTotal.value / total) * 100),
      EXPENSE: Math.round((expensesTotal.value / total) * 100),
      INVESTMENT: Math.round((investmentsTotal.value / total) * 100)
    }
  })

  // Retorna as últimas transações (limitadas a 10)
  const lastTransactions = computed(() => {
    return [...transactions.value]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10)
  })

  return {
    transactions,
    isLoading,
    error,
    setTransactions,
    setLoading,
    setError,
    balance,
    depositsTotal,
    expensesTotal,
    investmentsTotal,
    typesPercentage,
    lastTransactions
  }
})