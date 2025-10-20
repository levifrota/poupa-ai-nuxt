<template>
  <div v-if="onboardingStore.isOnboardingActive" class="fixed inset-0 z-50">
    <!-- Overlay escuro -->
    <div class="absolute inset-0 bg-black/60 transition-opacity" @click="handleSkip" />

    <!-- Spotlight para destacar o elemento -->
    <div
      v-if="currentStepConfig"
      class="absolute transition-all duration-300 pointer-events-none"
      :style="spotlightStyle"
    >
      <div
        class="absolute inset-0 rounded-lg ring-4 ring-primary ring-offset-4 ring-offset-black/60"
      />
    </div>

    <!-- Card de instrução -->
    <div
      v-if="currentStepConfig"
      class="absolute bg-card border rounded-lg shadow-2xl p-6 max-w-md z-10 transition-all duration-300"
      :style="cardStyle"
    >
      <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Icon :name="currentStepConfig.icon" class="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 class="text-lg font-semibold">{{ currentStepConfig.title }}</h3>
              <p class="text-sm text-muted-foreground">
                Passo {{ onboardingStore.currentStep + 1 }} de {{ steps.length }}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" @click="handleSkip">
            <Icon name="lucide:x" class="h-4 w-4" />
          </Button>
        </div>

        <!-- Conteúdo -->
        <div class="space-y-2">
          <p class="text-sm">{{ currentStepConfig.description }}</p>
          <ul
            v-if="currentStepConfig.tips"
            class="text-sm space-y-1 text-muted-foreground"
          >
            <li
              v-for="(tip, index) in currentStepConfig.tips"
              :key="index"
              class="flex items-start gap-2"
            >
              <Icon
                name="lucide:check"
                class="h-4 w-4 text-primary mt-0.5 flex-shrink-0"
              />
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>

        <!-- Progress bar -->
        <div class="space-y-2">
          <div class="h-2 bg-muted rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-300"
              :style="{
                width: `${((onboardingStore.currentStep + 1) / steps.length) * 100}%`,
              }"
            />
          </div>
        </div>

        <!-- Ações -->
        <div class="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            :disabled="onboardingStore.currentStep === 0"
            @click="onboardingStore.previousStep()"
          >
            <Icon name="lucide:arrow-left" class="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <div class="flex gap-2">
            <Button variant="outline" size="sm" @click="handleSkip"> Pular </Button>
            <Button size="sm" @click="handleNext">
              {{ isLastStep ? "Concluir" : "Próximo" }}
              <Icon v-if="!isLastStep" name="lucide:arrow-right" class="ml-2 h-4 w-4" />
              <Icon v-else name="lucide:check" class="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "~/components/ui/button/index.js";

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
    position: "bottom",
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
    position: "left",
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
    position: "bottom",
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
    position: "left",
    tips: [
      "Análise inteligente das suas finanças",
      "Dicas personalizadas de economia",
      "Exporte em PDF",
    ],
  },
  {
    title: "Configurações de Acessibilidade",
    description: "Personalize temas e fontes para melhor acessibilidade.",
    icon: "lucide:settings",
    route: "/settings",
    targetSelector: '[aria-label="Navegar para Configurações"]',
    position: "top",
    tips: [
      "Temas para daltonismo",
      "Ajuste de tamanho de fonte",
      "Fonte para dislexia (OpenDyslexic)",
      "Modo alto contraste",
    ],
  },
];

const currentStepConfig = computed(() => steps[onboardingStore.currentStep]);
const isLastStep = computed(() => onboardingStore.currentStep === steps.length - 1);

const spotlightStyle = ref({});
const cardStyle = ref({});

const navigateToStepRoute = async () => {
  const step = currentStepConfig.value;
  if (step && router.currentRoute.value.path !== step.route) {
    await router.push(step.route);
    await nextTick();
    // Aguardar um pouco mais para garantir que a página carregou
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
};

const updatePositions = () => {
  const step = currentStepConfig.value;
  if (!step) return;

  const element = document.querySelector(step.targetSelector);
  if (!element) {
    console.warn(`Elemento não encontrado: ${step.targetSelector}`);
    // Fallback para centralizar se o elemento não for encontrado
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
    return;
  }

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
  const cardWidth = 384; // max-w-md
  const cardPadding = 20;
  let top = 0;
  let left = 0;

  switch (step.position) {
    case "top":
      top = rect.top - 200 - cardPadding;
      left = rect.left + rect.width / 2 - cardWidth / 2;
      break;
    case "bottom":
      top = rect.bottom + cardPadding;
      left = rect.left + rect.width / 2 - cardWidth / 2;
      break;
    case "left":
      top = rect.top + rect.height / 2 - 100;
      left = rect.left - cardWidth - cardPadding;
      break;
    case "right":
      top = rect.top + rect.height / 2 - 100;
      left = rect.right + cardPadding;
      break;
  }

  // Garantir que o card fique dentro da viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < cardPadding) left = cardPadding;
  if (left + cardWidth > viewportWidth - cardPadding) {
    left = viewportWidth - cardWidth - cardPadding;
  }
  if (top < cardPadding) top = cardPadding;
  if (top + 300 > viewportHeight - cardPadding) {
    top = viewportHeight - 300 - cardPadding;
  }

  cardStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  };
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
  if (
    confirm(
      "Tem certeza que deseja pular o tour? Você pode refazê-lo depois nas configurações."
    )
  ) {
    onboardingStore.completeOnboarding();
    router.push("/");
  }
};

// Atualizar posição do spotlight e card quando mudar de passo
watch(
  () => onboardingStore.currentStep,
  async () => {
    await navigateToStepRoute();
    await nextTick();
    updatePositions();
  },
  { immediate: true }
);

// Atualizar posições quando a janela é redimensionada
onMounted(() => {
  window.addEventListener("resize", updatePositions);
});

onUnmounted(() => {
  window.removeEventListener("resize", updatePositions);
});
</script>
