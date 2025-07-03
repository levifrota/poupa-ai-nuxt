<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useI18n } from '#imports'
import {
  CalendarDate,
  type DateValue,
  isEqualMonth,
} from '@internationalized/date'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { type DateRange, RangeCalendarRoot, useDateFormatter } from 'reka-ui'
import { createMonth, type Grid, toDate } from 'reka-ui/date'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Transaction } from '@/constants/transactions'
import { useTransactionsStore } from '@/stores/transactions'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell } from '@/components/ui/range-calendar'
import { Calendar as CalendarIcon } from 'lucide-vue-next';

const { t, locale } = useI18n();

const props = defineProps<{
  label?: string
  description?: string
}>()

const emit = defineEmits<{
  'update:dateRange': [dateRange: DateRange]
  'transactions-loaded': [transactions: Transaction[]]
}>()

const transactionsStore = useTransactionsStore()
const route = useRoute()
const router = useRouter()

const isLoading = computed(() => transactionsStore.isLoading)
const error = computed(() => transactionsStore.error)

const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const stringToCalendarDate = (dateString: string | null): CalendarDate | null => {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
  } catch (e) {
    console.error(t('error_converting_date'), e)
    return null
  }
}

const startFromUrl = stringToCalendarDate(route.query.start as string | null)
const endFromUrl = stringToCalendarDate(route.query.end as string | null)

const value = ref<DateRange>({
  start: startFromUrl || new CalendarDate(currentYear, currentMonth + 1, 1),
  end: endFromUrl || new CalendarDate(currentYear, currentMonth + 1, new Date(currentYear, currentMonth + 1, 0).getDate()),
})

// These are the correct definitions in the setup scope
const monthYearFormatter = useDateFormatter(locale, {
  month: 'long',
  year: 'numeric'
})

