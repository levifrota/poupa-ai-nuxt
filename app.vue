<script setup lang="ts">
import { useThemeStore } from './app/_composables/useThemeStore';
import { useFontStore } from './app/_composables/useFontStore';

useThemeStore();
useFontStore();
</script>

<template>
  <NuxtLayout name="default" />
</template>
