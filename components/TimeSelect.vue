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
import { type DateRange, RangeCalendarRoot, useDateFormatter, type DateFormatter } from 'reka-ui'
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

const initialStartDate = stringToCalendarDate(route.query.start as string | null) || new CalendarDate(currentYear, currentMonth + 1, 1);
const initialEndDate = stringToCalendarDate(route.query.end as string | null) || new CalendarDate(currentYear, currentMonth + 1, new Date(currentYear, currentMonth + 1, 0).getDate());

const value = ref<DateRange>({
  start: initialStartDate,
  end: initialEndDate,
})

const getSafeFormatter = (options: Intl.DateTimeFormatOptions): Ref<DateFormatter | null> => {
  return computed(() => {
    if (typeof locale.value === 'string' && locale.value) {
      try {
        return useDateFormatter(locale.value, options);
      } catch (e) {
        console.error(`Error creating DateFormatter with locale '${locale.value}' for options ${JSON.stringify(options)}:`, e);
        return ref(null);
      }
    }
    // console.warn('Locale is not ready for DateFormatter, options:', JSON.stringify(options));
    return ref(null);
  });
};

const monthYearFormatterRef = getSafeFormatter({ month: 'long', year: 'numeric' });
const dateRangeDisplayFormatterRef = getSafeFormatter({ day: '2-digit', month: '2-digit', year: 'numeric' });

const calendarId = `calendar-${Math.random().toString(36).substring(2, 9)}`
const labelId = `calendar-label-${Math.random().toString(36).substring(2, 9)}`
const descriptionId = `calendar-description-${Math.random().toString(36).substring(2, 9)}`

const placeholder = ref<DateValue>(initialStartDate);
let P = initialStartDate;
if (initialStartDate.month === initialEndDate.month && initialStartDate.year === initialEndDate.year) {
 P = initialEndDate.add({ months: 1 });
} else {
 P = initialEndDate;
}
const secondMonthPlaceholder = ref<DateValue>(P);


const firstMonth = ref<Grid<DateValue> | null>(null);
const secondMonth = ref<Grid<DateValue> | null>(null);

const updateCalendarMonths = (currentLocale: string) => {
  if (!placeholder.value || !secondMonthPlaceholder.value || !currentLocale) {
    // console.warn('updateCalendarMonths: Not enough data to create months. Locale:', currentLocale, 'Placeholder1:', placeholder.value, 'Placeholder2:', secondMonthPlaceholder.value);
    firstMonth.value = null;
    secondMonth.value = null;
    return;
  }
  try {
    // console.log('updateCalendarMonths: Creating first month with locale:', currentLocale, 'dateObj:', placeholder.value.toString());
    firstMonth.value = createMonth({
      dateObj: placeholder.value,
      locale: currentLocale,
      fixedWeeks: true,
      weekStartsOn: 0,
    });

    // Ensure secondMonthPlaceholder is different from placeholder for display
    let sMonthPlaceholder = secondMonthPlaceholder.value;
    if (isEqualMonth(placeholder.value, sMonthPlaceholder)) {
        sMonthPlaceholder = sMonthPlaceholder.add({ months: 1 });
        // No need to update secondMonthPlaceholder ref here as it's for calculation
    }
    // console.log('updateCalendarMonths: Creating second month with locale:', currentLocale, 'dateObj:', sMonthPlaceholder.toString());
    secondMonth.value = createMonth({
      dateObj: sMonthPlaceholder,
      locale: currentLocale,
      fixedWeeks: true,
      weekStartsOn: 0,
    });
  } catch (e) {
    console.error('Error in updateCalendarMonths during createMonth:', e);
    firstMonth.value = null;
    secondMonth.value = null;
  }
};

watch(locale, (newLocale) => {
  if (typeof newLocale === 'string' && newLocale) {
    updateCalendarMonths(newLocale);
  } else {
    firstMonth.value = null;
    secondMonth.value = null;
  }
}, { immediate: true });

watch(placeholder, (newPlaceholder) => {
  if (newPlaceholder && typeof locale.value === 'string' && locale.value) {
    // console.log('Placeholder watcher: Updating first month. New placeholder:', newPlaceholder.toString());
    firstMonth.value = createMonth({
      dateObj: newPlaceholder,
      weekStartsOn: 0,
      fixedWeeks: true, // Keep true for consistency or false if intended for this specific watch
      locale: locale.value,
    });
    // Adjust second month if it becomes same as first
    if (secondMonthPlaceholder.value && isEqualMonth(secondMonthPlaceholder.value, newPlaceholder)) {
      // console.log('Placeholder watcher: Adjusting second month placeholder.');
      secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({ months: 1 });
      // updateCalendarMonths(locale.value) will be triggered by secondMonthPlaceholder watch
    }
  }
});

