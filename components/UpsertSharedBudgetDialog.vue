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
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref } from "vue";
import { useCurrentUser } from "vuefire";
import { useSharedBudgetsStore } from "~/stores/sharedBudgets.js";
import { createSharedBudget } from "~/service/sharedBudgetService.js";

const user = useCurrentUser();
const sharedBudgetsStore = useSharedBudgetsStore();

const validationSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório." }).min(1, "O nome é obrigatório."),
});

const props = defineProps<{
  isOpen: boolean;
}>();

const emits = defineEmits(["update:isOpen", "submit"]);

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(validationSchema),
});

const isSubmitting = ref(false);

const onSubmit = handleSubmit(async (values) => {
  if (!user.value?.uid || !user.value.email) {
    console.error("Usuário não autenticado");
    return;
  }

  try {
    isSubmitting.value = true;

    const ownerId = user.value.uid;
    const ownerEmail = user.value.email;

    const id = await createSharedBudget(ownerId, ownerEmail, values.name);
    sharedBudgetsStore.addSharedBudget({
      id,
      name: values.name,
      ownerId,
      ownerEmail,
      memberUids: [ownerId],
      memberEmails: [ownerEmail.toLowerCase()],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    emits("submit", { id, name: values.name });
    emits("update:isOpen", false);
    resetForm();
  } catch (error) {
    console.error("Erro ao criar orçamento compartilhado:", error);
    alert("Erro ao criar orçamento compartilhado. Tente novamente.");
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <Dialog :open="props.isOpen" @update:open="(value) => emits('update:isOpen', value)">
    <slot />
    <DialogContent class="w-[90%] pt-12 sm:pt-6 sm:w-full min-w-fit sm:min-w-auto">
      <DialogHeader>
        <DialogTitle>Novo Orçamento Compartilhado</DialogTitle>
        <DialogDescription>
          Crie um orçamento compartilhado para convidar outras pessoas a acompanhar
          limites de gastos em conjunto.
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-8" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel class="mb-4">Nome</FormLabel>
            <FormControl>
              <Input
                class="w-60 sm:w-full"
                placeholder="Ex: Orçamento da Família"
                v-bind="componentField"
              />
            </FormControl>
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
          <Button class="mb-3 w-60 sm:w-auto sm:mb-0" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Criando..." : "Criar" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
