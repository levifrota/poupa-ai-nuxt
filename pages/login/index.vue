<template>
  <div class="grid h-screen w-full lg:grid-cols-2">
    <div class="flex flex-col items-center justify-center">
      <div class="w-full max-w-md space-y-4">
        <header class="flex flex-col items-center justify-center space-y-2">
          <img src="/logo.svg" alt="Poupa grana" class="w-48" >
          <h1 class="text-2xl font-bold">Acesse sua conta</h1>
        </header>

        <form class="space-y-4" @submit.prevent="login">
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium"> Email </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="johndoe@example.com"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium"> Senha </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
          </div>

          <button
            type="submit"
            class="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground"
          >
            Entrar
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
          class="w-full rounded-md border border-input bg-background py-2 text-sm font-semibold hover:bg-accent"
          @click="googleAuth"
        >
          <Icon name="logos:google-icon" class="mr-2" />
          Google
        </button>

        <p class="text-center text-sm">
          Não tem uma conta?
          <NuxtLink to="/register" class="font-semibold text-primary">
            Cadastre-se
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signIn, signInWithGoogle } from "~/service/authService";

definePageMeta({
  layout: "auth",
});

const email = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  try {
    if (!email.value || !password.value) {
      alert("Por favor, preencha o email e a senha corretamente.");
      return;
    }

    const user = await signIn(email.value, password.value);

    alert(`Bem-vindo(a), ${user.displayName || "usuário"}!`);
    router.push("/");
  } catch (error) {
    console.error("Erro no login:", error);
    if (error.code === "auth/wrong-password") {
      alert("Senha incorreta.");
    } else if (error.code === "auth/user-not-found") {
      alert("Usuário não encontrado.");
    } else {
      alert("Erro ao fazer login: " + error.message);
    }
  }
};

const googleAuth = async () => {
  try {
    const user = await signInWithGoogle();
    alert(`Bem-vindo, ${user.displayName}!`);
    router.push("/");
  } catch (error) {
    console.error("Erro no login com Google:", error);
    alert("Erro ao fazer login com Google");
  }
};
</script>
