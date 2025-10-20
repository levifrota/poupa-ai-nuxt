<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Configurações</h1>

    <div class="bg-card rounded-lg p-6 shadow-sm mb-6">
      <h2 class="text-xl font-semibold mb-4">Tema</h2>

      <div class="space-y-4">
        <div>
          <h3 id="theme-label" class="text-sm font-medium mb-3">Temas Gerais</h3>
          <div class="w-full max-w-xs">
            <Select v-model="themeStore.theme" @update:model-value="themeStore.setTheme">
              <SelectTrigger class="w-full" aria-labelledby="theme-label">
                <SelectValue placeholder="Selecione um tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Temas Gerais</SelectLabel>
                  <SelectItem value="dark">
                    <Icon name="lucide:moon" class="mr-2" />
                    Escuro
                  </SelectItem>
                  <SelectItem value="light">
                    <Icon name="lucide:sun" class="mr-2" />
                    Claro
                  </SelectItem>
                  <SelectItem value="high-contrast">
                    <Icon name="lucide:zap" class="mr-2" />
                    Alto Contraste
                  </SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Temas para Daltonismo</SelectLabel>
                  <SelectItem value="colorblind">
                    <Icon name="lucide:eye" class="mr-2" />
                    Geral
                  </SelectItem>
                  <SelectItem value="protanopia">
                    <Icon name="lucide:eye" class="mr-2" />
                    Protanopia
                  </SelectItem>
                  <SelectItem value="deuteranopia">
                    <Icon name="lucide:eye" class="mr-2" />
                    Deuteranopia
                  </SelectItem>
                  <SelectItem value="tritanopia">
                    <Icon name="lucide:eye" class="mr-2" />
                    Tritanopia
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            Temas otimizados para diferentes tipos de daltonismo: protanopia (deficiência
            de vermelho), deuteranopia (deficiência de verde) e tritanopia (deficiência de
            azul).
          </p>
        </div>
      </div>
    </div>

    <div class="bg-card rounded-lg p-6 shadow-sm mb-6">
      <h2 class="text-xl font-semibold mb-4">Fonte</h2>

      <div class="space-y-6">
        <div>
          <h3 id="font-family-label" class="text-sm font-medium mb-3">Fonte</h3>
          <div class="w-full max-w-xs">
            <Select
              v-model="fontStore.fontFamily"
              @update:model-value="fontStore.setFontFamily"
            >
              <SelectTrigger class="w-full" aria-labelledby="font-family-label">
                <SelectValue placeholder="Selecione um tipo de fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <Icon name="lucide:type" class="mr-2" />
                  Padrão
                </SelectItem>
                <SelectItem value="open-dyslexic">
                  <Icon name="lucide:book-open" class="mr-2" />
                  OpenDyslexic
                </SelectItem>
                <SelectItem value="arial">
                  <Icon name="lucide:type" class="mr-2" />
                  Arial
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 id="font-size-label" class="text-sm font-medium mb-3">Tamanho da Fonte</h3>
          <div class="w-full max-w-xs">
            <Select
              v-model="fontStore.fontSize"
              @update:model-value="fontStore.setFontSize"
            >
              <SelectTrigger class="w-full" aria-labelledby="font-size-label">
                <SelectValue placeholder="Selecione um tamanho de fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">
                  <Icon name="lucide:text" class="mr-2" />
                  Pequeno
                </SelectItem>
                <SelectItem value="medium">
                  <Icon name="lucide:text" class="mr-2" />
                  Médio
                </SelectItem>
                <SelectItem value="large">
                  <Icon name="lucide:text" class="mr-2" />
                  Grande
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção de Ajuda -->
    <div class="bg-card rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4">Ajuda</h2>

      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium mb-2">Tour de Introdução</h3>
          <p class="text-sm text-muted-foreground mb-3">
            Refaça o tour inicial para conhecer as funcionalidades do sistema.
          </p>
          <Button @click="handleRestartOnboarding">
            <Icon name="lucide:help-circle" class="mr-2 h-4 w-4" />
            Refazer Tour
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Icon } from "#components";

definePageMeta({
  middleware: "auth",
});

const themeStore = useThemeStore();
const fontStore = useFontStore();
const onboardingStore = useOnboardingStore();
const router = useRouter();

const handleRestartOnboarding = () => {
  onboardingStore.resetOnboarding();
  router.push("/");
  setTimeout(() => {
    onboardingStore.startOnboarding();
  }, 500);
};
</script>
