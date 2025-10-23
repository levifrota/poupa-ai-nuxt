<script setup lang="ts">
import { MenubarMenu, type MenubarMenuProps } from 'reka-ui'

const props = defineProps</* @vue-ignore */ MenubarMenuProps>()
</script>

<template>
  <MenubarMenu
    data-slot="menubar-menu"
    v-bind="props"
  >
    <slot />
  </MenubarMenu>
</template>
