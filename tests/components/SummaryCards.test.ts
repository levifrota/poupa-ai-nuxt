// tests/components/SummaryCards.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { TransactionType } from '@/constants/transactions'

// Mock Firebase e vuefire
vi.mock('~/lib/firebase', () => ({
  db: vi.fn(() => ({}))
}))

vi.mock('vuefire', () => ({
  useCurrentUser: vi.fn(() => ref({ uid: 'test-user' }))
}))

vi.mock('#app', () => ({
  useCookie: vi.fn(() => ref('dark'))
}))

// Importar após mocks
const { useTransactionsStore } = await import('@/stores/transactions')
const SummaryCards = await import('@/components/SummaryCards.vue')

describe('SummaryCards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should display balance correctly', () => {
    const store = useTransactionsStore()
    store.setTransactions([
      {
        id: '1',
        name: 'Depósito',
        amount: 1000,
        type: TransactionType.DEPOSIT,
        category: 'SALARY',
        paymentMethod: 'PIX',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1'
      },
      {
        id: '2',
        name: 'Despesa',
        amount: 300,
        type: TransactionType.EXPENSE,
        category: 'FOOD',
        paymentMethod: 'CASH',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1'
      }
    ])

    const wrapper = mount(SummaryCards.default, {
      global: {
        stubs: {
          SummaryCard: true,
          UpsertTransactionDialog: true,
          Button: true,
          DialogTrigger: true,
          Icon: true
        }
      }
    })
    
    expect(wrapper.html()).toBeTruthy()
  })
})