<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";

defineProps<{
  items: {
    name: string;
    color: string;
    value: string;
    inactive?: boolean;
  }[];
}>();
</script>

<template>
  <Card class="text-sm" aria-label="Legenda do gráfico">
    <CardContent class="p-3 min-w-[180px] flex flex-col gap-1" role="list">
      <div
        v-for="(item, key) in items"
        :key="key"
        class="flex justify-between"
        role="listitem"
        :aria-label="`${item.name}: ${item.value}`"
      >
        <div class="flex items-center">
          <span class="w-2.5 h-2.5 mr-2">
            <svg width="100%" height="100%" viewBox="0 0 30 30" aria-hidden="true">
              <path
                d=" M 15 15 m -14, 0 a 14,14 0 1,1 28,0 a 14,14 0 1,1 -28,0"
                :stroke="item.color"
                :fill="item.color"
                stroke-width="1"
              />
            </svg>
          </span>
          <span>{{ item.name }}</span>
        </div>
        <span class="font-semibold ml-4">{{ item.value }}</span>
      </div>
    </CardContent>
  </Card>
</template>
