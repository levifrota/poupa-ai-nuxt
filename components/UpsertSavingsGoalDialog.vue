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
import { MoneyInput } from "~/components/ui/money-input/index.js";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form/index.js";
import { Input } from "~/components/ui/input/index.js";
import { DatePicker } from "~/components/ui/date-picker/index.js";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { computed, watchEffect, ref } from "vue";
import { useSavingsGoalsStore } from "~/stores/savingsGoals.js";
import { addSavingsGoal, updateSavingsGoal } from "~/service/savingsGoalService.js";
import { useCurrentUser } from "vuefire";

const savingsGoalsStore = useSavingsGoalsStore();
const user = useCurrentUser();

const validationSchema = z.object({
  name: z.string({
    required_error: "O nome é obrigatório.",
  }),
  targetAmount: z
    .number({
      required_error: "O valor da meta é obrigatório.",
    })
    .positive({
      message: "O valor da meta deve ser positivo.",
    }),
  currentAmount: z.number().min(0, {
    message: "O valor guardado não pode ser negativo.",
  }),
  deadline: z.date({
    required_error: "O prazo é obrigatório.",
  }),
});

type FormSchema = z.infer<typeof validationSchema>;

const props = defineProps<{
  isOpen: boolean;
  defaultValues?: FormSchema;
  goalId?: string;
}>();

const emits = defineEmits(["update:isOpen", "submit"]);

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(validationSchema),
  initialValues: {
    currentAmount: 0,
    deadline: new Date(),
  },
});

const isSubmitting = ref(false);

watchEffect(() => {
  if (props.goalId) {
    const goal = savingsGoalsStore.goals.find((g) => g.id === props.goalId);
    if (goal) {
      setValues({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
      });
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

    if (props.goalId) {
      await updateSavingsGoal(userId, props.goalId, values);
      const existing = savingsGoalsStore.goals.find((g) => g.id === props.goalId);
      if (existing) {
        savingsGoalsStore.updateGoal({ ...existing, ...values });
      }
    } else {
      const id = await addSavingsGoal(userId, values);
      savingsGoalsStore.addGoal({
        id,
        name: values.name,
        targetAmount: values.targetAmount,
        currentAmount: values.currentAmount,
        deadline: values.deadline,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    emits("submit", { ...values, id: props.goalId });
    emits("update:isOpen", false);
    resetForm();
  } catch (error) {
    console.error("Erro ao salvar meta de economia:", error);
    alert("Erro ao salvar meta de economia. Tente novamente.");
  } finally {
    isSubmitting.value = false;
  }
});

const isUpdate = computed(() => !!props.goalId);
</script>

<template>
  <Dialog :open="props.isOpen" @update:open="(value) => emits('update:isOpen', value)">
    <slot />
    <DialogContent class="w-[90%] pt-12 sm:pt-6 sm:w-full min-w-fit sm:min-w-auto">
      <DialogHeader>
        <DialogTitle> {{ isUpdate ? "Editar" : "Nova" }} Meta de Economia </DialogTitle>
        <DialogDescription>Insira as informações abaixo</DialogDescription>
      </DialogHeader>

      <form class="space-y-8" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel class="mb-4">Nome</FormLabel>
            <FormControl>
              <Input
                class="w-60 sm:w-full"
                placeholder="Ex: Viagem, Reserva de emergência"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="targetAmount">
          <FormItem>
            <FormLabel>Valor da meta</FormLabel>
            <FormControl>
              <MoneyInput
                class="w-60 sm:w-full"
                :model-value="componentField.modelValue || 0"
                @update:model-value="componentField['onUpdate:modelValue']"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="currentAmount">
          <FormItem>
            <FormLabel>Valor já guardado</FormLabel>
            <FormControl>
              <MoneyInput
                class="w-60 sm:w-full"
                :model-value="componentField.modelValue || 0"
                @update:model-value="componentField['onUpdate:modelValue']"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="deadline">
          <FormItem class="flex flex-col">
            <FormLabel>Prazo</FormLabel>
            <FormControl>
              <DatePicker
                :model-value="componentField.modelValue || new Date()"
                @update:model-value="
                  (value) => componentField['onUpdate:modelValue'](value || new Date())
                "
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
          <Button
            class="mb-3 w-60 sm:w-auto sm:mb-0"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Salvando..." : isUpdate ? "Atualizar" : "Criar" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
