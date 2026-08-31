<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCurrentUser } from "vuefire";
import { Button } from "~/components/ui/button/index.js";
import {
  createTelegramLinkCode,
  getTelegramLinkStatus,
  unlinkTelegramChat,
} from "~/service/telegramLinkService.js";

const user = useCurrentUser();
const config = useRuntimeConfig();

const isLoading = ref(true);
const isLinked = ref(false);
const linkedChatId = ref<string | null>(null);
const linkCode = ref<string | null>(null);
const isGeneratingCode = ref(false);
const isUnlinking = ref(false);
const fetchError = ref<string | null>(null);
const actionError = ref<string | null>(null);
const copyFeedback = ref<string | null>(null);

const botUsername = config.public.telegramBotUsername as string | undefined;

const deepLink = computed(() => {
  if (!botUsername || !linkCode.value) return null;
  return `https://t.me/${botUsername}?start=${linkCode.value}`;
});

async function fetchLinkStatus() {
  if (!user.value?.uid) return;
  try {
    isLoading.value = true;
    fetchError.value = null;
    const status = await getTelegramLinkStatus(user.value.uid);
    isLinked.value = status.linked;
    linkedChatId.value = status.chatId ?? null;
  } catch (error) {
    console.error("Erro ao verificar vínculo com o Telegram:", error);
    fetchError.value = "Erro ao verificar vínculo com o Telegram.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchLinkStatus);

async function handleGenerateCode() {
  if (!user.value?.uid) return;
  try {
    isGeneratingCode.value = true;
    actionError.value = null;
    linkCode.value = await createTelegramLinkCode(user.value.uid);
  } catch (error) {
    console.error("Erro ao gerar código de vínculo do Telegram:", error);
    actionError.value = "Erro ao gerar código. Tente novamente.";
  } finally {
    isGeneratingCode.value = false;
  }
}

async function handleCopyCode() {
  if (!linkCode.value) return;
  try {
    await navigator.clipboard.writeText(linkCode.value);
    copyFeedback.value = "Código copiado!";
  } catch {
    copyFeedback.value = "Não foi possível copiar. Copie manualmente.";
  }
}

async function handleUnlink() {
  if (!linkedChatId.value) return;
  if (!confirm("Desvincular sua conta do Telegram?")) return;

  try {
    isUnlinking.value = true;
    actionError.value = null;
    await unlinkTelegramChat(linkedChatId.value);
    isLinked.value = false;
    linkedChatId.value = null;
    linkCode.value = null;
  } catch (error) {
    console.error("Erro ao desvincular Telegram:", error);
    actionError.value = "Erro ao desvincular. Tente novamente.";
  } finally {
    isUnlinking.value = false;
  }
}
</script>

<template>
  <div
    class="bg-card rounded-lg p-6 shadow-sm mb-6"
    role="region"
    aria-label="Integração com o Telegram"
  >
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xl font-semibold">Telegram</h2>
    </div>
    <p class="text-sm text-muted-foreground mb-4">
      Vincule sua conta ao Telegram para registrar transações enviando mensagens de texto ou áudio
      para o bot.
    </p>

    <div v-if="fetchError" role="alert" class="text-red-500 mb-2">{{ fetchError }}</div>

    <div
      v-if="isLoading"
      class="flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
      <span>Verificando vínculo com o Telegram...</span>
    </div>

    <div v-else-if="isLinked" class="flex flex-col gap-3">
      <p role="status" class="text-sm text-green-600 dark:text-green-400">
        ✅ Sua conta está vinculada ao Telegram.
      </p>
      <div v-if="actionError" role="alert" class="text-red-500 text-sm">{{ actionError }}</div>
      <Button
        variant="destructive"
        class="w-fit"
        :disabled="isUnlinking"
        aria-label="Desvincular conta do Telegram"
        @click="handleUnlink"
      >
        {{ isUnlinking ? "Desvinculando..." : "Desvincular" }}
      </Button>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div v-if="actionError" role="alert" class="text-red-500 text-sm">{{ actionError }}</div>

      <Button v-if="!linkCode" class="w-fit" :disabled="isGeneratingCode" @click="handleGenerateCode">
        {{ isGeneratingCode ? "Gerando..." : "Gerar código de vínculo" }}
      </Button>

      <div v-else class="flex flex-col gap-3">
        <a
          v-if="deepLink"
          :href="deepLink"
          target="_blank"
          rel="noopener noreferrer"
          class="w-fit"
        >
          <Button aria-label="Abrir o Telegram e vincular automaticamente">
            Abrir no Telegram
          </Button>
        </a>

        <div class="text-sm">
          <p class="text-muted-foreground mb-1">
            Ou envie manualmente <code>/start {{ linkCode }}</code> para o bot no Telegram:
          </p>
          <div class="flex items-center gap-2">
            <code
              class="bg-muted px-3 py-1.5 rounded font-mono text-base tracking-widest"
              aria-label="Código de vínculo"
              >{{ linkCode }}</code
            >
            <Button size="sm" variant="outline" aria-label="Copiar código de vínculo" @click="handleCopyCode">
              Copiar
            </Button>
          </div>
          <p v-if="copyFeedback" role="status" aria-live="polite" class="text-xs text-muted-foreground mt-1">
            {{ copyFeedback }}
          </p>
        </div>

        <p class="text-xs text-muted-foreground">O código expira em 10 minutos.</p>
      </div>
    </div>
  </div>
</template>
