<template>
  <div class="min-h-screen flex flex-col">
    <NavbarComponent />
    <main class="flex-grow p-4">
      <NuxtPage />
    </main>
    <FooterComponent />
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
</script>

<style></style>
