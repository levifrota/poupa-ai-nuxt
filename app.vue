<script setup lang="ts">
import { useI18n } from '#imports'

useThemeStore();
useFontStore();

const { locale } = useI18n()

// Set HTML lang attribute
useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
})
</script>

<template>
  <NuxtLayout name="default" />
</template>
