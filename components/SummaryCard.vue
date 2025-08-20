<script setup lang="ts">
// import type { HTMLAttributes } from "vue";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Icon } from "#components";
import { useDialogs } from '~/composables/useDialogs'

interface Props {
  title: string;
  value: number | string;
  icon: string;
}
const props = defineProps<Props>();

const { openUpsertTransactionDialog } = useDialogs()
</script>

<template>
  <Card
    v-if="props.title === 'Saldo'"
    class="flex w-[90%] flex-col self-center bg-white bg-opacity-5 sm:block sm:w-full"
    :aria-label="`${props.title}: ${props.value}`"
  >
    <div class="flex-1">
      <CardHeader class="flex-row items-center gap-4 pb-0 sm:p-6">
        <Icon :name="props.icon" class="hidden sm:block h-6 w-6 text-primary" />
        <p class="opacity-70">
          {{ props.title }}
        </p>
        <UButton class="ml-auto" @click="openUpsertTransactionDialog()">
          Adicionar
        </UButton>
      </CardHeader>
      <CardContent class="flex-wrap p-6 sm:flex-row sm:pt-0">
        <p class="text-xl sm:text-4xl font-bold">
          {{ props.value }}
        </p>
      </CardContent>
    </div>
  </Card>
  <Card v-else class="flex flex-col p-3" :aria-label="`${props.title}: ${props.value}`">
    <div class="flex-1">
      <CardHeader class="flex-row items-center gap-4 p-0 sm:p-6">
        <Icon :name="props.icon" class="hidden sm:block h-6 w-6 text-primary" />
        <p class="text-muted-foreground">
          {{ props.title }}
        </p>
      </CardHeader>
      <CardContent class="flex-row p-0 sm:p-6 sm:pt-0 flex justify-between">
        <p class="text-base sm:text-2xl font-bold">
          {{ props.value }}
        </p>
      </CardContent>
    </div>
  </Card>
</template>
