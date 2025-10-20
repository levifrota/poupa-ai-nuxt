// tests/stores/transactions.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionsStore } from '@/stores/transactions'
import { TransactionType } from '@/constants/transactions'
import type { Transaction } from '@/constants/transactions'

describe('useTransactionsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockTransaction: Transaction = {
    id: '1',
    name: 'Test Transaction',
    amount: 100,
    type: TransactionType.DEPOSIT,
    category: 'SALARY',
    paymentMethod: 'PIX',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1'
  }

  it('should initialize with empty state', () => {
    const store = useTransactionsStore()
    
    expect(store.transactions).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should calculate balance correctly', () => {
    const store = useTransactionsStore()
    
    store.setTransactions([
      { ...mockTransaction, type: TransactionType.DEPOSIT, amount: 1000 },
      { ...mockTransaction, type: TransactionType.EXPENSE, amount: 300 },
      { ...mockTransaction, type: TransactionType.INVESTMENT, amount: 200 }
    ])
    
    expect(store.balance).toBe(500) // 1000 - 300 - 200
  })

  it('should calculate deposits total', () => {
    const store = useTransactionsStore()
    
    store.setTransactions([
      { ...mockTransaction, type: TransactionType.DEPOSIT, amount: 1000 },
      { ...mockTransaction, type: TransactionType.DEPOSIT, amount: 500 },
      { ...mockTransaction, type: TransactionType.EXPENSE, amount: 300 }
    ])
    
    expect(store.depositsTotal).toBe(1500)
  })

  it('should calculate expenses total', () => {
    const store = useTransactionsStore()
    
    store.setTransactions([
      { ...mockTransaction, type: TransactionType.EXPENSE, amount: 200 },
      { ...mockTransaction, type: TransactionType.EXPENSE, amount: 300 },
      { ...mockTransaction, type: TransactionType.DEPOSIT, amount: 1000 }
    ])
    
    expect(store.expensesTotal).toBe(500)
  })

  it('should calculate investments total', () => {
    const store = useTransactionsStore()
    
    store.setTransactions([
      { ...mockTransaction, type: TransactionType.INVESTMENT, amount: 400 },
      { ...mockTransaction, type: TransactionType.INVESTMENT, amount: 600 }
    ])
    
    expect(store.investmentsTotal).toBe(1000)
  })

  it('should get last transactions', () => {
    const store = useTransactionsStore()
    const transactions = Array.from({ length: 15 }, (_, i) => ({
      ...mockTransaction,
      id: `${i}`,
      date: new Date(2024, 0, i + 1)
    }))
    
    store.setTransactions(transactions)
    
    expect(store.lastTransactions).toHaveLength(10)
  })

  it('should set loading state', () => {
    const store = useTransactionsStore()
    
    store.setLoading(true)
    expect(store.isLoading).toBe(true)
    
    store.setLoading(false)
    expect(store.isLoading).toBe(false)
  })

  it('should set error state', () => {
    const store = useTransactionsStore()
    
    store.setError('Test error')
    expect(store.error).toBe('Test error')
    
    store.setError(null)
    expect(store.error).toBeNull()
  })

  it('should delete transaction', () => {
    const store = useTransactionsStore()
    
    store.setTransactions([mockTransaction])
    expect(store.transactions).toHaveLength(1)
    
    store.deleteTransaction('1')
    expect(store.transactions).toHaveLength(0)
  })
})