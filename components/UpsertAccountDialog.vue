<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog/index.js";
import { Button } from "~/components/ui/button/index.js";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form/index.js";
import { Input } from "~/components/ui/input/index.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select/index.js";
import { ACCOUNT_TYPE_OPTIONS, AccountType } from "~/constants/accounts.js";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { computed, watchEffect, ref } from "vue";
import { useAccountsStore } from "~/stores/accounts.js";
import { addAccount, updateAccount } from "~/service/accountService.js";
import { useCurrentUser } from "vuefire";

const accountsStore = useAccountsStore();
const user = useCurrentUser();

const validationSchema = z.object({
  name: z.string({
    required_error: "O nome é obrigatório.",
  }),
  type: z.nativeEnum(AccountType, {
    required_error: "O tipo é obrigatório.",
  }),
});

type FormSchema = z.infer<typeof validationSchema>;

const props = defineProps<{
  isOpen: boolean;
  defaultValues?: FormSchema;
  accountId?: string;
}>();

const emits = defineEmits(["update:isOpen", "submit"]);

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(validationSchema),
  initialValues: {
    type: AccountType.CHECKING,
  },
});

const isSubmitting = ref(false);

watchEffect(() => {
  if (props.accountId) {
    const account = accountsStore.accounts.find((a) => a.id === props.accountId);
    if (account) {
      setValues({ name: account.name, type: account.type });
    }
  } else if (props.defaultValues) {
    setValues(props.defaultValues);
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    isSubmitting.value = true;

    if (!user.value?.uid) {
      console.error("Usuário não autenticado");
      return;
    }

    const userId = user.value.uid;

    if (props.accountId) {
      await updateAccount(userId, props.accountId, values);
      const existing = accountsStore.accounts.find((a) => a.id === props.accountId);
      if (existing) {
        accountsStore.updateAccount({ ...existing, ...values });
      }
    } else {
      const id = await addAccount(userId, values);
      accountsStore.addAccount({
        id,
        name: values.name,
        type: values.type,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    emits("submit", { ...values, id: props.accountId });
    emits("update:isOpen", false);
    resetForm();
  } catch (error) {
    console.error("Erro ao salvar conta:", error);
    alert("Erro ao salvar conta. Tente novamente.");
  } finally {
    isSubmitting.value = false;
  }
});

const isUpdate = computed(() => !!props.accountId);
</script>

<template>
  <Dialog :open="props.isOpen" @update:open="(value) => emits('update:isOpen', value)">
    <slot />
    <DialogContent class="w-[90%] pt-12 sm:pt-6 sm:w-full min-w-fit sm:min-w-auto">
      <DialogHeader>
        <DialogTitle> {{ isUpdate ? "Editar" : "Nova" }} Conta </DialogTitle>
        <DialogDescription>Insira as informações abaixo</DialogDescription>
      </DialogHeader>

      <form class="space-y-8" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel class="mb-4">Nome</FormLabel>
            <FormControl>
              <Input
                class="w-60 sm:w-full"
                placeholder="Ex: Conta corrente, Nubank"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="type">
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-60 sm:w-auto">
                  <SelectValue placeholder="Tipo da conta" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in ACCOUNT_TYPE_OPTIONS"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <DialogClose as-child>
            <Button
              class="w-60 sm:w-auto"
              type="button"
              variant="outline"
              :disabled="isSubmitting"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            class="mb-3 w-60 sm:w-auto sm:mb-0"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Salvando..." : isUpdate ? "Atualizar" : "Adicionar" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
