<script setup lang="ts">
import { cn } from '@/lib/utils'

import {
  CalendarDate,
  type DateValue,
  isEqualMonth,
} from '@internationalized/date'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { type DateRange, RangeCalendarRoot, useDateFormatter } from 'reka-ui'
import { createMonth, type Grid, toDate } from 'reka-ui/date'
// import { type Ref, ref, watch, onMounted, computed } from 'vue'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
// import { useUserStore } from '@/stores/user'
import type { Transaction } from '@/constants/transactions'
import { useTransactionsStore } from '@/stores/transactions'
// import { useRoute, useRouter } from 'vue-router'

// Importar componentes UI necessários
import { Button, buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell } from '@/components/ui/range-calendar'

// Definir props e emits para o componente
const props = defineProps<{
  label?: string
  description?: string
}>()

const emit = defineEmits<{
  'update:dateRange': [dateRange: DateRange]
  'transactions-loaded': [transactions: Transaction[]]
}>()

// const userStore = useUserStore()

// Store para gerenciar as transações
const transactionsStore = useTransactionsStore()

// Acesso à rota e ao router para manipular os parâmetros da URL
const route = useRoute()
const router = useRouter()

// Referência local para facilitar o acesso aos dados da store
const isLoading = computed(() => transactionsStore.isLoading)
const error = computed(() => transactionsStore.error)

// Data atual para inicialização
const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

// Função para converter string para CalendarDate
const stringToCalendarDate = (dateString: string | null): CalendarDate | null => {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  } catch (e) {
    console.error('Erro ao converter data:', e)
    return null
  }
}

// Verificar se existem parâmetros na URL
const startFromUrl = stringToCalendarDate(route.query.start as string | null)
const endFromUrl = stringToCalendarDate(route.query.end as string | null)

// Inicializar com os valores da URL ou com o mês atual
const value = ref({
  start: startFromUrl || new CalendarDate(currentYear, currentMonth + 1, 1),
  end: endFromUrl || new CalendarDate(currentYear, currentMonth + 1, new Date(currentYear, currentMonth + 1, 0).getDate()),
}) as Ref<DateRange>

const locale = ref('pt-BR')
const formatter = useDateFormatter(locale.value, {
  month: 'long',
  year: 'numeric'
})

// ID único para acessibilidade
const calendarId = `calendar-${Math.random().toString(36).substring(2, 9)}`
const labelId = `calendar-label-${Math.random().toString(36).substring(2, 9)}`
const descriptionId = `calendar-description-${Math.random().toString(36).substring(2, 9)}`

const placeholder = ref(value.value.start) as Ref<DateValue>
const secondMonthPlaceholder = ref(value.value.end) as Ref<DateValue>

const firstMonth = ref(
  createMonth({
    dateObj: placeholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>
const secondMonth = ref(
  createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>

function updateMonth(reference: 'first' | 'second', months: number) {
  if (reference === 'first') {
    placeholder.value = placeholder.value.add({ months })
  }
  else {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months,
    })
  }
}

// Garantir que o locale seja aplicado em todos os componentes do calendário
watch(locale, (newLocale: string) => {
  // Atualizar o formatter não é necessário aqui, pois ele já está vinculado ao locale
  firstMonth.value = createMonth({
    dateObj: placeholder.value,
    locale: newLocale,
    fixedWeeks: true,
    weekStartsOn: 0,
  })
  secondMonth.value = createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: newLocale,
    fixedWeeks: true,
    weekStartsOn: 0,
  })
})

watch(placeholder, (_placeholder: DateValue) => {
  firstMonth.value = createMonth({
    dateObj: _placeholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months: 1,
    })
  }
})

