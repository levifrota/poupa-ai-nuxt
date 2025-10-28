<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useCurrentUser } from "vuefire";
// import { useThemeStore } from './composables/useThemeStore';
// import { useFontStore } from './composables/useFontStore';
import { useOnboardingStore } from "./composables/useOnboardingStore";

const user = useCurrentUser();

onMounted(() => {
  const { $pinia } = useNuxtApp();
  const onboardingStore = useOnboardingStore($pinia);

  // Verificar status do onboarding ao carregar
  onboardingStore.checkOnboardingStatus();

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
    { immediate: true },
  );
});
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
