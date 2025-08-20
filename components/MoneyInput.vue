<script setup lang="ts">
import { computed } from 'vue'

const model = defineModel<number>()

const formattedValue = computed({
  get: () => {
    if (typeof model.value !== 'number') return ''
    // When user is typing, we need to show the raw value
    // When not focused, show the formatted value
    // This is getting complex. Let's stick to a simpler version for now.
    return model.value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  },
  set: (value: string) => {
    const numberValue = Number(value.replace(/\D/g, '')) / 100
    model.value = isNaN(numberValue) ? undefined : numberValue
  },
})
</script>

<template>
  <UInput
    v-model="formattedValue"
    placeholder="R$ 0,00"
  />
</template>
