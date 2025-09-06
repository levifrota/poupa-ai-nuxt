<script setup lang="ts">
import { type DateValue, CalendarDate, getLocalTimeZone, today, parseDate } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string | number | Date
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: Date | undefined): void
}>()

// Converter Date para DateValue usando CalendarDate
const internalValue = computed({
  get: () => {
    if (!props.modelValue) return undefined

    try {
      const date = new Date(props.modelValue)
      if (isNaN(date.getTime())) return undefined

      // Usar CalendarDate para criar um DateValue válido
      return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      )
    } catch (error) {
      console.error('Erro ao converter data:', error)
      return undefined
    }
  },
  set: (value: DateValue | undefined) => {
    if (!value) {
      emits('update:modelValue', undefined)
      return
    }

    try {
      // Converter DateValue para Date JavaScript
      const jsDate = new Date(value.year, value.month - 1, value.day)
      emits('update:modelValue', jsDate)
    } catch (error) {
      console.error('Erro ao converter DateValue:', error)
      emits('update:modelValue', undefined)
    }
  }
})

// Formatação da data exibida
const formattedDate = computed(() => {
  if (!props.modelValue) return undefined

  try {
    const date = new Date(props.modelValue)
    if (isNaN(date.getTime())) return undefined

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    console.error('Erro ao formatar data:', error)
    return undefined
  }
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-[280px] justify-start text-left font-normal',
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
