<script setup lang="ts">
import { SelectItemText } from "reka-ui";

defineProps<{
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <SelectItemText data-slot="select-item-text">
    <slot />
  </SelectItemText>
</template>
