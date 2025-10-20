import { defineStore } from 'pinia';

export const useOnboardingStore = defineStore('onboarding', () => {
  const hasCompletedOnboarding = ref(false);
  const currentStep = ref(0);
  const isOnboardingActive = ref(false);

  // Verificar se o usuário já completou o onboarding
  const checkOnboardingStatus = () => {
    if (import.meta.server) return;
    
    const onboardingCookie = useCookie<string>('onboarding-completed', {
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      path: '/'
    });
    
    hasCompletedOnboarding.value = onboardingCookie.value === 'true';
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
    
    const onboardingCookie = useCookie<string>('onboarding-completed', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/'
    });
    onboardingCookie.value = 'true';
  };

  // Reiniciar onboarding
  const resetOnboarding = () => {
    hasCompletedOnboarding.value = false;
    currentStep.value = 0;
    isOnboardingActive.value = false;
    
    const onboardingCookie = useCookie<string>('onboarding-completed', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/'
    });
    onboardingCookie.value = '';
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
    checkOnboardingStatus
  };
});
