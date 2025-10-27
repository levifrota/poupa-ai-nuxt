<script setup lang="ts">
import { SelectValue } from "reka-ui";

const props = defineProps<{
  placeholder?: string;
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <SelectValue v-bind="props" data-slot="select-value">
    <slot />
  </SelectValue>
</template>
