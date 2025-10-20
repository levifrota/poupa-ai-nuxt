<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useCurrentUser } from "vuefire";

useThemeStore();
useFontStore();

const onboardingStore = useOnboardingStore();
const user = useCurrentUser();

// Verificar status do onboarding ao carregar
onMounted(() => {
  onboardingStore.checkOnboardingStatus();
});

// Iniciar onboarding para novos usuários
watch(
  user,
  (newUser) => {
    if (newUser && !onboardingStore.hasCompletedOnboarding) {
      // Aguardar um pouco para garantir que a página carregou
      setTimeout(() => {
        onboardingStore.startOnboarding();
      }, 1000);
    }
  },
  { immediate: true }
);
</script>

<template>
  <NuxtPwaManifest />
  <NuxtLayout name="default">
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <OnboardingTour />
  </ClientOnly>
</template>
