<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCurrentUser } from "vuefire";
import { Button } from "~/components/ui/button/index.js";
import { useSharedBudgetsStore } from "~/stores/sharedBudgets.js";
import {
  getPendingInvitesForEmail,
  getSharedBudgetsForUser,
  acceptSharedBudgetInvite,
  declineSharedBudgetInvite,
} from "~/service/sharedBudgetService.js";

const user = useCurrentUser();
const sharedBudgetsStore = useSharedBudgetsStore();

const isLoading = ref(false);
const processingInviteId = ref<string | null>(null);

async function fetchPendingInvites() {
  if (!user.value?.email) return;
  try {
    isLoading.value = true;
    const invites = await getPendingInvitesForEmail(user.value.email);
    sharedBudgetsStore.setPendingInvites(invites);
  } catch (error) {
    console.error("Erro ao carregar convites pendentes:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchPendingInvites);

async function handleAccept(inviteId: string) {
  if (!user.value?.uid || !user.value.email) return;
  const invite = sharedBudgetsStore.pendingInvites.find((i) => i.id === inviteId);
  if (!invite) return;

  try {
    processingInviteId.value = inviteId;
    await acceptSharedBudgetInvite(invite, user.value.uid, user.value.email);
    sharedBudgetsStore.removeInvite(inviteId);
    const sharedBudgets = await getSharedBudgetsForUser(user.value.uid);
    sharedBudgetsStore.setSharedBudgets(sharedBudgets);
  } catch (error) {
    console.error("Erro ao aceitar convite:", error);
    alert("Erro ao aceitar convite. Tente novamente.");
  } finally {
    processingInviteId.value = null;
  }
}

async function handleDecline(sharedBudgetId: string, inviteId: string) {
  try {
    processingInviteId.value = inviteId;
    await declineSharedBudgetInvite(sharedBudgetId, inviteId);
    sharedBudgetsStore.removeInvite(inviteId);
  } catch (error) {
    console.error("Erro ao recusar convite:", error);
    alert("Erro ao recusar convite. Tente novamente.");
  } finally {
    processingInviteId.value = null;
  }
}
</script>

<template>
  <div
    v-if="isLoading || sharedBudgetsStore.pendingInvites.length > 0"
    class="bg-card rounded-lg p-6 shadow-sm mb-6"
  >
    <h2 class="text-xl font-semibold mb-4">Convites Pendentes</h2>

    <div
      v-if="isLoading"
      class="flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
      <span>Carregando convites...</span>
    </div>

    <div v-else class="space-y-3" role="list" aria-label="Convites pendentes">
      <div
        v-for="invite in sharedBudgetsStore.pendingInvites"
        :key="invite.id"
        role="listitem"
        class="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
        :aria-label="`Convite para o orçamento compartilhado ${invite.sharedBudgetName}, enviado por ${invite.invitedByEmail}`"
      >
        <div>
          <p class="font-medium">{{ invite.sharedBudgetName }}</p>
          <p class="text-sm text-muted-foreground">
            Convidado por {{ invite.invitedByEmail }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            size="sm"
            :disabled="processingInviteId === invite.id"
            @click="handleAccept(invite.id)"
          >
            Aceitar
          </Button>
          <Button
            size="sm"
            variant="outline"
            :disabled="processingInviteId === invite.id"
            @click="handleDecline(invite.sharedBudgetId, invite.id)"
          >
            Recusar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
