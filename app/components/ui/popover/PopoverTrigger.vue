<script setup lang="ts">
import { PopoverTrigger } from "reka-ui";

defineProps<{
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <PopoverTrigger data-slot="popover-trigger">
    <slot />
  </PopoverTrigger>
</template>
