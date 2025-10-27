<script setup lang="ts">
import { MenubarGroup } from "reka-ui";

defineProps<{
  asChild?: boolean;
  as?: any;
}>();
</script>

<template>
  <MenubarGroup data-slot="menubar-group">
    <slot />
  </MenubarGroup>
</template>
