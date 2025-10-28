<template>
  <Menubar
    :class="[
      'sticky bottom-0 flex w-full h-13 rounded-none justify-around md:hidden p-3',
      background,
    ]"
    aria-label="Navegação principal"
  >
    <MenubarMenu>
      <MenubarTrigger class="flex justify-center align-center">
        <NuxtLink
          to="/"
          :class="[linkClasses('/'), 'flex']"
          aria-label="Navegar para o Painel"
        >
          <Icon
            name="lucide:layout-dashboard"
            :class="[iconClasses, iconSize]"
          />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink
          to="/transactions"
          :class="[linkClasses('/transactions'), 'flex']"
          aria-label="Navegar para Transações"
        >
          <Icon
            name="lucide:arrow-left-right"
            :class="[iconClasses, iconSize]"
          />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink
          to="/settings"
          :class="[linkClasses('/settings'), 'flex']"
          aria-label="Navegar para Configurações"
        >
          <Icon
            name="lucide:settings"
            :class="[iconClasses, iconSize]"
          />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger aria-label="Menu do usuário">
        <Icon
          name="lucide:user"
          :class="[iconClasses, iconSize]"
        />
        <MenubarContent>
          <MenubarItem @click="isDialogOpen = true">
            <Icon
              name="lucide:user"
              class="mr-2"
            />
            Gerenciar Perfil
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem @click="handleLogout(router)">
            <Icon
              name="lucide:log-out"
              class="mr-2"
            />
            Sair
          </MenubarItem>
        </MenubarContent>
      </MenubarTrigger>
    </MenubarMenu>
  </Menubar>

  <UserButton v-model:is-open="isDialogOpen" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { handleLogout } from "@/_data/global.js";
import { storeToRefs } from "pinia";
import { useFontStore } from "../composables/useFontStore.js";
import { useThemeStore } from "../composables/useThemeStore.js";

const fontStore = useFontStore();
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { fontSize } = storeToRefs(fontStore);
const route = useRoute();
const router = useRouter();
const isDialogOpen = ref(false);

const linkClasses = (to: string) => {
  return route.path === to ? "font-bold text-primary" : "text-muted-foreground";
};

const background = computed(() => {
  switch (theme.value) {
    case "light":
      return "bg-white border-t border-gray-200";
    case "dark":
      return "bg-black border-t border-gray-800";
    case "high-contrast":
      return "bg-black border-t border-yellow-400";
    case "protanopia":
      return "bg-blue-900 border-t border-blue-700";
    case "deuteranopia":
      return "bg-blue-800 border-t border-blue-600";
    case "tritanopia":
      return "bg-purple-900 border-t border-purple-700";
    case "colorblind":
      return "bg-gray-800 border-t border-gray-600";
    default:
      return "bg-black border-t border-gray-800";
  }
});

const iconClasses = computed(() => {
  switch (theme.value) {
    case "light":
      return "text-gray-800";
    case "dark":
      return "text-gray-200";
    case "high-contrast":
      return "text-yellow-400";
    case "protanopia":
      return "text-blue-300";
    case "deuteranopia":
      return "text-blue-300";
    case "tritanopia":
      return "text-purple-300";
    case "colorblind":
      return "text-gray-300";
    default:
      return "text-gray-200";
  }
});

const iconSize = computed(() => {
  switch (fontSize.value) {
    case "small":
      return "text-medium";
    case "medium":
      return "text-large";
    case "large":
      return "text-xl";
    default:
      return "text-large";
  }
});
</script>
