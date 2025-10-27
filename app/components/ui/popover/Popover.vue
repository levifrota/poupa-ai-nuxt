<script setup lang="ts">
import { PopoverRoot } from "reka-ui";

const props = defineProps<{
  defaultOpen?: boolean;
  open?: boolean;
  modal?: boolean;
}>();

const emits = defineEmits<{
  "update:open": [value: boolean];
}>();
</script>

<template>
  <PopoverRoot
    data-slot="popover"
    v-bind="props"
    @update:open="emits('update:open', $event)"
  >
    <slot />
  </PopoverRoot>
</template>
