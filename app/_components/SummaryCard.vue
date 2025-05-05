<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Card, CardHeader, CardContent } from "@/app/_components/ui/card";
import { Icon } from "#components";

interface Props {
  title: string;
  value: number | string;
  icon: string;
  class?: HTMLAttributes["class"];
}
const props = defineProps<Props>();
</script>

<template>
  <Card
    v-if="props.title === 'Saldo'"
    class="flex w-[90%] flex-col self-center bg-white bg-opacity-5 sm:block sm:w-full"
  >
    <div class="flex-1">
      <CardHeader class="flex-row items-center gap-4 pb-0 sm:p-6">
        <Icon :name="props.icon" class="hidden sm:block h-6 w-6 text-primary" />
        <p class="opacity-70">
          {{ props.title }}
        </p>
      </CardHeader>
      <CardContent class="flex-wrap p-6 sm:flex-row sm:pt-0">
        <p class="text-xl sm:text-4xl">
          {{ props.value }}
        </p>
      </CardContent>
    </div>
  </Card>
  <Card v-else :class="['flex items-center space-x-4', props.class]">
    <Icon :name="props.icon" class="h-6 w-6 text-primary" />
    <div class="flex-1">
      <CardHeader class="text-sm uppercase">{{ props.title }}</CardHeader>
      <CardContent class="text-lg font-bold">{{ props.value }}</CardContent>
    </div>
  </Card>
</template>
