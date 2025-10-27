<script setup lang="ts">
import { DialogClose } from "reka-ui";

defineProps<{
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <DialogClose data-slot="dialog-close">
    <slot />
  </DialogClose>
</template>
