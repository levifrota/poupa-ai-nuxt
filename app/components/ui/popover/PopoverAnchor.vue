<script setup lang="ts">
import { PopoverAnchor } from "reka-ui";

defineProps<{
  element?: HTMLElement;
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <PopoverAnchor data-slot="popover-anchor">
    <slot />
  </PopoverAnchor>
</template>