const dateRangeDisplayFormatter = useDateFormatter(locale, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const calendarId = `calendar-${Math.random().toString(36).substring(2, 9)}`
const labelId = `calendar-label-${Math.random().toString(36).substring(2, 9)}`
const descriptionId = `calendar-description-${Math.random().toString(36).substring(2, 9)}`

const placeholder = ref<DateValue>(value.value.start)
const secondMonthPlaceholder = ref<DateValue>(value.value.end)

const firstMonth = ref<Grid<DateValue>>(
  createMonth({
    dateObj: placeholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
)
const secondMonth = ref<Grid<DateValue>>(
  createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
)

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

watch(locale, (newLocale) => {
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

watch(placeholder, (_placeholder) => {
  firstMonth.value = createMonth({
    dateObj: _placeholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({ months: 1 })
  }
})

watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
  secondMonth.value = createMonth({
    dateObj: _secondMonthPlaceholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
    placeholder.value = placeholder.value.subtract({ months: 1 })
})

async function fetchTransactions() {
  if (!value.value.start || !value.value.end) return

  try {
    transactionsStore.setLoading(true)
    transactionsStore.setError(null)
    const userId = "user_2rSVhqngUjGL0zVLiBXfXixKAG3" // FIXME: Hardcoded User ID
    if (!userId) {
      transactionsStore.setError(t('error_user_not_authenticated'))
      return
    }
    const startDate = toDate(value.value.start)
    const endDate = toDate(value.value.end)
    endDate.setDate(endDate.getDate() + 1)
    const transactionsQuery = query(
      collection(db(), 'users', userId, 'transactions'),
      where('date', '>=', startDate),
      where('date', '<', endDate),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(transactionsQuery)
    const fetchedTransactions = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return { id: doc.id, ...data, date: data.date?.toDate() || new Date() } as Transaction
    })
    transactionsStore.setTransactions(fetchedTransactions)
    emit('transactions-loaded', fetchedTransactions)
  } catch (err) {
    console.error(t('error_fetching_transactions_console'), err)
    transactionsStore.setError(t('error_fetching_transactions_user'))
  } finally {
    transactionsStore.setLoading(false)
  }
}

const updateUrlParams = (dateRange: DateRange) => {
  if (!dateRange.start || !dateRange.end) return
  const startDate = toDate(dateRange.start)
  const endDate = toDate(dateRange.end)
  router.replace({
    query: { ...route.query, start: startDate.toISOString(), end: endDate.toISOString() }
  })
}

watch(() => value.value, (newValue) => {
  if (newValue.start && newValue.end) {
    emit('update:dateRange', newValue)
    updateUrlParams(newValue)
    fetchTransactions()
  }
}, { deep: true })

onMounted(() => {
  if (route.query.start && route.query.end) {
    const startDate = stringToCalendarDate(route.query.start as string)
    const endDate = stringToCalendarDate(route.query.end as string)
    if (startDate && endDate) {
      value.value = { start: startDate, end: endDate }
    }
  }
  fetchTransactions()
})

const formattedDateRange = computed(() => {
  if (!value.value.start) return t('select_date_placeholder');

  // Correctly access .value on the ref returned by useDateFormatter
  const formatter = dateRangeDisplayFormatter.value;

  if (!formatter || typeof formatter.format !== 'function') {
    console.error("dateRangeDisplayFormatter.value is not available or its format method is not a function");
    return "Invalid Date";
  }

  const startFormatted = formatter.format(toDate(value.value.start));
  if (!value.value.end) return startFormatted;
  const endFormatted = formatter.format(toDate(value.value.end));
  return `${startFormatted} - ${endFormatted}`;
});

const formatMonthYearForHeader = (dateValue: DateValue) => {
  // Correctly access .value on the ref returned by useDateFormatter
  const formatter = monthYearFormatter.value;
  if (!formatter || typeof formatter.format !== 'function') {
     console.error("monthYearFormatter.value is not available or its format method is not a function");
    return "Invalid Month";
  }
  return formatter.format(toDate(dateValue));
}

</script>

<template>
  <div>
    <div v-if="error" role="alert" class="text-red-500 mb-2">{{ error }}</div>
    <div v-if="isLoading" role="status" aria-live="polite" class="mb-2">
      <span class="sr-only">{{ t('loading_transactions_sr') }}</span>
      <span aria-hidden="true">{{ t('loading_aria_hidden') }}</span>
    </div>

    <Popover>
      <PopoverTrigger as-child>
        <Button
          :id="calendarId"
          variant="outline"
          :aria-labelledby="labelId"
          :aria-describedby="descriptionId"
          :class="cn('w-[280px] justify-start text-left font-normal', !value.start && 'text-muted-foreground')"
          aria-haspopup="dialog"
        >
          <span :id="labelId" class="sr-only">{{ props.label || t('date_range_picker_label') }}</span>
          <span :id="descriptionId" class="sr-only">{{ props.description || t('date_range_picker_description') }}</span>
          <CalendarIcon class="mr-2 h-4 w-4" aria-hidden="true" />
          {{ formattedDateRange }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" role="dialog" aria-modal="true" :aria-label="t('date_range_picker_label')">
        <RangeCalendarRoot v-slot="{ weekDays }" v-model="value" v-model:placeholder="placeholder" class="p-3">
          <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <Button
                  variant="outline"
                  :class="cn('h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100')"
                  :aria-label="t('previous_month')"
                  @click="updateMonth('first', -1)"
                >
                  <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                </Button>
                <div :class="cn('text-sm font-medium')" role="heading" aria-level="2">
                  {{ formatMonthYearForHeader(firstMonth.dateObj) }}
                </div>
                <Button
                  variant="outline"
                  :class="cn('h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100')"
                  :aria-label="t('next_month')"
                  @click="updateMonth('first', 1)"
                >
                  <ChevronRight class="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <RangeCalendarGrid role="grid" :aria-labelledby="'calendar-grid-label-1-' + calendarId">
                <span :id="'calendar-grid-label-1-' + calendarId" class="sr-only">{{ t('calendar_start_date') }}</span>
                <RangeCalendarGridHead>
                  <RangeCalendarGridRow role="row">
                    <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="w-full" role="columnheader" scope="col">
                      {{ day }}
                    </RangeCalendarHeadCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridHead>
                <RangeCalendarGridBody>
                  <RangeCalendarGridRow v-for="(weekDates, index) in firstMonth.rows" :key="`weekDate-${index}`" class="mt-2 w-full" role="row">
                    <RangeCalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate" role="gridcell">
                      <RangeCalendarCellTrigger :day="weekDate" :month="firstMonth.dateObj" :aria-label="t('select_date_aria_label', { date: weekDate.day })" />
                    </RangeCalendarCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridBody>
              </RangeCalendarGrid>
            </div>
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <Button
                  variant="outline"
                  :class="cn('h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100')"
                  :aria-label="t('previous_month')"
                  @click="updateMonth('second', -1)"
                >
                  <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                </Button>
                <div :class="cn('text-sm font-medium')" role="heading" aria-level="2">
                   {{ formatMonthYearForHeader(secondMonth.dateObj) }}
                </div>
                <Button
                  variant="outline"
                  :class="cn('h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100')"
                  :aria-label="t('next_month')"
                  @click="updateMonth('second', 1)"
                >
                  <ChevronRight class="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <RangeCalendarGrid role="grid" :aria-labelledby="'calendar-grid-label-2-' + calendarId">
                <span :id="'calendar-grid-label-2-' + calendarId" class="sr-only">{{ t('calendar_end_date') }}</span>
                <RangeCalendarGridHead>
                  <RangeCalendarGridRow role="row">
                    <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="w-full" role="columnheader" scope="col">
                      {{ day }}
                    </RangeCalendarHeadCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridHead>
                <RangeCalendarGridBody>
                  <RangeCalendarGridRow v-for="(weekDates, index) in secondMonth.rows" :key="`weekDate-${index}`" class="mt-2 w-full" role="row">
                    <RangeCalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate" role="gridcell">
                      <RangeCalendarCellTrigger :day="weekDate" :month="secondMonth.dateObj" :aria-label="t('select_date_aria_label', { date: weekDate.day })" />
                    </RangeCalendarCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridBody>
              </RangeCalendarGrid>
            </div>
          </div>
          <div aria-live="polite" class="sr-only">
            {{ formattedDateRange }}
          </div>
        </RangeCalendarRoot>
      </PopoverContent>
    </Popover>
  </div>
</template>
