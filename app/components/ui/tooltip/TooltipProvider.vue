<script setup lang="ts">
import { TooltipProvider } from "reka-ui";

withDefaults(
  defineProps<{
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
    disableClosingTrigger?: boolean;
    disabled?: boolean;
    ignoreNonKeyboardFocus?: boolean;
  }>(),
  {
    delayDuration: 0,
  }
);
</script>

<template>
  <TooltipProvider>
    <slot />
  </TooltipProvider>
</template>
