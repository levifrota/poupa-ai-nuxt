<script setup lang="ts">
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { toDate } from 'radix-vue/date'
import { type Ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = defineProps<{
  modelValue?: DateValue | undefined
  defaultValue?: DateValue | undefined
  placeholder?: DateValue | undefined
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', payload: DateValue | undefined): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
}) as Ref<DateValue | undefined>
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !modelValue && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <span>{{ modelValue ? toDate(modelValue).toLocaleDateString() : "Selecione uma data" }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="modelValue" />
    </PopoverContent>
  </Popover>
</template>
