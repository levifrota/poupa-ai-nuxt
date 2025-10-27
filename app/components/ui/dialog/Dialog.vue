<script setup lang="ts">
import { DialogRoot } from "reka-ui";

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
  <DialogRoot
    data-slot="dialog"
    v-bind="props"
    @update:open="emits('update:open', $event)"
  >
    <slot />
  </DialogRoot>
</template>
