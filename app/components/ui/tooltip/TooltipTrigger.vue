<script setup lang="ts">
import { TooltipTrigger } from "reka-ui";

defineProps<{
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <TooltipTrigger data-slot="tooltip-trigger">
    <slot />
  </TooltipTrigger>
</template>
