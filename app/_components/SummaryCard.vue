<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Card, CardHeader, CardContent } from '@/app/_components/ui/card'
import { Icon } from '#components'

interface Props {
  title: string
  value: number | string
  icon: string
  class?: HTMLAttributes['class']
}
const props = defineProps<Props>()
</script>

<template>
  <Card :class="['flex items-center space-x-4', props.class]">
    <Icon :name="props.icon" class="h-6 w-6 text-primary" />
    <div class="flex-1">
      <CardHeader class="text-sm uppercase">{{ props.title }}</CardHeader>
      <CardContent class="text-lg font-bold">{{ props.value }}</CardContent>
    </div>
  </Card>
</template>