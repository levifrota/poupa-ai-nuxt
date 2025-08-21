<script setup lang="ts">
import { type DateValue, getLocalTimeZone } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ref } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue?: string | number | Date
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: typeof props.modelValue): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})
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
        <span>{{ modelValue ? new Date(modelValue).toLocaleDateString() : "Selecione uma data" }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="modelValue" />
    </PopoverContent>
  </Popover>
</template>
