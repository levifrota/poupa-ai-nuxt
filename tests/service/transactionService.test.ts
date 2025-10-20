// tests/service/transactionService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addTransaction, updateTransaction, deleteTransaction, getTransactions } from '@/service/transactionService'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'

vi.mock('firebase/firestore')
vi.mock('@/lib/firebase', () => ({
  db: vi.fn(() => ({}))
}))

describe('transactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add transaction', async () => {
    const mockDocRef = { id: 'newId' }
    vi.mocked(addDoc).mockResolvedValue(mockDocRef as any)

    const transactionData = {
      name: 'Test',
      amount: 100,
      type: 'DEPOSIT' as const,
      category: 'SALARY' as const,
      paymentMethod: 'PIX' as const,
      date: new Date()
    }

    const result = await addTransaction('userId', transactionData)
    
    expect(addDoc).toHaveBeenCalled()
    expect(result).toBe('newId')
  })

  it('should handle add transaction error', async () => {
    vi.mocked(addDoc).mockRejectedValue(new Error('Firebase error'))

    const transactionData = {
      name: 'Test',
      amount: 100,
      type: 'DEPOSIT' as const,
      category: 'SALARY' as const,
      paymentMethod: 'PIX' as const,
      date: new Date()
    }

    await expect(addTransaction('userId', transactionData)).rejects.toThrow()
  })

  it('should update transaction', async () => {
    vi.mocked(updateDoc).mockResolvedValue(undefined)

    await updateTransaction('userId', 'transactionId', {
      name: 'Updated'
    })
    
    expect(updateDoc).toHaveBeenCalled()
  })

  it('should delete transaction', async () => {
    vi.mocked(deleteDoc).mockResolvedValue(undefined)

    await deleteTransaction('userId', 'transactionId')
    
    expect(deleteDoc).toHaveBeenCalled()
  })
})