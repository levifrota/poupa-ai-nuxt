<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Configurações</h1>

    <div class="bg-card rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4">Configurações de Tema</h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Selecionar temas</span>
          <div class="flex gap-2">
            <Button
              :variant="themeStore.theme === 'dark' ? 'default' : 'outline'"
              size="sm"
              @click="themeStore.setTheme('dark')"
            >
              <Icon name="lucide:moon" class="mr-2" />
              Escuro
            </Button>

            <Button
              :variant="themeStore.theme === 'light' ? 'default' : 'outline'"
              size="sm"
              @click="themeStore.setTheme('light')"
            >
              <Icon name="lucide:sun" class="mr-2" />
              Claro
            </Button>

            <Button
              :variant="themeStore.theme === 'colorblind' ? 'default' : 'outline'"
              size="sm"
              @click="themeStore.setTheme('colorblind')"
            >
              <Icon name="lucide:eye" class="mr-2" />
              Daltônicos
            </Button>
          </div>
        </div>

        <div class="text-xs text-muted-foreground">
          <p v-if="themeStore.theme === 'dark'">
            O tema escuro reduz o cansaço visual em ambientes com pouca luz e economiza
            bateria.
          </p>
          <p v-else-if="themeStore.theme === 'light'">
            O tema claro proporciona melhor legibilidade em ambientes claros.
          </p>
          <p v-else-if="themeStore.theme === 'colorblind'">
            O tema para daltônicos usa cores de alto contraste que são mais fáceis de
            distinguir para pessoas com deficiências de visão de cores.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/app/_components/ui/button";
import { useThemeStore } from "@/app/_composables/useThemeStore";

const themeStore = useThemeStore();
</script>
