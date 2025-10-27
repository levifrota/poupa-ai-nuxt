<script setup lang="ts">
import { MenubarMenu } from "reka-ui";

defineProps<{
  value?: string;
}>();
</script>

<template>
  <MenubarMenu data-slot="menubar-menu">
    <slot />
  </MenubarMenu>
</template>
