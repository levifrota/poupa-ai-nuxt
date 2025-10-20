// tests/components/LastTransactions.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { TransactionType } from '@/constants/transactions'

// Mocks
vi.mock('vuefire', () => ({
  useCurrentUser: vi.fn(() => ref({ uid: 'test-user' }))
}))

vi.mock('#app', () => ({
  useCookie: vi.fn(() => ref('dark'))
}))

// Importar stores após mocks
const { useTransactionsStore } = await import('@/stores/transactions')
const { useThemeStore } = await import('@/composables/useThemeStore')

// Mock manual do useThemeStore para componente
vi.mock('@/composables/useThemeStore', async () => {
  const actual = await vi.importActual('@/composables/useThemeStore')
  return {
    ...actual,
    useThemeStore: vi.fn(() => ({
      theme: 'dark'
    }))
  }
})

const LastTransactions = await import('@/components/LastTransactions.vue')

describe('LastTransactions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render transactions list', () => {
    const store = useTransactionsStore()
    store.setTransactions([
      {
        id: '1',
        name: 'Salário',
        amount: 5000,
        type: TransactionType.DEPOSIT,
        category: 'SALARY',
        paymentMethod: 'PIX',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1'
      }
    ])

    const wrapper = mount(LastTransactions.default, {
      global: {
        stubs: {
          Icon: true,
          CardHeader: true,
          CardTitle: true,
          CardContent: true,
          Button: true,
          NuxtLink: true,
          ScrollArea: true
        }
      }
    })
    
    expect(wrapper.text()).toContain('Salário')
  })

  it('should show correct color for expense', () => {
    const store = useTransactionsStore()
    store.setTransactions([
      {
        id: '1',
        name: 'Compra',
        amount: 100,
        type: TransactionType.EXPENSE,
        category: 'FOOD',
        paymentMethod: 'CREDIT_CARD',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1'
      }
    ])

    const wrapper = mount(LastTransactions.default, {
      global: {
        stubs: {
          Icon: true,
          CardHeader: true,
          CardTitle: true,
          CardContent: true,
          Button: true,
          NuxtLink: true,
          ScrollArea: true
        }
      }
    })
    
    expect(wrapper.html()).toContain('text-red-500')
  })

  it('should show correct prefix for deposit', () => {
    const store = useTransactionsStore()
    store.setTransactions([
      {
        id: '1',
        name: 'Salário',
        amount: 5000,
        type: TransactionType.DEPOSIT,
        category: 'SALARY',
        paymentMethod: 'PIX',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1'
      }
    ])

    const wrapper = mount(LastTransactions.default, {
      global: {
        stubs: {
          Icon: true,
          CardHeader: true,
          CardTitle: true,
          CardContent: true,
          Button: true,
          NuxtLink: true,
          ScrollArea: true
        }
      }
    })
    
    expect(wrapper.text()).toContain('+')
  })
})