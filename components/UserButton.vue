<template>
  <!-- Dialog -->
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="max-h-[90%] max-w-[90%] sm:max-h-none sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Perfil do Usuário</DialogTitle>
        <DialogDescription>
          Gerencie suas informações pessoais e configurações de conta.
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[70vh] pr-4">
        <form class="space-y-6" @submit="onSubmit">
          <!-- Foto do Perfil -->
          <div class="flex flex-col items-center space-y-4">
            <div class="relative">
              <div
                class="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="profileImageUrl"
                  :src="profileImageUrl"
                  :alt="`Foto de ${values.displayName || 'usuário'}`"
                  class="h-full w-full object-cover z-10"
                >
                <Icon v-else name="lucide:user" class="h-12 w-12 text-muted-foreground" />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                class="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                @click="triggerFileInput"
              >
                <Icon name="lucide:camera" class="h-4 w-4" />
              </Button>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              >
            </div>
            <p class="text-xs text-muted-foreground text-center">
              Clique no ícone da câmera para alterar sua foto de perfil
            </p>
          </div>

          <!-- Nome de Exibição -->
          <FormField v-slot="{ componentField }" name="displayName">
            <FormItem>
              <FormLabel>Nome de Exibição</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Email (somente leitura) -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Email</label>
            <Input :model-value="user?.email || ''" disabled class="bg-muted" />
            <p class="text-xs text-muted-foreground">O email não pode ser alterado</p>
          </div>

          <!-- Informações da Conta -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium">Informações da Conta</h3>

            <div class="rounded-lg border p-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm">Conta criada em:</span>
                <span class="text-sm text-muted-foreground">
                  {{ formatDate(user?.metadata?.creationTime) }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-sm">Último acesso:</span>
                <span class="text-sm text-muted-foreground">
                  {{ formatDate(user?.metadata?.lastSignInTime) }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-sm">Provedor de autenticação:</span>
                <div class="flex items-center space-x-1">
                  <Icon
                    :name="getProviderIcon(user?.providerData?.[0]?.providerId)"
                    class="h-4 w-4"
                  />
                  <span class="text-sm text-muted-foreground">
                    {{ getProviderName(user?.providerData?.[0]?.providerId) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações de Segurança -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium">Configurações de Segurança</h3>

            <div class="space-y-3">
              <Button
                type="button"
                variant="outline"
                class="w-full justify-start"
                :disabled="isGoogleUser"
                @click="changePassword"
              >
                <Icon name="lucide:key" class="mr-2 h-4 w-4" />
                Alterar Senha
              </Button>

              <Button
                type="button"
                variant="outline"
                class="w-full justify-start text-destructive hover:text-destructive"
                @click="confirmDeleteAccount"
              >
                <Icon name="lucide:trash-2" class="mr-2 h-4 w-4" />
                Excluir Conta
              </Button>
            </div>

            <p v-if="isGoogleUser" class="text-xs text-muted-foreground">
              * Algumas opções não estão disponíveis para contas Google
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" :disabled="isSaving" @click="isDialogOpen = false">
            Cancelar
          </Button>
          <Button type="submit" :disabled="isSaving || !hasChanges" @click="onSubmit">
            <Icon
              v-if="isSaving"
              name="lucide:loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isSaving ? "Salvando..." : "Salvar Alterações" }}
          </Button>
        </DialogFooter>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useCurrentUser } from "vuefire";
import {
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { db } from "~/lib/firebase.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog/index.js";
import { Button } from "~/components/ui/button/index.js";
import { Input } from "~/components/ui/input/index.js";
import { ScrollArea } from "~/components/ui/scroll-area/index.js";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form/index.js";
import { Icon } from "#components";

const user = useCurrentUser();
const router = useRouter();

const props = defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
}>();

const isDialogOpen = computed({
  get: () => props.isOpen ?? false,
  set: (value) => emit("update:isOpen", value),
});

const isSaving = ref(false);
const profileImageUrl = ref<string>("");
const fileInput = ref<HTMLInputElement>();
const originalImageUrl = ref<string>("");

// Schema de validação
const formSchema = toTypedSchema(
  z.object({
    displayName: z
      .string({ required_error: "O nome é obrigatório." })
      .min(1, "Nome é obrigatório")
      .max(50, "Nome muito longo"),
  })
);

const { handleSubmit, setValues, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    displayName: "",
  },
});

const onSubmit = handleSubmit(async (formValues) => {
  await handleSave(formValues);
});

// Computadas
const isGoogleUser = computed(() => {
  return user.value?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );
});

const hasChanges = computed(() => {
  if (!user.value) return false;

  const nameChanged = values.displayName !== (user.value.displayName || "");
  const imageChanged = profileImageUrl.value !== originalImageUrl.value;

  return nameChanged || imageChanged;
});

// Carregar imagem do Firestore
const loadProfileImage = async (userId: string) => {
  try {
    const profileRef = doc(db(), "users", userId, "profile", "data");
    const profileDoc = await getDoc(profileRef);

    if (profileDoc.exists()) {
      const data = profileDoc.data();
      if (data?.photoURL) {
        profileImageUrl.value = data.photoURL;
        originalImageUrl.value = data.photoURL;
        return true;
      }
    }
  } catch (error) {
    console.error("Erro ao carregar imagem do perfil:", error);
    return false;
  }
};

