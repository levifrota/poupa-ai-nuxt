<script setup lang="ts">
import { MenubarRadioGroup } from "reka-ui";

const props = defineProps<{
  modelValue?: string;
}>();

const emits = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <MenubarRadioGroup
    data-slot="menubar-radio-group"
    v-bind="props"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <slot />
  </MenubarRadioGroup>
</template>
