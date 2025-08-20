import type { TransactionType, TransactionCategory, TransactionPaymentMethod } from '~/constants/transactions'

export interface Transaction {
  id: string
  name: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  paymentMethod: TransactionPaymentMethod
  date: string
  createdAt: string
}
