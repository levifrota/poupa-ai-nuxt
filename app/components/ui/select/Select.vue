<script setup lang="ts">
import { SelectRoot } from "reka-ui";

const props = defineProps<{
  defaultValue?: string;
  defaultOpen?: boolean;
  dir?: "ltr" | "rtl";
  name?: string;
  autocomplete?: string;
  disabled?: boolean;
  modelValue?: string;
  open?: boolean;
  required?: boolean;
}>();

const emits = defineEmits<{
  "update:modelValue": [value: string];
  "update:open": [value: boolean];
}>();
</script>

<template>
  <SelectRoot
    data-slot="select"
    v-bind="props"
    @update:model-value="emits('update:modelValue', $event)"
    @update:open="emits('update:open', $event)"
  >
    <slot />
  </SelectRoot>
</template>