watch(secondMonthPlaceholder, (_secondMonthPlaceholder: DateValue) => {
  secondMonth.value = createMonth({
    dateObj: _secondMonthPlaceholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
    placeholder.value = placeholder.value.subtract({ months: 1 })
})

// Função para buscar transações no intervalo de datas selecionado
async function fetchTransactions() {
  if (!value.value.start || !value.value.end) return

  try {
    transactionsStore.setLoading(true)
    transactionsStore.setError(null)

    const userId = "user_2rSVhqngUjGL0zVLiBXfXixKAG3"
    if (!userId) {
      transactionsStore.setError('Usuário não autenticado')
      return
    }

    // Converter datas do formato CalendarDate para Date do JavaScript
    const startDate = toDate(value.value.start)
    const endDate = toDate(value.value.end)

    // Adicionar um dia ao endDate para incluir o último dia na busca
    endDate.setDate(endDate.getDate() + 1)

    const transactionsQuery = query(
      collection(db(), 'users', userId, 'transactions'),
      where('date', '>=', startDate),
      where('date', '<', endDate),
      orderBy('date', 'desc')
    )

    const querySnapshot = await getDocs(transactionsQuery)

    // Mapear os documentos para objetos Transaction
    const fetchedTransactions = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
      } as Transaction
    })

    console.log('fetchedTransactions', fetchedTransactions);


    // Atualizar a store com as transações filtradas
    transactionsStore.setTransactions(fetchedTransactions)

    // Emitir evento com as transações carregadas
    emit('transactions-loaded', fetchedTransactions)
  } catch (err) {
    console.error('Erro ao buscar transações:', err)
    transactionsStore.setError('Erro ao buscar transações. Tente novamente mais tarde.')
  } finally {
    transactionsStore.setLoading(false)
  }
}

// Função para atualizar os parâmetros da URL
const updateUrlParams = (dateRange: DateRange) => {
  if (!dateRange.start || !dateRange.end) return

  const startDate = toDate(dateRange.start)
  const endDate = toDate(dateRange.end)

  // Atualizar a URL sem recarregar a página
  router.replace({
    query: {
      ...route.query,
      start: startDate.toISOString(),
      end: endDate.toISOString()
    }
  })
}

// Observar mudanças no intervalo de datas
watch(() => value.value, (newValue) => {
  if (newValue.start && newValue.end) {
    // Emitir evento de atualização do intervalo de datas
    emit('update:dateRange', newValue)
    // Atualizar parâmetros na URL
    updateUrlParams(newValue)
    // Buscar transações com o novo intervalo
    fetchTransactions()
  }
}, { deep: true })

// Buscar transações ao montar o componente
onMounted(() => {
  // Se houver parâmetros na URL, usar esses valores
  if (route.query.start && route.query.end) {
    const startDate = stringToCalendarDate(route.query.start as string)
    const endDate = stringToCalendarDate(route.query.end as string)

    if (startDate && endDate) {
      value.value = {
        start: startDate,
        end: endDate
      }
    }
  }

  fetchTransactions()
})

