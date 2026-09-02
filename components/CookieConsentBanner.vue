<script setup lang="ts">
import { ref } from "vue";
import { useCookieConsent } from "~/composables/useCookieConsent";

const {
  showBanner,
  preferences,
  acceptAll,
  rejectNonEssential,
  savePreferences,
} = useCookieConsent();

const showDetails = ref(false);
const analyticsEnabled = ref(preferences.value.analytics);
const functionalityEnabled = ref(preferences.value.functionality);

function handleSavePreferences() {
  savePreferences({
    analytics: analyticsEnabled.value,
    functionality: functionalityEnabled.value,
  });
  showDetails.value = false;
}

function handleAcceptAll() {
  acceptAll();
  showDetails.value = false;
}

function handleRejectNonEssential() {
  rejectNonEssential();
  showDetails.value = false;
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <section
        v-if="showBanner"
        aria-label="Consentimento de cookies"
        class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 shadow-lg sm:p-6"
      >
        <div class="container mx-auto max-w-4xl">
          <!-- Conteúdo principal -->
          <div v-if="!showDetails" class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1 space-y-2">
              <h2 class="text-base font-semibold text-foreground">
                🍪 Utilizamos cookies
              </h2>
              <p class="text-sm text-muted-foreground">
                O Poupa.ai utiliza cookies e tecnologias semelhantes para garantir o funcionamento
                do aplicativo, melhorar sua experiência e analisar o uso do serviço. Ao continuar,
                você concorda com nossa
                <NuxtLink to="/privacidade" class="font-medium text-primary underline underline-offset-2">
                  Política de Privacidade</NuxtLink>.
              </p>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                class="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @click="showDetails = true"
              >
                Personalizar
              </button>
              <button
                class="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @click="handleRejectNonEssential"
              >
                Apenas essenciais
              </button>
              <button
                class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @click="handleAcceptAll"
              >
                Aceitar todos
              </button>
            </div>
          </div>

          <!-- Painel de personalização -->
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-semibold text-foreground">
                Personalizar cookies
              </h2>
              <button
                class="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-1"
                aria-label="Voltar para o banner resumido"
                @click="showDetails = false"
              >
                ← Voltar
              </button>
            </div>

            <div class="space-y-3">
              <!-- Essenciais (sempre ativo) -->
              <div class="flex items-center justify-between rounded-lg border border-border p-3">
                <div class="flex-1">
                  <p class="text-sm font-medium text-foreground">Essenciais</p>
                  <p class="text-xs text-muted-foreground">
                    Necessários para o funcionamento do app (autenticação, sessão, segurança).
                    Não podem ser desativados.
                  </p>
                </div>
                <Switch
                  :model-value="true"
                  disabled
                  aria-label="Cookies essenciais (sempre ativo)"
                />
              </div>

              <!-- Analytics -->
              <div class="flex items-center justify-between rounded-lg border border-border p-3">
                <div class="flex-1">
                  <p class="text-sm font-medium text-foreground">Analytics</p>
                  <p class="text-xs text-muted-foreground">
                    Nos ajudam a entender como você usa o app para melhorar a experiência
                    (Google Analytics / Firebase Analytics).
                  </p>
                </div>
                <Switch
                  v-model="analyticsEnabled"
                  aria-label="Cookies de analytics"
                />
              </div>

              <!-- Funcionalidade -->
              <div class="flex items-center justify-between rounded-lg border border-border p-3">
                <div class="flex-1">
                  <p class="text-sm font-medium text-foreground">Funcionalidade</p>
                  <p class="text-xs text-muted-foreground">
                    Permitem lembrar suas preferências (tema, fonte, moeda) para uma experiência
                    personalizada.
                  </p>
                </div>
                <Switch
                  v-model="functionalityEnabled"
                  aria-label="Cookies de funcionalidade"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                class="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @click="handleRejectNonEssential"
              >
                Rejeitar opcionais
              </button>
              <button
                class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @click="handleSavePreferences"
              >
                Salvar preferências
              </button>
            </div>

            <p class="text-xs text-muted-foreground">
              Para mais informações, consulte nossa
              <NuxtLink to="/privacidade" class="text-primary underline underline-offset-2">
                Política de Privacidade
              </NuxtLink>
              e os
              <NuxtLink to="/termos" class="text-primary underline underline-offset-2">
                Termos de Uso</NuxtLink>.
            </p>
          </div>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

