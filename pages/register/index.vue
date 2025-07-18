<template>
  <div class="grid h-screen w-full lg:grid-cols-2">
    <div class="flex flex-col items-center justify-center">
      <div class="w-full max-w-md space-y-4">
        <header class="flex flex-col items-center justify-center space-y-2">
          <img src="/logo.svg" alt="Poupa grana" class="w-48" />
          <h1 class="text-2xl font-bold">Crie sua conta</h1>
        </header>

        <form class="space-y-4" @submit.prevent="register">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium"> Nome </label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="John Doe"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium"> Email </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="johndoe@example.com"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium"> Senha </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            class="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground"
          >
            Cadastrar
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
          @click="googleAuth"
          class="w-full rounded-md border border-input bg-background py-2 text-sm font-semibold hover:bg-accent"
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
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signUp, signInWithGoogle } from "~/service/authService";
import { updateProfile } from "firebase/auth";

definePageMeta({
  layout: "auth",
});

const name = ref("");
const email = ref("");
const password = ref("");

const router = useRouter();

const register = async () => {
  if (!email.value || !password.value || !name.value) {
    alert("Por favor, preencha os campos corretamente.");
    return;
  }
  try {
    const userCredential = await signUp(email.value, password.value);
    await updateProfile(userCredential.user, {
      displayName: name.value,
    });
    alert(`Bem-vindo(a), ${name.value}!`);
    router.push("/settings");
  } catch (error) {
    console.error("Erro ao registrar:", error);
    alert("Erro no cadastro: " + error.message);
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
