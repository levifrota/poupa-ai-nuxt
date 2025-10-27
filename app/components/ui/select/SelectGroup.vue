<script setup lang="ts">
import { SelectGroup } from "reka-ui";

defineProps<{
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <SelectGroup data-slot="select-group">
    <slot />
  </SelectGroup>
</template>
