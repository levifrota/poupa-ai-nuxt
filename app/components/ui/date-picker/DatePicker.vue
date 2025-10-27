<script setup lang="ts">
import { type DateValue, CalendarDate } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '../../../../lib/utils'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string | number | Date
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: Date | undefined): void
}>()

// Estado para controlar abertura do Popover
const isPopoverOpen = ref(false);

// Watch para monitorar mudanças no estado do popover
watch(isPopoverOpen, (newValue) => {
  console.log('[DatePicker] isPopoverOpen mudou para:', newValue);
});
// Converter Date para DateValue usando CalendarDate
const internalValue = computed({
  get: () => {
    if (!props.modelValue) return undefined

    try {
      const date = new Date(props.modelValue)
      if (isNaN(date.getTime())) {
        return undefined
      }

      // Usar CalendarDate para criar um DateValue válido
      const calendarDate = new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      )
      return calendarDate
    } catch (error) {
      return undefined
    }
  },
  set: (value: DateValue | undefined) => {
    if (!value) {
      emits('update:modelValue', undefined)
      return
    }

    try {
      const jsDate = new Date(value.year, value.month - 1, value.day)
      emits('update:modelValue', jsDate)
    } catch (error) {
      emits('update:modelValue', undefined)
    }
  }
})

const formattedDate = computed(() => {
  if (!props.modelValue) return undefined

  try {
    const date = new Date(props.modelValue)
    if (isNaN(date.getTime())) {
      return undefined
    }

    const formatted = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)

    return formatted
  } catch (error) {
    console.error('[DatePicker] Erro ao formatar data:', error)
    return undefined
  }
})
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child class="self-start">
      <Button
        variant="outline"
        :class="
          cn(
            'w-60 sm:w-[280px] justify-start text-left font-normal',
            !props.modelValue && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <span>{{ formattedDate || "Selecione uma data" }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        v-model="internalValue"
        locale="pt-BR"
        :weekday-format="'short'"
        class="rounded-md border"
      />
    </PopoverContent>
  </Popover>
</template>
