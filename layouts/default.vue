<template>
  <div class="min-h-screen flex flex-col">
    <a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>
    <template v-if="!isAuthPage">
      <NavbarComponent />
      <main id="main-content" tabindex="-1" class="flex-grow p-4 max-[350px]:p-0">
        <slot />
      </main>
      <FooterComponent />
    </template>
    <template v-else>
      <main id="main-content" tabindex="-1" class="flex-grow px-4 max-[350px]:p-0">
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

<style>
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 100;
  padding: 0.75rem 1rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-radius: 0 0 var(--radius) 0;
  transition: top 0.15s ease-in-out;
}

.skip-link:focus {
  top: 0;
}
</style>
