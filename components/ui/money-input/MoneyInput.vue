<script setup lang="ts">
import { useMoney } from '~/composables/useMoney'
import { Input } from '~/components/ui/input'
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: number
}>()

const emits = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const { formatted } = useMoney(internalValue)

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  },
)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '')
  const numberValue = Number(value) / 100
  internalValue.value = numberValue
  emits('update:modelValue', numberValue)
}
</script>

<template>
  <Input :model-value="formatted" @input="onInput" />
</template>
