<script setup lang="ts">
import { TooltipRoot } from "reka-ui";

const props = defineProps<{
  defaultOpen?: boolean;
  open?: boolean;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  disableClosingTrigger?: boolean;
  disabled?: boolean;
  ignoreNonKeyboardFocus?: boolean;
}>();

const emits = defineEmits<{
  "update:open": [value: boolean];
}>();
</script>

<template>
  <TooltipRoot
    data-slot="tooltip"
    v-bind="props"
    @update:open="emits('update:open', $event)"
  >
    <slot />
  </TooltipRoot>
</template>
