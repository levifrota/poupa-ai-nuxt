<script setup lang="ts">
import { logOut } from "~/service/authService.js";
import { useRouter } from "vue-router";

const themeStore = useThemeStore();
const route = useRoute();
const router = useRouter();

const isDialogOpen = ref(false);

const linkClasses = (href: string) => {
  return route.path === href ? "font-bold text-primary" : "text-muted-foreground";
};

const handleLogout = async () => {
  try {
    await logOut();
    router.push("/login");
  } catch (error) {
    console.error("Erro ao sair:", error);
    alert("Erro ao sair");
  }
};
</script>

<template>
  <nav class="flex justify-between border-b border-solid px-8 py-4">
    <div class="flex w-[100%] flex-row justify-center gap-10 md:w-auto md:items-center">
      <NuxtImg
        v-if="themeStore.theme === 'dark' || themeStore.theme === 'high-contrast'"
        class="self-center md:self-auto"
        src="./logo.svg"
        width="173"
        height="39"
        alt="Poupa Aí"
      />
      <NuxtImg
        v-else-if="themeStore.theme === 'deuteranopia'"
        src="./logo-deuteranopia.svg"
        width="173"
        height="39"
        alt="Poupa Aí"
      />
      <NuxtImg
        v-else
        class="self-center md:self-auto"
        src="./logo-light.svg"
        width="173"
        height="39"
        alt="Poupa Aí"
      />
      <div class="hidden gap-6 md:flex">
        <NuxtLink to="/" :class="linkClasses('/')" aria-label="Navegar para o Painel">
          Painel
        </NuxtLink>
        <NuxtLink
          to="/transactions"
          :class="linkClasses('/transactions')"
          aria-label="Navegar para Transações"
        >
          Transações
        </NuxtLink>
        <NuxtLink
          to="/settings"
          :class="linkClasses('/settings')"
          aria-label="Navegar para Configurações"
        >
          Configurações
        </NuxtLink>
      </div>
    </div>
    <div class="hidden md:block">
      <div class="text-primary">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger aria-label="Menu do usuário">
              <Icon name="lucide:user" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem @click="isDialogOpen = true">
                <Icon name="lucide:user" class="mr-2" />
                Gerenciar Perfil
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem @click="handleLogout">
                <Icon name="lucide:log-out" class="mr-2" />
                Sair
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  </nav>

  <UserButton v-model:is-open="isDialogOpen" />
</template>
