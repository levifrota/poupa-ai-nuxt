import { computed, type Ref } from 'vue'

export function useMoney(amount: Ref<number>) {
  const formatted = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount.value)
  })

  // Descrição por extenso para leitores de tela (ex: "R$ 1.234,56" -> "1234 reais e 56 centavos")
  const ariaLabel = computed(() => {
    const isNegative = amount.value < 0
    const absoluteAmount = Math.abs(amount.value)
    const reais = Math.floor(absoluteAmount)
    const centavos = Math.round((absoluteAmount - reais) * 100)

    const reaisLabel = `${reais} ${reais === 1 ? 'real' : 'reais'}`
    const centavosLabel =
      centavos > 0 ? ` e ${centavos} ${centavos === 1 ? 'centavo' : 'centavos'}` : ''

    return `${isNegative ? 'menos ' : ''}${reaisLabel}${centavosLabel}`
  })

  return {
    formatted,
    ariaLabel,
  }
}
