<script setup lang="ts">
import { DialogRoot, type DialogRootEmits, type DialogRootProps, useForwardPropsEmits } from 'reka-ui'

// @ts-ignore - Workaround for https://github.com/nuxt/nuxt/issues/29757
const props = defineProps</* @vue-ignore */ DialogRootProps>()
// @ts-ignore - Workaround for https://github.com/nuxt/nuxt/issues/29757
const emits = defineEmits</* @vue-ignore */ DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot data-slot="dialog" v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>
