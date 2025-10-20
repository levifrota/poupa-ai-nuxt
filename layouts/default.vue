<template>
  <div class="min-h-screen flex flex-col">
    <template v-if="!isAuthPage">
      <NavbarComponent />
      <main class="flex-grow p-4">
        <slot />
      </main>
      <FooterComponent />
    </template>
    <template v-else>
      <main class="flex-grow p-4">
        <slot />
      </main>
    </template>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isAuthPage = computed(() => {
  return route.path === "/login" || route.path === "/register";
});
</script>

<style></style>