// Formatação para exibição do intervalo de datas
const formattedDateRange = computed(() => {
  if (!value.value.start) return 'Selecione uma data'

  const startFormatted = formatter.custom(toDate(value.value.start), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  if (!value.value.end) return startFormatted

  const endFormatted = formatter.custom(toDate(value.value.end), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return `${startFormatted} - ${endFormatted}`
})
</script>

<template>
  <div>
    <!-- Mensagem de erro, se houver -->
    <div v-if="error" role="alert" class="text-red-500 mb-2">{{ error }}</div>

    <!-- Indicador de carregamento -->
    <div v-if="isLoading" role="status" aria-live="polite" class="mb-2">
      <span class="sr-only">Carregando transações...</span>
      <span aria-hidden="true">Carregando...</span>
    </div>

    <Popover>
      <PopoverTrigger as-child>
        <Button
          :id="calendarId"
          variant="outline"
          :aria-labelledby="labelId"
          :aria-describedby="descriptionId"
          :class="
            cn(
              'w-[280px] justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )
          "
          aria-haspopup="dialog"
        >
          <span :id="labelId" class="sr-only">{{
            props.label || "Seletor de período"
          }}</span>
          <span :id="descriptionId" class="sr-only">{{
            props.description || "Selecione um intervalo de datas para filtrar transações"
          }}</span>

          <Calendar class="mr-2 h-4 w-4" aria-hidden="true" />
          {{ formattedDateRange }}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        class="w-auto p-0"
        role="dialog"
        aria-modal="true"
        aria-label="Seletor de período"
      >
        <RangeCalendarRoot
          v-slot="{ weekDays }"
          v-model="value"
          v-model:placeholder="placeholder"
          class="p-3"
        >
          <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <button
                  :class="
                    cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                    )
                  "
                  aria-label="Mês anterior"
                  @click="updateMonth('first', -1)"
                >
                  <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                </button>
                <div :class="cn('text-sm font-medium')" role="heading" aria-level="2">
                  {{ formatter.fullMonthAndYear(toDate(firstMonth.value)) }}
                </div>
                <button
                  :class="
                    cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                    )
                  "
                  aria-label="Próximo mês"
                  @click="updateMonth('first', 1)"
                >
                  <ChevronRight class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <RangeCalendarGrid role="grid" aria-labelledby="calendar-grid-label-1">
                <span id="calendar-grid-label-1" class="sr-only"
                  >Calendário para selecionar data inicial</span
                >
                <RangeCalendarGridHead>
                  <RangeCalendarGridRow role="row">
                    <RangeCalendarHeadCell
                      v-for="day in weekDays"
                      :key="day"
                      class="w-full"
                      role="columnheader"
                      scope="col"
                    >
                      {{ day }}
                    </RangeCalendarHeadCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridHead>
                <RangeCalendarGridBody>
                  <RangeCalendarGridRow
                    v-for="(weekDates, index) in firstMonth.rows"
                    :key="`weekDate-${index}`"
                    class="mt-2 w-full"
                    role="row"
                  >
                    <RangeCalendarCell
                      v-for="weekDate in weekDates"
                      :key="weekDate.toString()"
                      :date="weekDate"
                      role="gridcell"
                    >
                      <RangeCalendarCellTrigger
                        :day="weekDate"
                        :month="firstMonth.value"
                        aria-label="Selecionar data"
                      />
                    </RangeCalendarCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridBody>
              </RangeCalendarGrid>
            </div>
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <button
                  :class="
                    cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                    )
                  "
                  aria-label="Mês anterior"
                  @click="updateMonth('second', -1)"
                >
                  <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                </button>
                <div :class="cn('text-sm font-medium')" role="heading" aria-level="2">
                  {{ formatter.fullMonthAndYear(toDate(secondMonth.value)) }}
                </div>

                <button
                  :class="
                    cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                    )
                  "
                  aria-label="Próximo mês"
                  @click="updateMonth('second', 1)"
                >
                  <ChevronRight class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <RangeCalendarGrid role="grid" aria-labelledby="calendar-grid-label-2">
                <span id="calendar-grid-label-2" class="sr-only"
                  >Calendário para selecionar data final</span
                >
                <RangeCalendarGridHead>
                  <RangeCalendarGridRow role="row">
                    <RangeCalendarHeadCell
                      v-for="day in weekDays"
                      :key="day"
                      class="w-full"
                      role="columnheader"
                      scope="col"
                    >
                      {{ day }}
                    </RangeCalendarHeadCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridHead>
                <RangeCalendarGridBody>
                  <RangeCalendarGridRow
                    v-for="(weekDates, index) in secondMonth.rows"
                    :key="`weekDate-${index}`"
                    class="mt-2 w-full"
                    role="row"
                  >
                    <RangeCalendarCell
                      v-for="weekDate in weekDates"
                      :key="weekDate.toString()"
                      :date="weekDate"
                      role="gridcell"
                    >
                      <RangeCalendarCellTrigger
                        :day="weekDate"
                        :month="secondMonth.value"
                        aria-label="Selecionar data"
                      />
                    </RangeCalendarCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridBody>
              </RangeCalendarGrid>
            </div>
          </div>

          <!-- Status da seleção para leitores de tela -->
          <div aria-live="polite" class="sr-only">
            {{ formattedDateRange }}
          </div>
        </RangeCalendarRoot>
      </PopoverContent>
    </Popover>
  </div>
</template>
