<template>
  <Menubar
    :class="['sticky bottom-0 flex w-full justify-around md:hidden p-3', background]"
  >
    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink to="/" :class="linkClasses('/')">
          <Icon name="lucide:layout-dashboard" class="h-16" />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink to="/transactions" :class="linkClasses('/transactions')">
          <Icon name="lucide:arrow-left-right" />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink to="/subscription" :class="linkClasses('/subscription')">
          <Icon name="lucide:calendar-sync" />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <NuxtLink to="/settings" :class="linkClasses('/settings')">
          <Icon name="lucide:settings" />
        </NuxtLink>
      </MenubarTrigger>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>
        <!-- <UserButton /> -->
        <Icon name="lucide:user" />
      </MenubarTrigger>
    </MenubarMenu>
  </Menubar>
</template>

<script setup lang="ts">
// import { Menubar, MenubarMenu, MenubarTrigger } from '@headlessui/vue';
// import { LayoutDashboard, ArrowLeftRight, CalendarSync, Settings } from 'lucide-vue-next';
import UserButton from '~/app/_components/UserButton.vue';
import { useThemeStore } from '../_composables/useThemeStore';
import { computed } from 'vue';

const themeStore = useThemeStore();
const route = useRoute();

const linkClasses = (to: string) => {
  return route.path === to
    ? 'font-bold text-primary'
    : 'text-muted-foreground';
};

const background = computed(() => {
  return themeStore.theme === 'light'
  ? 'bg-white border-t border-gray-200'
  : 'bg-black border-t border-gray-800';
});
</script>

<style></style>
