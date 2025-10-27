<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog/index.js";
import { Button } from "./ui/button/index.js";
import { MoneyInput } from "./ui/money-input/index.js";
import { ScrollArea } from "./ui/scroll-area/index.js";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form/index.js";
import { Input } from "./ui/input/index.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select/index.js";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "../../constants/transactions.js";
import { DatePicker } from "./ui/date-picker/index.js";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { watchEffect, ref, onMounted, nextTick, computed, watch } from "vue";
import { useTransactionsStore } from "../../stores/transactions.js";
import { addTransaction, updateTransaction } from "../../service/transactionService.js";
import { useCurrentUser } from "vuefire";

console.log("[UpsertTransactionDialog] Componente carregado");

const { $pinia } = useNuxtApp();
let transactionsStore = useTransactionsStore($pinia);
const user = useCurrentUser();

// Estados para controlar abertura dos Selects e DatePicker
const typeSelectOpen = ref(false);
const categorySelectOpen = ref(false);
const paymentMethodSelectOpen = ref(false);
const datePickerOpen = ref(false);

console.log("[UpsertTransactionDialog] Estados inicializados:", {
  typeSelectOpen: typeSelectOpen.value,
  categorySelectOpen: categorySelectOpen.value,
  paymentMethodSelectOpen: paymentMethodSelectOpen.value,
  datePickerOpen: datePickerOpen.value,
});

// Watches para monitorar abertura dos componentes
watch(typeSelectOpen, (newValue) => {
  console.log("[UpsertTransactionDialog] typeSelectOpen mudou para:", newValue);
});

watch(categorySelectOpen, (newValue) => {
  console.log("[UpsertTransactionDialog] categorySelectOpen mudou para:", newValue);
});

watch(paymentMethodSelectOpen, (newValue) => {
  console.log("[UpsertTransactionDialog] paymentMethodSelectOpen mudou para:", newValue);
});

watch(datePickerOpen, (newValue) => {
  console.log("[UpsertTransactionDialog] datePickerOpen mudou para:", newValue);
});

const props = defineProps<{
  isOpen: boolean;
  defaultValues?: FormSchema;
  transactionId?: string;
}>();

const emits = defineEmits(["update:isOpen", "submit"]);

const validationSchema = z.object({
  name: z.string({
    required_error: "O nome é obrigatório.",
  }),
  amount: z
    .number({
      required_error: "O valor é obrigatório.",
    })
    .positive({
      message: "O valor deve ser positivo.",
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: "O tipo é obrigatório.",
  }),
  category: z.nativeEnum(TransactionCategory, {
    required_error: "A categoria é obrigatória.",
  }),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: "O método de pagamento é obrigatório.",
  }),
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
});

type FormSchema = z.infer<typeof validationSchema>;

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(validationSchema),
  initialValues: {
    amount: 0,
    date: new Date(),
  },
});

const isSubmitting = ref(false);

if (process.client) {
  onMounted(async () => {
    console.log("[UpsertTransactionDialog] onMounted executado");
    await nextTick();
    transactionsStore = useTransactionsStore();
    console.log("[UpsertTransactionDialog] transactionsStore:", transactionsStore);

    // Log das constantes para verificar se estão carregadas
    console.log(
      "[UpsertTransactionDialog] TRANSACTION_TYPE_OPTIONS:",
      TRANSACTION_TYPE_OPTIONS
    );
    console.log(
      "[UpsertTransactionDialog] TRANSACTION_CATEGORY_OPTIONS:",
      TRANSACTION_CATEGORY_OPTIONS
    );
    console.log(
      "[UpsertTransactionDialog] TRANSACTION_PAYMENT_METHOD_OPTIONS:",
      TRANSACTION_PAYMENT_METHOD_OPTIONS
    );
  });
}

watchEffect(() => {
  if (!transactionsStore) return;

  if (props.transactionId) {
    const transaction = transactionsStore.transactions.find(
      (t) => t.id === props.transactionId
    );
    if (transaction) {
      setValues(transaction);
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

    if (props.transactionId) {
      // Update existing transaction
      await updateTransaction(userId, props.transactionId, values);
    } else {
      // Add new transaction
      await addTransaction(userId, values);
    }

    emits("submit", { ...values, id: props.transactionId });
    emits("update:isOpen", false);
    resetForm();
  } catch (error) {
    console.error("Erro ao salvar transação:", error);
    // You can add user notification here
    alert("Erro ao salvar transação. Tente novamente.");
  } finally {
    isSubmitting.value = false;
  }
});

const isUpdate = computed(() => !!props.transactionId);
</script>

<template>
  <Dialog :open="props.isOpen" @update:open="(value) => emits('update:isOpen', value)">
    <slot />
    <DialogContent class="w-[90%] pt-12 sm:pt-6 sm:w-full min-w-fit sm:min-w-auto">
      <DialogHeader>
        <DialogTitle> {{ isUpdate ? "Editar" : "Adicionar" }} Transação </DialogTitle>
        <DialogDescription>Insira as informações abaixo</DialogDescription>
      </DialogHeader>

      <ScrollArea class="h-[450px] m-0 sm:h-full rounded-md pr-4">
        <form class="space-y-8" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel class="mb-4">Nome</FormLabel>
              <FormControl>
                <Input
                  class="w-60 sm:w-full"
                  placeholder="Digite o nome"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="amount">
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <MoneyInput
                  class="w-60 sm:w-full"
                  :model-value="componentField.modelValue || 0"
                  placeholder="Digite o valor"
                  @update:model-value="componentField['onUpdate:modelValue']"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="type">
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select v-bind="componentField" v-model:open="typeSelectOpen">
                <FormControl>
                  <SelectTrigger
                    class="w-60 sm:w-auto"
                    @click="
                      console.log('[UpsertTransactionDialog] SelectTrigger Tipo clicado')
                    "
                  >
                    <SelectValue placeholder="Selecione um tipo..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="option in TRANSACTION_TYPE_OPTIONS"
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

          <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select v-bind="componentField" v-model:open="categorySelectOpen">
                <FormControl>
                  <SelectTrigger
                    class="w-60 sm:w-auto"
                    @click="
                      console.log(
                        '[UpsertTransactionDialog] SelectTrigger Categoria clicado'
                      )
                    "
                  >
                    <SelectValue placeholder="Selecione uma categoria..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="option in TRANSACTION_CATEGORY_OPTIONS"
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

          <FormField v-slot="{ componentField }" name="paymentMethod">
            <FormItem>
              <FormLabel>Método de Pagamento</FormLabel>
              <Select v-bind="componentField" v-model:open="paymentMethodSelectOpen">
                <FormControl>
                  <SelectTrigger
                    class="w-60 sm:w-auto"
                    @click="
                      console.log(
                        '[UpsertTransactionDialog] SelectTrigger Método de Pagamento clicado'
                      )
                    "
                  >
                    <SelectValue placeholder="Selecione um método..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="option in TRANSACTION_PAYMENT_METHOD_OPTIONS"
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

          <FormField v-slot="{ componentField }" name="date">
            <FormItem class="flex flex-col">
              <FormLabel>Data</FormLabel>
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
              {{ isSubmitting ? "Salvando..." : isUpdate ? "Atualizar" : "Adicionar" }}
            </Button>
          </DialogFooter>
        </form>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
