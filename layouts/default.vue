<template>
  <div class="min-h-screen flex flex-col">
    <NavbarComponent />
    <main class="flex-grow p-4">
      <NuxtPage />
    </main>
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/NavbarComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
</script>

<style></style>
