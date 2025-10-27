<script setup lang="ts">
import { cn } from '../../../../lib/utils'
import { DialogTitle, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

interface Props {
  asChild?: boolean;
  as?: any;
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogTitle
    data-slot="dialog-title"
    v-bind="forwardedProps"
    :class="cn('text-lg leading-none font-semibold', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
