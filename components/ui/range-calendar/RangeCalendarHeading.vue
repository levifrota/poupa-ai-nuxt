<script lang="ts" setup>
/* eslint-disable import/no-duplicates, import/first, @typescript-eslint/no-import-type-side-effects */
import { cn } from '@/lib/utils'
import { RangeCalendarHeading, type RangeCalendarHeadingProps, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<RangeCalendarHeadingProps & { class?: HTMLAttributes['class'] }>()

import { type VNode } from 'vue'

defineSlots<{
  default: (props: { headingValue: string }) => VNode[]
}>()
/* eslint-enable import/no-duplicates, import/first, @typescript-eslint/no-import-type-side-effects */

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarHeading
    v-slot="{ headingValue }"
    data-slot="range-calendar-heading"
    :class="cn('text-sm font-medium', props.class)"
    v-bind="forwardedProps"
  >
    <slot :heading-value>
      {{ headingValue }}
    </slot>
  </RangeCalendarHeading>
</template>
