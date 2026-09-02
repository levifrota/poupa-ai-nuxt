<script setup lang="ts">
import { Button } from "~/components/ui/button";
import type { NuxtError } from "#app";

useThemeStore();
useFontStore();

const props = defineProps<{
  error: NuxtError;
}>();

const isNotFound = computed(() => props.error.statusCode === 404);

const title = computed(() =>
  isNotFound.value ? "Página não encontrada" : "Ocorreu um erro"
);

const description = computed(() =>
  isNotFound.value
    ? "A página que você está procurando não existe ou foi movida."
    : "Algo deu errado ao carregar esta página. Tente novamente mais tarde."
);

const handleGoHome = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center"
  >
    <img src="/logo.svg" alt="Poupa.ai" class="w-40" />

    <div class="space-y-2">
      <p class="text-6xl font-bold text-primary">{{ error.statusCode }}</p>
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <p class="max-w-md text-sm text-muted-foreground">{{ description }}</p>
    </div>

    <Button @click="handleGoHome">Voltar para o início</Button>
  </div>
</template>
