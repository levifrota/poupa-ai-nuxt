<script lang="ts" setup>
import type { CalendarGridBodyProps } from 'radix-vue'
import { CalendarGridBody } from 'radix-vue'

const props = defineProps</* @vue-ignore */ CalendarGridBodyProps>()
</script>

<template>
  <CalendarGridBody v-bind="props">
    <slot />
  </CalendarGridBody>
</template>
