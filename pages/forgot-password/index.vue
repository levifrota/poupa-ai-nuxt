<template>
  <div class="grid h-screen w-full lg:grid-cols-2">
    <div class="flex flex-col items-center justify-center">
      <div class="w-full max-w-md space-y-4">
        <header class="flex flex-col items-center justify-center space-y-2">
          <img src="/logo.svg" alt="Poupa grana" class="w-48" >
          <h1 class="text-2xl font-bold">Recuperar senha</h1>
          <p class="text-center text-sm text-muted-foreground">
            Informe seu email e enviaremos um link para redefinir sua senha.
          </p>
        </header>

        <!-- Error Alert -->
        <div v-if="error" class="rounded-md bg-red-50 border border-red-200 p-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Success Alert -->
        <div v-if="sent" class="rounded-md bg-green-50 border border-green-200 p-3">
          <p class="text-sm text-green-700">
            Se existir uma conta com esse email, enviamos um link para redefinir sua
            senha. Verifique sua caixa de entrada.
          </p>
        </div>

        <form v-if="!sent" class="space-y-4" @submit.prevent="submit">
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium"> Email </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="email@exemplo.com"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              :disabled="loading"
              required
            >
          </div>

          <button
            type="submit"
            class="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? "Enviando..." : "Enviar link de recuperação" }}
          </button>
        </form>

        <p class="text-center text-sm">
          Lembrou sua senha?
          <NuxtLink to="/login" class="font-semibold text-primary">
            Acesse sua conta
          </NuxtLink>
        </p>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="/login.png"
        alt="Imagem de um celular com um gráfico de finanças"
        class="h-screen w-full object-cover"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useCurrentUser } from "vuefire";

const user = useCurrentUser();
const router = useRouter();

// Redirect if already logged in
watch(
  user,
  (newUser) => {
    if (newUser) {
      router.push("/");
    }
  },
  { immediate: true }
);

definePageMeta({
  layout: "auth",
});

const { handleForgotPassword, loading, error, clearError } = useAuth();

const email = ref("");
const sent = ref(false);

const submit = async () => {
  clearError();
  const success = await handleForgotPassword(email.value);
  if (success) {
    sent.value = true;
  }
};

// Clear error when user starts typing
watch(email, () => {
  if (error.value) {
    clearError();
  }
});
</script>
