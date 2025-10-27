<script setup lang="ts">
import { DialogTrigger } from "reka-ui";

defineProps<{
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <DialogTrigger data-slot="dialog-trigger">
    <slot />
  </DialogTrigger>
</template>
