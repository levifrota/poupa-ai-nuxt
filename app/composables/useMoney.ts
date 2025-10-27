import { computed, type Ref } from 'vue'

export function useMoney(amount: Ref<number>) {
  const formatted = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount.value)
  })

  return {
    formatted,
  }
}