// Watchers
watch(
  user,
  async (newUser) => {
    if (newUser) {
      setValues({
        displayName: newUser.displayName || "",
      });

      if (newUser.photoURL) {
        profileImageUrl.value = newUser.photoURL;
        originalImageUrl.value = newUser.photoURL;
      }

      const hasCustomImage = await loadProfileImage(newUser.uid);

      // Fallback para photoURL do Firebase Auth (caso de usuários Google)
      if (!hasCustomImage && !newUser.photoURL) {
        profileImageUrl.value = "";
        originalImageUrl.value = "";
      }
    }
  },
  { immediate: true }
);

// Métodos de formatação
const formatDate = (timestamp: string | undefined) => {
  if (!timestamp) return "Não disponível";

  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getProviderIcon = (providerId: string | undefined) => {
  switch (providerId) {
    case "google.com":
      return "logos:google-icon";
    case "password":
      return "lucide:mail";
    default:
      return "lucide:user";
  }
};

const getProviderName = (providerId: string | undefined) => {
  switch (providerId) {
    case "google.com":
      return "Google";
    case "password":
      return "Email/Senha";
    default:
      return "Desconhecido";
  }
};

// Métodos de imagem
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Converter imagem para base64 com compressão
const compressImage = (file: File, maxWidth = 400, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Redimensionar mantendo proporção
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Converter para base64 com compressão
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file || !user.value) return;

  // Validar tipo de arquivo
  if (!file.type.startsWith("image/")) {
    alert("Por favor, selecione apenas arquivos de imagem.");
    return;
  }

  // Validar tamanho (5MB máximo antes da compressão)
  if (file.size > 5 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 5MB.");
    return;
  }

  try {
    // Comprimir e converter para base64
    const base64Image = await compressImage(file);

    // Verificar tamanho após compressão (Firestore tem limite de 1MB por campo)
    if (base64Image.length > 1048487) {
      // ~1MB em base64
      alert("A imagem é muito grande. Por favor, escolha uma imagem menor.");
      return;
    }

    profileImageUrl.value = base64Image;
  } catch (error) {
    console.error("Erro ao carregar imagem:", error);
    alert("Erro ao carregar imagem. Tente novamente.");
  }
};

// Salvar imagem no Firestore
const saveProfileImage = async (userId: string, base64Image: string): Promise<void> => {
  try {
    const profileRef = doc(db(), "users", userId, "profile", "data");
    await setDoc(
      profileRef,
      {
        photoURL: base64Image,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Erro ao salvar imagem no Firestore:", error);
    throw new Error("Erro ao salvar imagem");
  }
};

// Métodos principais
const handleSave = async (formValues: { displayName: string }) => {
  if (!user.value || !hasChanges.value) return;

  try {
    isSaving.value = true;

    // Atualizar perfil do Firebase Auth
    await updateProfile(user.value, {
      displayName: formValues.displayName,
    });

    // Salvar imagem no Firestore se foi alterada
    if (
      profileImageUrl.value !== originalImageUrl.value &&
      profileImageUrl.value.startsWith("data:")
    ) {
      await saveProfileImage(user.value.uid, profileImageUrl.value);
      originalImageUrl.value = profileImageUrl.value;
    }

    // Fechar dialog
    isDialogOpen.value = false;

    // Notificar sucesso
    alert("Perfil atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar perfil:", error);
    alert("Erro ao salvar alterações. Tente novamente.");
  } finally {
    isSaving.value = false;
  }
};

const changePassword = async () => {
  if (!user.value || isGoogleUser.value) return;

  const newPassword = prompt("Digite sua nova senha (mínimo 6 caracteres):");
  if (!newPassword) return;

  if (newPassword.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  const currentPassword = prompt("Digite sua senha atual para confirmar:");
  if (!currentPassword) return;

  try {
    const credential = EmailAuthProvider.credential(user.value.email!, currentPassword);
    await reauthenticateWithCredential(user.value, credential);
    await updatePassword(user.value, newPassword);
    alert("Senha alterada com sucesso!");
  } catch (error: unknown) {
    console.error("Erro ao alterar senha:", error);

    if (error.code === "auth/wrong-password") {
      alert("Senha atual incorreta.");
    } else {
      alert("Erro ao alterar senha. Tente novamente.");
    }
  }
};

const confirmDeleteAccount = async () => {
  if (!user.value) return;

  const confirmation = confirm(
    "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente."
  );

  if (!confirmation) return;

  const finalConfirmation = prompt(
    'Digite "EXCLUIR" para confirmar a exclusão da conta:'
  );

  if (finalConfirmation !== "EXCLUIR") return;

  try {
    if (!isGoogleUser.value) {
      const password = prompt("Digite sua senha para confirmar:");
      if (!password) return;

      const credential = EmailAuthProvider.credential(user.value.email!, password);
      await reauthenticateWithCredential(user.value, credential);
    }

    // Deletar dados do perfil no Firestore
    try {
      const profileRef = doc(db(), "users", user.value.uid, "profile", "data");
      await setDoc(profileRef, {});
    } catch (error) {
      console.log("Erro ao deletar dados do perfil: ", error);
    }

    // Deletar usuário
    await deleteUser(user.value);

    // Redirecionar para página de login
    await router.push("/login");
  } catch (error: unknown) {
    console.error("Erro ao excluir conta:", error);

    if (error.code === "auth/wrong-password") {
      alert("Senha incorreta.");
    } else if (error.code === "auth/requires-recent-login") {
      alert("Por favor, faça login novamente antes de excluir sua conta.");
    } else {
      alert("Erro ao excluir conta. Tente novamente.");
    }
  }
};

// Reset do formulário quando o dialog fechar
watch(isDialogOpen, (isOpen) => {
  if (!isOpen && user.value) {
    setValues({
      displayName: user.value.displayName || "",
    });
    profileImageUrl.value = originalImageUrl.value;
  }
});
</script>
