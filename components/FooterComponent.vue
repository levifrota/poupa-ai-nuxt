<template>
  <Menubar
    :class="['sticky bottom-0 flex w-full justify-around md:hidden p-3', background]"
  >
    <MenubarMenu>
      <MenubarTrigger class="flex justify-center align-center">
        <NuxtLink to="/" :class="linkClasses('/')" :aria-label="t('dashboard')">
          <Icon name="lucide:layout-dashboard" :class="['h-16', iconClasses]" />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink to="/transactions" :class="linkClasses('/transactions')" :aria-label="t('transactions')">
          <Icon name="lucide:arrow-left-right" :class="iconClasses" />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink to="/subscription" :class="linkClasses('/subscription')" :aria-label="t('subscription')">
          <Icon name="lucide:calendar-sync" :class="iconClasses" />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink to="/settings" :class="linkClasses('/settings')" :aria-label="t('settings')">
          <Icon name="lucide:settings" :class="iconClasses" />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger :aria-label="t('logout')">
        <!-- <UserButton /> -->
        <Icon name="lucide:user" :class="iconClasses" />
      </MenubarTrigger>
    </MenubarMenu>
  </Menubar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from '#imports'; // Added this line

const { t } = useI18n(); // Added this line
const themeStore = useThemeStore();
const route = useRoute();

const linkClasses = (to: string) => {
  return route.path === to ? "font-bold text-primary" : "text-muted-foreground";
};

const background = computed(() => {
  switch (themeStore.theme) {
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
  switch (themeStore.theme) {
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
</script>

<style></style>
