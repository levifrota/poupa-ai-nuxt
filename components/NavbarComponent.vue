<script setup lang="ts">
import { Icon } from "#components";

const themeStore = useThemeStore();
const route = useRoute();

const linkClasses = (href: string) => {
  return route.path === href ? "font-bold text-primary" : "text-muted-foreground";
};
</script>

<template>
  <nav class="flex justify-between border-b border-solid px-8 py-4">
    <div class="flex w-[100%] flex-row justify-center gap-10 md:w-auto md:items-center">
      <NuxtImg
        v-if="themeStore.theme === 'dark' || themeStore.theme === 'high-contrast'"
        class="self-center md:self-auto"
        src="./logo.svg"
        width="173"
        height="39"
        alt="Poupa Aí"
      />
      <NuxtImg
        v-else-if="themeStore.theme === 'deuteranopia'"
        src="./logo-deuteranopia.svg"
        width="173"
        height="39"
        alt="Poupa Aí"
      />
      <NuxtImg
        v-else
        class="self-center md:self-auto"
        src="./logo-light.svg"
        width="173"
        height="39"
        alt="Poupa Aí"
      />
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
      <div class="text-primary">
        <Select>
          <SelectTrigger class="w-full">
            <Icon name="lucide:user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profile">
              <Icon name="lucide:user" class="mr-2" />
              Perfil
            </SelectItem>
            <SelectItem value="logout">
              <Icon name="lucide:log-out" class="mr-2" />
              Sair
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </nav>
</template>