watch(secondMonthPlaceholder, (newSecondPlaceholder) => {
 if (newSecondPlaceholder && typeof locale.value === 'string' && locale.value) {
    // console.log('Second placeholder watcher: Updating second month. New placeholder:', newSecondPlaceholder.toString());
    // Ensure secondMonthPlaceholder is different from placeholder for display
    let sMonthPlaceholder = newSecondPlaceholder;
    if (placeholder.value && isEqualMonth(placeholder.value, sMonthPlaceholder)) {
        sMonthPlaceholder = sMonthPlaceholder.add({ months: 1 });
    }
    secondMonth.value = createMonth({
      dateObj: sMonthPlaceholder,
      weekStartsOn: 0,
      fixedWeeks: true, // Keep true for consistency
      locale: locale.value,
    });
    // Adjust first month if it became same as second (less common scenario here)
    if (placeholder.value && isEqualMonth(newSecondPlaceholder, placeholder.value)) {
      // console.log('Second placeholder watcher: Adjusting first month placeholder.');
      placeholder.value = placeholder.value.subtract({ months: 1 });
       // updateCalendarMonths(locale.value) will be triggered by placeholder watch
    }
  }
});


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

watch(() => value.value, (newValue, oldValue) => {
  if (newValue.start && newValue.end) {
    // Update placeholders only if the actual value has changed to prevent infinite loops with other watchers
    if (!oldValue || !newValue.start.equals(oldValue.start) || !newValue.end.equals(oldValue.end)) {
        placeholder.value = newValue.start;
        let sMonthPlaceholderValue = newValue.end;
        if (isEqualMonth(newValue.start, newValue.end)) {
            sMonthPlaceholderValue = newValue.end.add({ months: 1 });
        }
        secondMonthPlaceholder.value = sMonthPlaceholderValue;
    }

    emit('update:dateRange', newValue);
    updateUrlParams(newValue);
    fetchTransactions();
  }
}, { deep: true });


onMounted(() => {
  if (route.query.start && route.query.end) {
    const startDate = stringToCalendarDate(route.query.start as string);
    const endDate = stringToCalendarDate(route.query.end as string);
    if (startDate && endDate) {
      value.value = { start: startDate, end: endDate };
      // Trigger value watcher by explicitly setting, or call updateCalendarMonths if not relying on value watcher for this
      // placeholder.value = startDate;
      // secondMonthPlaceholder.value = isEqualMonth(startDate, endDate) ? endDate.add({ months: 1 }) : endDate;
    }
  } else {
     // Ensure placeholders are set based on initial value if no URL params
     placeholder.value = value.value.start;
     secondMonthPlaceholder.value = isEqualMonth(value.value.start, value.value.end) ? value.value.end.add({ months: 1 }) : value.value.end;
  }
  // Initial fetch is now handled by the value watcher if value is valid
  // Or by direct call if needed after mount based on initial value.
  if (value.value.start && value.value.end) {
    fetchTransactions(); // Ensure fetch if initial value is already set
  }
  // Call updateCalendarMonths explicitly after mount to ensure calendars are ready
  // This relies on locale already being available from i18n plugin.
  if (typeof locale.value === 'string' && locale.value) {
    updateCalendarMonths(locale.value);
  }
});

const formattedDateRange = computed(() => {
  if (!value.value.start) return t('select_date_placeholder');
  const formatter = dateRangeDisplayFormatterRef.value?.value;
  const currentLocale = typeof locale.value === 'string' && locale.value ? locale.value : 'en-US';
  const fallbackOptions = { day: '2-digit', month: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions;

  if (!formatter || typeof formatter.format !== 'function') {
    const startFormattedFallback = toDate(value.value.start).toLocaleDateString(currentLocale, fallbackOptions);
    if (!value.value.end) return startFormattedFallback;
    const endFormattedFallback = toDate(value.value.end).toLocaleDateString(currentLocale, fallbackOptions);
    return `${startFormattedFallback} - ${endFormattedFallback}`;
  }
  const startFormatted = formatter.format(toDate(value.value.start));
  if (!value.value.end) return startFormatted;
  const endFormatted = formatter.format(toDate(value.value.end));
  return `${startFormatted} - ${endFormatted}`;
});

const formatMonthYearForHeader = (dateObj: DateValue | undefined | null): string => {
  if (!dateObj) {
    return t('loading_month'); // Return a loading or N/A string
  }
  const formatter = monthYearFormatterRef.value?.value;
  const currentLocale = typeof locale.value === 'string' && locale.value ? locale.value : 'en-US';
  const fallbackOptions = { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions;

  if (!formatter || typeof formatter.format !== 'function') {
    return toDate(dateObj).toLocaleDateString(currentLocale, fallbackOptions);
  }
  return formatter.format(toDate(dateObj));
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
        <template v-if="firstMonth && firstMonth.dateObj && secondMonth && secondMonth.dateObj">
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
        </template>
        <div v-else class="p-4 text-center">{{ t('loading_calendar') }}</div> <!-- Fallback if month objects not ready -->
      </PopoverContent>
    </Popover>
  </div>
</template>
