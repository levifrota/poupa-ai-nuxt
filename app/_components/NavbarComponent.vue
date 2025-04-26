<script setup lang="ts">
import { useThemeStore } from '~/app/_composables/useThemeStore';

const themeStore = useThemeStore();
const route = useRoute();

const linkClasses = (href: string) => {
  return route.path === href
    ? 'font-bold text-primary'
    : 'text-muted-foreground';
};
</script>

<template>
  <nav class="flex justify-between border-b border-solid px-8 py-4">
    <div
      class="flex w-[100%] flex-row justify-center gap-10 md:w-auto md:items-center"
    >
      <div v-if="themeStore.theme === 'dark'">
        <img
          class="self-center md:self-auto"
          src="../../public/logo.svg"
          width="173"
          height="39"
          alt="Poupa Aí"
        >
      </div>
      <div v-else>
        <img
          class="self-center md:self-auto"
          src="../../public/logo-light.svg"
          width="173"
          height="39"
          alt="Poupa Aí"
        >
      </div>
      <div class="hidden gap-6 md:flex">
        <NuxtLink to="/" :class="linkClasses('/')"> Painel </NuxtLink>
        <NuxtLink to="/transactions" :class="linkClasses('/transactions')">
          Transações
        </NuxtLink>
        <NuxtLink to="/subscription" :class="linkClasses('/subscription')">
          Assinatura
        </NuxtLink>
        <NuxtLink to="/settings" :class="linkClasses('/settings')">
          Configurações
        </NuxtLink>
      </div>
    </div>
    <div class="hidden md:block">
      <!-- Replace with your auth component -->
      <div class="text-primary">User Menu</div>
    </div>
  </nav>
</template>
