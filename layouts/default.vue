<template>
  <div class="min-h-screen flex flex-col">
    <NavbarComponent />
    <main class="flex-grow p-4">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import NavbarComponent from '~/app/_components/NavbarComponent.vue';
</script>

<style>

</style>