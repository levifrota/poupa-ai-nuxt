<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "~/components/ui/button/index.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card/index.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog/index.js";
import { PLANS, PlanId } from "~/constants/subscription.js";
import { calculateYearlySavingsPercent } from "~/lib/subscription.js";

definePageMeta({
  middleware: "auth",
});

type BillingCycle = "monthly" | "yearly";

const billingCycle = ref<BillingCycle>("monthly");
const isComingSoonDialogOpen = ref(false);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const premiumPlan = PLANS.find((plan) => plan.id === PlanId.PREMIUM);
const yearlySavingsPercent = computed(() => {
  if (!premiumPlan) return 0;
  return calculateYearlySavingsPercent(premiumPlan.priceMonthly, premiumPlan.priceYearly);
});

function priceForCycle(priceMonthly: number, priceYearly: number) {
  return billingCycle.value === "monthly" ? priceMonthly : priceYearly;
}

function handleSubscribeClick() {
  isComingSoonDialogOpen.value = true;
}
</script>

<template>
  <div class="container mx-auto max-w-4xl p-6">
    <h1 class="mb-2 text-center text-2xl font-bold">Planos e Assinatura</h1>
    <p class="mb-8 text-center text-muted-foreground">
      Todos os recursos do Poupa.ai são gratuitos por enquanto. Conheça os planos que
      estamos preparando para o futuro.
    </p>

    <div class="mb-8 flex items-center justify-center gap-3">
      <span :class="billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'">
        Mensal
      </span>
      <button
        type="button"
        role="switch"
        :aria-checked="billingCycle === 'yearly'"
        aria-label="Alternar entre cobrança mensal e anual"
        class="relative h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors"
        @click="billingCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly'"
      >
        <span
          class="absolute top-1 h-4 w-4 rounded-full bg-primary transition-transform"
          :class="billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'"
        />
      </button>
      <span :class="billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'">
        Anual
        <span v-if="yearlySavingsPercent > 0" class="text-primary">
          (economize {{ yearlySavingsPercent }}%)
        </span>
      </span>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <Card
        v-for="plan in PLANS"
        :key="plan.id"
        :class="plan.highlighted ? 'border-primary shadow-md' : ''"
      >
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            {{ plan.name }}
            <span
              v-if="plan.highlighted"
              class="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground"
            >
              Em breve
            </span>
          </CardTitle>
          <CardDescription>
            <span class="text-3xl font-bold text-foreground">
              {{ formatCurrency(priceForCycle(plan.priceMonthly, plan.priceYearly)) }}
            </span>
            <span v-if="plan.priceMonthly > 0">
              / {{ billingCycle === "monthly" ? "mês" : "ano" }}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div role="list" class="space-y-2">
            <div v-for="feature in plan.features" :key="feature" role="listitem" class="flex gap-2">
              <Icon name="lucide:check" class="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            v-if="plan.id === PlanId.FREE"
            class="w-full"
            variant="outline"
            disabled
            aria-label="Plano gratuito, já incluso"
          >
            Plano atual
          </Button>
          <Button
            v-else
            class="w-full cursor-pointer"
            :aria-label="`Assinar plano ${plan.name}`"
            @click="handleSubscribeClick"
          >
            Assinar {{ plan.name }}
          </Button>
        </CardFooter>
      </Card>
    </div>

    <Dialog :open="isComingSoonDialogOpen" @update:open="isComingSoonDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Em breve</DialogTitle>
          <DialogDescription>
            A assinatura do plano Premium ainda não está disponível. Por enquanto, todos
            os recursos do Poupa.ai são gratuitos. Avisaremos quando essa funcionalidade
            estiver pronta.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose as-child>
            <Button>Entendi</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
