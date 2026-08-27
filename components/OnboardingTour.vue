<template>
  <!-- Dialog de confirmação para pular o tour -->
  <Dialog v-model:open="showSkipDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pular tour guiado?</DialogTitle>
        <DialogDescription>
          Tem certeza que deseja pular o tour? Você pode refazê-lo depois nas
          configurações.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2">
        <Button variant="outline" @click="showSkipDialog = false">
          Continuar tour
        </Button>
        <Button @click="confirmSkip">Pular tour</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <div
    v-if="onboardingStore.isOnboardingActive"
    class="fixed inset-0 z-50"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="`onboarding-title-${onboardingStore.currentStep}`"
    :aria-describedby="`onboarding-description-${onboardingStore.currentStep}`"
    aria-label="Tour guiado do Poupa.ai"
  >
    <!-- Overlay escuro -->
    <div
      class="absolute inset-0 bg-black/60 transition-opacity"
      aria-hidden="true"
      @click="handleSkip"
    />

    <!-- Spotlight para destacar o elemento -->
    <div
      v-if="currentStepConfig"
      class="absolute transition-all duration-300 pointer-events-none"
      :style="spotlightStyle"
      aria-hidden="true"
    >
      <div
        class="absolute inset-0 rounded-lg ring-4 ring-primary ring-offset-4 ring-offset-black/60"
      />
    </div>

    <!-- Anúncio de mudança de passo para leitores de tela -->
    <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
      {{ currentStepConfig?.title }}. Passo {{ onboardingStore.currentStep + 1 }} de
      {{ steps.length }}. {{ currentStepConfig?.description }}
    </div>

    <!-- Card de instrução -->
    <div
      v-if="currentStepConfig"
      class="absolute bg-card border rounded-lg shadow-2xl p-4 sm:p-6 max-w-[90vw] sm:max-w-md z-10 transition-all duration-300"
      :style="cardStyle"
      role="document"
    >
      <div class="space-y-3 sm:space-y-4">
        <!-- Header -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div
              class="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0"
              aria-hidden="true"
            >
              <Icon
                :name="currentStepConfig.icon"
                class="h-5 w-5 sm:h-6 sm:w-6 text-primary"
              />
            </div>
            <div class="min-w-0 flex-1">
              <h3
                :id="`onboarding-title-${onboardingStore.currentStep}`"
                class="text-base sm:text-lg font-semibold truncate"
              >
                {{ currentStepConfig.title }}
              </h3>
              <p
                class="text-xs sm:text-sm text-muted-foreground"
                :aria-label="`Progresso: passo ${onboardingStore.currentStep + 1} de ${
                  steps.length
                }`"
              >
                Passo {{ onboardingStore.currentStep + 1 }} de {{ steps.length }}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 flex-shrink-0"
            aria-label="Fechar tour guiado"
            title="Fechar tour guiado"
            @click="handleSkip"
          >
            <Icon name="lucide:x" class="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <!-- Conteúdo -->
        <div class="space-y-2">
          <p
            :id="`onboarding-description-${onboardingStore.currentStep}`"
            class="text-xs sm:text-sm leading-relaxed"
          >
            {{ currentStepConfig.description }}
          </p>
          <ul
            v-if="currentStepConfig.tips"
            class="text-xs sm:text-sm space-y-1 text-muted-foreground"
            aria-label="Dicas sobre esta funcionalidade"
          >
            <li
              v-for="(tip, index) in currentStepConfig.tips"
              :key="index"
              class="flex items-start gap-2"
            >
              <Icon
                name="lucide:check"
                class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span class="flex-1">{{ tip }}</span>
            </li>
          </ul>
        </div>

        <!-- Progress bar -->
        <div class="space-y-2">
          <div
            class="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden"
            role="progressbar"
            :aria-valuenow="onboardingStore.currentStep + 1"
            aria-valuemin="1"
            :aria-valuemax="steps.length"
            :aria-label="`Progresso do tour: ${onboardingStore.currentStep + 1} de ${
              steps.length
            } passos concluídos`"
          >
            <div
              class="h-full bg-primary transition-all duration-300"
              :style="{
                width: `${((onboardingStore.currentStep + 1) / steps.length) * 100}%`,
              }"
              aria-hidden="true"
            />
          </div>
        </div>

        <!-- Ações -->
        <nav
          class="flex items-center justify-between gap-2"
          aria-label="Navegação do tour guiado"
        >
          <Button
            variant="ghost"
            size="sm"
            class="h-8 text-xs sm:text-sm"
            :disabled="onboardingStore.currentStep === 0"
            aria-label="Voltar para o passo anterior"
            :aria-disabled="onboardingStore.currentStep === 0"
            @click="onboardingStore.previousStep()"
          >
            <Icon
              name="lucide:arrow-left"
              class="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4"
              aria-hidden="true"
            />
            <span class="hidden sm:inline">Anterior</span>
            <span class="sm:hidden">Ant.</span>
          </Button>

          <div class="flex gap-2" role="group" aria-label="Ações do tour">
            <Button
              variant="outline"
              size="sm"
              class="h-8 text-xs sm:text-sm"
              aria-label="Pular tour guiado"
              @click="handleSkip"
            >
              Pular
            </Button>
            <Button
              size="sm"
              class="h-8 text-xs sm:text-sm"
              :aria-label="
                isLastStep ? 'Concluir tour guiado' : 'Ir para o próximo passo'
              "
              @click="handleNext"
            >
              <span class="hidden sm:inline">{{
                isLastStep ? "Concluir" : "Próximo"
              }}</span>
              <span class="sm:hidden">{{ isLastStep ? "OK" : "Prox." }}</span>
              <Icon
                v-if="!isLastStep"
                name="lucide:arrow-right"
                class="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
              <Icon
                v-else
                name="lucide:check"
                class="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
            </Button>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "~/components/ui/button/index.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const router = useRouter();
const onboardingStore = useOnboardingStore();

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  route: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right";
  tips?: string[];
}

const steps: OnboardingStep[] = [
  {
    title: "Bem-vindo ao Poupa.ai! 👋",
    description:
      "Vamos fazer um tour rápido para você conhecer as principais funcionalidades.",
    icon: "lucide:rocket",
    route: "/",
    targetSelector: "body",
    position: "top",
    tips: [
      "Este tour levará apenas 2 minutos",
      "Você pode pular ou pausar a qualquer momento",
      "Pode refazer o tour nas configurações",
    ],
  },
  {
    title: "Adicionar Transação",
    description: "Clique aqui para adicionar suas receitas, despesas e investimentos.",
    icon: "lucide:plus-circle",
    route: "/",
    targetSelector: '[aria-label="Adicionar transação"]',
    position: "right",
    tips: [
      "Registre receitas, despesas e investimentos",
      "Categorize suas transações",
      "Escolha o método de pagamento",
    ],
  },
  {
    title: "Resumo Financeiro",
    description: "Acompanhe seu saldo, receitas, despesas e investimentos em tempo real.",
    icon: "lucide:wallet",
    route: "/",
    targetSelector: '[aria-label*="Saldo"]',
    position: "bottom",
    tips: [
      "Veja seu saldo atual",
      "Acompanhe receitas e despesas",
      "Monitore seus investimentos",
    ],
  },
  {
    title: "Gráficos e Análises",
    description: "Visualize a distribuição dos seus gastos por categoria e tipo.",
    icon: "lucide:pie-chart",
    route: "/",
    targetSelector: '[aria-label="Gráfico de pizza da distribuição de transações"]',
    position: "right",
    tips: [
      "Veja gastos por categoria",
      "Analise porcentagens",
      "Identifique padrões de consumo",
    ],
  },
  {
    title: "Lista de Transações",
    description: "Acesse todas as suas transações com filtros e busca.",
    icon: "lucide:arrow-left-right",
    route: "/transactions",
    targetSelector: '[aria-label="Navegar para Transações"]',
    position: "top",
    tips: [
      "Busque transações específicas",
      "Edite ou exclua registros",
      "Ordene por data, valor ou tipo",
    ],
  },
  {
    title: "Relatório com IA",
    description:
      "Gere relatórios inteligentes sobre suas finanças com análises e dicas personalizadas.",
    icon: "lucide:bot",
    route: "/",
    targetSelector: '[aria-label="Abrir diálogo de relatório de IA"]',
    position: "right",
    tips: [
      "Análise inteligente das suas finanças",
      "Dicas personalizadas de economia",
      "Exporte em PDF",
    ],
  },
  {
    title: "Configurações",
    description: "Personalize temas e fontes para melhor acessibilidade.",
    icon: "lucide:settings",
    route: "/settings",
    targetSelector: '[aria-label="Navegar para Configurações"]',
    position: "top",
    tips: [
      "Temas para daltonismo",
      "Ajuste de tamanho de fonte",
      "Fonte para dislexia",
      "Modo alto contraste",
    ],
  },
  {
    title: "Perfil do Usuário",
    description: "Gerencie suas informações pessoais e preferências da conta.",
    icon: "lucide:user",
    route: "/",
    targetSelector: '[aria-label="Menu do usuário"]',
    position: "bottom",
    tips: [
      "Atualize seus dados pessoais",
      "Altere sua senha",
      "Faça logout quando necessário",
    ],
  },
];

const currentStepConfig = computed(() => steps[onboardingStore.currentStep]);
const isLastStep = computed(() => onboardingStore.currentStep === steps.length - 1);

const spotlightStyle = ref({});
const cardStyle = ref({});
const isMobile = ref(false);
const showSkipDialog = ref(false);

// Detectar se é mobile
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const navigateToStepRoute = async () => {
  if (!onboardingStore.isOnboardingActive) return;
  const step = currentStepConfig.value;
  if (step && router.currentRoute.value.path !== step.route) {
    await router.push(step.route);
    await nextTick();
    // Aguardar um pouco mais para garantir que a página carregou
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
};

const scrollToElement = (
  element: Element,
  isFooterElement: boolean = false,
  isBodyElement: boolean = false
) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Para elementos do footer no mobile, não fazer scroll - eles já estão fixos na parte inferior
  if (isFooterElement && isMobile.value) {
    return Promise.resolve();
  }

  // Para o elemento body (primeiro passo), fazer scroll para o topo
  if (isBodyElement) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    return new Promise((resolve) => setTimeout(resolve, 400));
  }

  // Verificar se o elemento está visível na viewport
  const isVisible =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= viewportHeight &&
    rect.right <= viewportWidth;

  if (!isVisible) {
    // Calcular a posição ideal para scroll
    const footerHeight = isMobile.value ? 52 : 0;
    const headerHeight = isMobile.value ? 0 : 60;
    const cardHeight = 320; // Altura estimada do card + padding

    let scrollTop = window.scrollY;
    let scrollLeft = window.scrollX;

    // Scroll vertical
    if (rect.top < headerHeight) {
      // Elemento acima da viewport
      scrollTop = window.scrollY + rect.top - headerHeight - 20;
    } else if (rect.bottom > viewportHeight - footerHeight) {
      // Elemento abaixo da viewport
      scrollTop =
        window.scrollY + rect.bottom - viewportHeight + footerHeight + cardHeight + 20;
    }

    // Scroll horizontal (para desktop)
    if (!isMobile.value) {
      if (rect.left < 0) {
        scrollLeft = window.scrollX + rect.left - 20;
      } else if (rect.right > viewportWidth) {
        scrollLeft = window.scrollX + rect.right - viewportWidth + 20;
      }
    }

    // Fazer o scroll suave
    window.scrollTo({
      top: Math.max(0, scrollTop),
      left: Math.max(0, scrollLeft),
      behavior: "smooth",
    });

    // Aguardar o scroll completar antes de atualizar as posições
    return new Promise((resolve) => setTimeout(resolve, 400));
  }

  return Promise.resolve();
};

const updatePositions = async () => {
  const step = currentStepConfig.value;
  if (!step) return;

  checkIsMobile();

  // Para mobile, buscar especificamente no footer para os passos de navegação
  let element: Element | null = null;
  let isFooterElement = false;
  let isBodyElement = false;

  if (
    isMobile.value &&
    (step.title === "Lista de Transações" ||
      step.title === "Configurações" ||
      step.title === "Perfil do Usuário")
  ) {
    // Buscar o elemento dentro do footer (Menubar com aria-label="Navegação principal")
    const footer = document.querySelector('[aria-label="Navegação principal"]');
    if (footer) {
      element = footer.querySelector(step.targetSelector);
      isFooterElement = true;
    }
  } else {
    element = document.querySelector(step.targetSelector);
    // Verificar se é o elemento body (primeiro passo)
    if (element && element.tagName.toLowerCase() === "body") {
      isBodyElement = true;
    }
  }

  if (!element) {
    console.warn(`Elemento não encontrado: ${step.targetSelector}`);
    // Fallback para centralizar se o elemento não for encontrado
    if (isMobile.value) {
      spotlightStyle.value = {
        top: "40%",
        left: "50%",
        width: "90vw",
        height: "200px",
        transform: "translate(-50%, -50%)",
      };

      cardStyle.value = {
        bottom: "80px", // Acima do footer
        left: "50%",
        transform: "translateX(-50%)",
      };
    } else {
      spotlightStyle.value = {
        top: "50%",
        left: "50%",
        width: "400px",
        height: "300px",
        transform: "translate(-50%, -50%)",
      };

      cardStyle.value = {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }
    return;
  }

  // Fazer scroll para o elemento se necessário
  await scrollToElement(element, isFooterElement, isBodyElement);

  // Recalcular rect após o scroll
  const rect = element.getBoundingClientRect();
  const padding = 8;

  // Posição do spotlight
  spotlightStyle.value = {
    top: `${rect.top - padding}px`,
    left: `${rect.left - padding}px`,
    width: `${rect.width + padding * 2}px`,
    height: `${rect.height + padding * 2}px`,
  };

  // Posição do card baseada na posição definida
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Altura do footer (52px = h-13)
  const footerHeight = 52;
  const cardPadding = 20;

  if (isMobile.value) {
    // No mobile, sempre posicionar acima do footer ou abaixo do elemento
    const cardHeight = 320; // Altura estimada do card

    let top = 0;
    const left = viewportWidth / 2;
    const transform = "translateX(-50%)";

    // Para passos 5, 7 e 8 (elementos do footer), sempre posicionar acima do footer inteiro
    if (
      step.title === "Lista de Transações" ||
      step.title === "Configurações" ||
      step.title === "Perfil do Usuário"
    ) {
      // Posicionar o card acima do footer, garantindo que o footer fique visível
      const footerTop = viewportHeight - footerHeight;
      top = Math.max(footerTop - cardHeight - cardPadding, cardPadding);
    } else if (step.title === "Bem-vindo ao Poupa.ai! 👋") {
      // Para o primeiro passo (body), sempre posicionar no topo
      top = cardPadding;
    } else {
      // Para outros passos, verificar se o elemento está na metade superior ou inferior da tela
      const elementMiddle = rect.top + rect.height / 2;
      const viewportMiddle = viewportHeight / 2;

      if (elementMiddle < viewportMiddle) {
        // Elemento na parte superior - posicionar card abaixo
        top = Math.min(
          rect.bottom + cardPadding,
          viewportHeight - cardHeight - footerHeight - cardPadding
        );
      } else {
        // Elemento na parte inferior - posicionar card acima
        top = Math.max(rect.top - cardHeight - cardPadding, cardPadding);
      }
    }

    cardStyle.value = {
      top: `${top}px`,
      left: `${left}px`,
      transform,
    };
  } else {
    // Desktop - usar posicionamento original
    const cardWidth = 384; // max-w-md
    const cardHeight = 320; // Altura estimada do card
    let top = 0;
    let left = 0;

    // Para passos 5, 6, 7 e 8, garantir que o card não cubra o spotlight
    const isNavigationStep =
      step.title === "Lista de Transações" ||
      step.title === "Relatório com IA" ||
      step.title === "Configurações" ||
      step.title === "Perfil do Usuário";

    if (isNavigationStep) {
      // Calcular posição baseada na position definida, mas ajustar se necessário
      const preferredPosition = step.position;

      switch (preferredPosition) {
        case "top":
          top = rect.top - cardHeight - cardPadding;
          left = rect.left + rect.width / 2 - cardWidth / 2;

          // Se não couber acima, tentar embaixo
          if (top < cardPadding) {
            top = rect.bottom + cardPadding;
          }
          break;
        case "bottom":
          top = rect.bottom + cardPadding;
          left = rect.left + rect.width / 2 - cardWidth / 2;

          // Se não couber embaixo, tentar acima
          if (top + cardHeight > viewportHeight - cardPadding) {
            top = rect.top - cardHeight - cardPadding;
          }
          break;
        case "left":
          top = rect.top + rect.height / 2 - cardHeight / 2;
          left = rect.left - cardWidth - cardPadding;

          // Se não couber à esquerda, tentar à direita
          if (left < cardPadding) {
            left = rect.right + cardPadding;
          }
          break;
        case "right":
          top = rect.top + rect.height / 2 - cardHeight / 2;
          left = rect.right + cardPadding;

          // Se não couber à direita, tentar à esquerda
          if (left + cardWidth > viewportWidth - cardPadding) {
            left = rect.left - cardWidth - cardPadding;
          }
          break;
      }
    } else {
      // Para outros passos, usar posicionamento original
      switch (step.position) {
        case "top":
          top = rect.top - 280 - cardPadding;
          left = rect.left + rect.width / 2 - cardWidth / 2;
          break;
        case "bottom":
          top = rect.bottom + cardPadding;
          left = rect.left + rect.width / 2 - cardWidth / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - 140;
          left = rect.left - cardWidth - cardPadding;
          break;
        case "right":
          top = rect.top + rect.height / 2 - 140;
          left = rect.right + cardPadding;
          break;
      }
    }

    // Garantir que o card fique dentro da viewport
    if (left < cardPadding) left = cardPadding;
    if (left + cardWidth > viewportWidth - cardPadding) {
      left = viewportWidth - cardWidth - cardPadding;
    }
    if (top < cardPadding) top = cardPadding;
    if (top + cardHeight > viewportHeight - cardPadding) {
      top = viewportHeight - cardHeight - cardPadding;
    }

    cardStyle.value = {
      top: `${top}px`,
      left: `${left}px`,
    };
  }
};

const handleNext = () => {
  if (isLastStep.value) {
    onboardingStore.completeOnboarding();
    router.push("/");
  } else {
    onboardingStore.nextStep();
  }
};

const handleSkip = () => {
  showSkipDialog.value = true;
};

const confirmSkip = () => {
  showSkipDialog.value = false;
  onboardingStore.completeOnboarding();
  router.push("/");
};

// Suporte para navegação por teclado (ESC para fechar)
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && onboardingStore.isOnboardingActive) {
    handleSkip();
  }
};

// Adicionar listener de teclado
onMounted(() => {
  checkIsMobile();
  window.addEventListener("resize", updatePositions);
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("resize", updatePositions);
  window.removeEventListener("keydown", handleKeyDown);
});

// Atualizar posição do spotlight e card quando mudar de passo
watch(
  () => onboardingStore.currentStep,
  async () => {
    await navigateToStepRoute();
    await nextTick();
    // Aguardar um pouco mais para garantir que a página renderizou
    await new Promise((resolve) => setTimeout(resolve, 100));
    await updatePositions();
  },
  { immediate: true }
);
</script>

<style scoped>
/* Screen reader only class for accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
