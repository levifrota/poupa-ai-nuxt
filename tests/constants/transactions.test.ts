// tests/constants/transactions.test.ts
import { describe, it, expect } from 'vitest'
import {
  TransactionType,
  TransactionCategory,
  TransactionPaymentMethod,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS
} from '@/constants/transactions'

describe('Transaction Constants', () => {
  it('should have all transaction types', () => {
    expect(TransactionType.DEPOSIT).toBe('DEPOSIT')
    expect(TransactionType.EXPENSE).toBe('EXPENSE')
    expect(TransactionType.INVESTMENT).toBe('INVESTMENT')
  })

  it('should have all categories', () => {
    expect(Object.values(TransactionCategory)).toHaveLength(9)
  })

  it('should have labels for all categories', () => {
    Object.values(TransactionCategory).forEach(category => {
      expect(TRANSACTION_CATEGORY_LABELS[category]).toBeDefined()
    })
  })

  it('should have labels for all payment methods', () => {
    Object.values(TransactionPaymentMethod).forEach(method => {
      expect(TRANSACTION_PAYMENT_METHOD_LABELS[method]).toBeDefined()
    })
  })
})