<template>
  <div class="grid h-screen w-full lg:grid-cols-2">
    <div class="flex flex-col items-center justify-center">
      <div class="w-full max-w-md space-y-4">
        <header class="flex flex-col items-center justify-center space-y-2">
          <img src="/logo.svg" alt="Poupa grana" class="w-48" >
          <h1 class="text-2xl font-bold">Crie sua conta</h1>
        </header>

        <!-- Error Alert -->
        <div v-if="error" class="rounded-md bg-red-50 border border-red-200 p-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <form class="space-y-4" @submit.prevent="register">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium"> Nome </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="José da Silva"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              :disabled="loading"
              required
            >
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium"> Email </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="josedasilva@exemplo.com"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              :disabled="loading"
              required
            >
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium"> Senha </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              :disabled="loading"
              required
              minlength="6"
            >
          </div>

          <button
            type="submit"
            class="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? "Criando conta..." : "Cadastrar" }}
          </button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
        </div>

        <button
          class="w-full rounded-md border border-input bg-background py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50"
          :disabled="loading"
          @click="handleGoogleAuth"
        >
          <Icon name="logos:google-icon" class="mr-2" />
          Google
        </button>

        <p class="text-center text-sm">
          Já tem uma conta?
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
import { reactive, watch } from "vue";
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

const { handleSignUp, handleGoogleAuth, loading, error, clearError } = useAuth();

const formData = reactive({
  name: "",
  email: "",
  password: "",
});

const register = async () => {
  clearError();
  await handleSignUp(formData);
};

// Clear error when user starts typing
watch(formData, () => {
  if (error.value) {
    clearError();
  }
});
</script>
