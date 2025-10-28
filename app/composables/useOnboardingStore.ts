import { defineStore } from "pinia";

export const useOnboardingStore = defineStore("onboarding", () => {
  const hasCompletedOnboarding = ref(false);
  const currentStep = ref(0);
  const isOnboardingActive = ref(false);

  // Verificar se o usuário já completou o onboarding
  const checkOnboardingStatus = () => {
    if (import.meta.server) return;

    // Verificar localStorage primeiro (mais confiável no cliente)
    const storedValue = localStorage.getItem("onboarding-completed");
    if (storedValue === "true") {
      hasCompletedOnboarding.value = true;
      return;
    }

    const onboardingCookie = useCookie<string>("onboarding-completed", {
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      path: "/",
    });

    hasCompletedOnboarding.value = onboardingCookie.value === "true";

    // Sincronizar com localStorage
    if (hasCompletedOnboarding.value) {
      localStorage.setItem("onboarding-completed", "true");
    }
  };

  // Iniciar onboarding
  const startOnboarding = () => {
    isOnboardingActive.value = true;
    currentStep.value = 0;
  };

  // Próximo passo
  const nextStep = () => {
    currentStep.value++;
  };

  // Passo anterior
  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  // Completar onboarding
  const completeOnboarding = () => {
    isOnboardingActive.value = false;
    hasCompletedOnboarding.value = true;

    // Salvar em localStorage
    if (!import.meta.server) {
      localStorage.setItem("onboarding-completed", "true");
    }

    const onboardingCookie = useCookie<string>("onboarding-completed", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    onboardingCookie.value = "true";
  };

  // Reiniciar onboarding
  const resetOnboarding = () => {
    hasCompletedOnboarding.value = false;
    currentStep.value = 0;
    isOnboardingActive.value = false;

    // Remover do localStorage
    if (!import.meta.server) {
      localStorage.removeItem("onboarding-completed");
    }

    const onboardingCookie = useCookie<string>("onboarding-completed", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    onboardingCookie.value = "";
  };

  return {
    hasCompletedOnboarding,
    currentStep,
    isOnboardingActive,
    startOnboarding,
    nextStep,
    previousStep,
    completeOnboarding,
    resetOnboarding,
    checkOnboardingStatus,
  };
});
