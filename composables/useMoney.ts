import { computed, type Ref } from 'vue'
import { useCurrencyStore } from '~/stores/currency'
import { CurrencyCode, CURRENCY_LOCALE, CURRENCY_UNIT_LABELS } from '~/constants/currencies'

export function useMoney(amount: Ref<number>, options?: { convert?: boolean }) {
  const shouldConvert = options?.convert ?? true
  const currencyStore = useCurrencyStore()

  const currency = computed(() => (shouldConvert ? currencyStore.selectedCurrency : CurrencyCode.BRL))
  const convertedAmount = computed(() => (shouldConvert ? currencyStore.convert(amount.value) : amount.value))

  const formatted = computed(() => {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency.value], {
      style: 'currency',
      currency: currency.value,
    }).format(convertedAmount.value)
  })

  // Descrição por extenso para leitores de tela (ex: "R$ 1.234,56" -> "1234 reais e 56 centavos")
  const ariaLabel = computed(() => {
    const unitLabels = CURRENCY_UNIT_LABELS[currency.value]
    const isNegative = convertedAmount.value < 0
    const absoluteAmount = Math.abs(convertedAmount.value)
    const majorUnits = Math.floor(absoluteAmount)
    const minorUnits = Math.round((absoluteAmount - majorUnits) * 100)

    const majorLabel = `${majorUnits} ${majorUnits === 1 ? unitLabels.major.singular : unitLabels.major.plural}`
    const minorLabel =
      minorUnits > 0
        ? ` e ${minorUnits} ${minorUnits === 1 ? unitLabels.minor.singular : unitLabels.minor.plural}`
        : ''

    return `${isNegative ? 'menos ' : ''}${majorLabel}${minorLabel}`
  })

  return {
    formatted,
    ariaLabel,
  }
}
