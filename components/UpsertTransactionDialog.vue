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
import { ScrollArea } from "~/components/ui/scroll-area/index.js";
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
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  RECURRENCE_FREQUENCY_OPTIONS,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
  RecurrenceFrequency,
} from "~/constants/transactions.js";
import { DatePicker } from "~/components/ui/date-picker/index.js";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { watchEffect, ref, onMounted } from "vue";
import { useTransactionsStore } from "~/stores/transactions.js";
import { useAccountsStore } from "~/stores/accounts.js";
import { getAccounts } from "~/service/accountService.js";
import { addTransaction, updateTransaction } from "~/service/transactionService.js";
import { calculateNextOccurrenceDate } from "~/lib/recurrence.js";
import { removeUndefined } from "~/lib/utils.js";
import { useCurrentUser } from "vuefire";

const transactionsStore = useTransactionsStore();
const accountsStore = useAccountsStore();
const user = useCurrentUser();

async function fetchAccounts() {
  if (!user.value?.uid) return;
  try {
    const accounts = await getAccounts(user.value.uid);
    accountsStore.setAccounts(accounts);
  } catch (error) {
    console.error("Erro ao carregar contas:", error);
  }
}

onMounted(fetchAccounts);

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
  tags: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurrenceFrequency: z.nativeEnum(RecurrenceFrequency).optional(),
  isBill: z.boolean().optional(),
  dueDate: z.date().optional(),
  isPaid: z.boolean().optional(),
  accountId: z.string().optional(),
});

type FormSchema = z.infer<typeof validationSchema>;

const { handleSubmit, resetForm, setValues, values } = useForm({
  validationSchema: toTypedSchema(validationSchema),
  initialValues: {
    amount: 0,
    date: new Date(),
    isRecurring: false,
    isBill: false,
  },
});

const isSubmitting = ref(false);

watchEffect(() => {
  if (props.transactionId) {
    const transaction = transactionsStore.transactions.find(
      (t) => t.id === props.transactionId
    );
    if (transaction) {
      setValues({ ...transaction, tags: (transaction.tags ?? []).join(", ") });
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

    const tags = (values.tags ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const dataToSave = removeUndefined({
      ...values,
      tags,
      ...(values.isRecurring &&
        values.recurrenceFrequency && {
          nextOccurrenceDate: calculateNextOccurrenceDate(
            values.date,
            values.recurrenceFrequency
          ),
        }),
      ...(values.isBill && values.dueDate && { isPaid: Boolean(values.isPaid) }),
    });

    if (props.transactionId) {
      // Update existing transaction
      await updateTransaction(userId, props.transactionId, dataToSave);
    } else {
      // Add new transaction
      await addTransaction(userId, dataToSave);
    }

    emits("submit", { ...dataToSave, id: props.transactionId });
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

const onIsRecurringChange = (event: Event, onUpdateModelValue: (value: boolean) => void) => {
  onUpdateModelValue((event.target as HTMLInputElement).checked);
};

const onIsBillChange = (event: Event, onUpdateModelValue: (value: boolean) => void) => {
  onUpdateModelValue((event.target as HTMLInputElement).checked);
};

const onIsPaidChange = (event: Event, onUpdateModelValue: (value: boolean) => void) => {
  onUpdateModelValue((event.target as HTMLInputElement).checked);
};
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
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-60 sm:w-auto">
                    <SelectValue placeholder="Tipo da transação" />
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
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-60 sm:w-auto">
                    <SelectValue placeholder="Categoria da transação" />
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
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-60 sm:w-auto">
                    <SelectValue placeholder="Método de Pagamento" />
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

          <FormField
            v-if="accountsStore.accounts.length > 0"
            v-slot="{ componentField }"
            name="accountId"
          >
            <FormItem>
              <FormLabel>Conta</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-60 sm:w-auto">
                    <SelectValue placeholder="Conta (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="account in accountsStore.accounts"
                    :key="account.id"
                    :value="account.id"
                  >
                    {{ account.name }}
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

          <FormField v-slot="{ componentField }" name="tags">
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  class="w-60 sm:w-full"
                  placeholder="Ex: viagem, mercado, reembolsável"
                  aria-describedby="tags-hint"
                  v-bind="componentField"
                />
              </FormControl>
              <p id="tags-hint" class="text-sm text-muted-foreground">
                Separe as tags por vírgula.
              </p>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField, value }" name="isRecurring">
            <FormItem class="flex items-center gap-2">
              <FormControl>
                <input
                  id="isRecurring"
                  type="checkbox"
                  class="h-4 w-4 rounded border-input"
                  :checked="Boolean(value)"
                  @change="
                    (event) =>
                      onIsRecurringChange(event, componentField['onUpdate:modelValue'])
                  "
                >
              </FormControl>
              <FormLabel for="isRecurring" class="mb-0">Transação recorrente</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-if="values.isRecurring"
            v-slot="{ componentField }"
            name="recurrenceFrequency"
          >
            <FormItem>
              <FormLabel>Frequência</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-60 sm:w-auto">
                    <SelectValue placeholder="Frequência da recorrência" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="option in RECURRENCE_FREQUENCY_OPTIONS"
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

          <FormField v-slot="{ componentField, value }" name="isBill">
            <FormItem class="flex items-center gap-2">
              <FormControl>
                <input
                  id="isBill"
                  type="checkbox"
                  class="h-4 w-4 rounded border-input"
                  :checked="Boolean(value)"
                  @change="
                    (event) => onIsBillChange(event, componentField['onUpdate:modelValue'])
                  "
                >
              </FormControl>
              <FormLabel for="isBill" class="mb-0">Conta a pagar</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-if="values.isBill" v-slot="{ componentField }" name="dueDate">
            <FormItem class="flex flex-col">
              <FormLabel>Data de vencimento</FormLabel>
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

          <FormField v-if="values.isBill" v-slot="{ componentField, value }" name="isPaid">
            <FormItem class="flex items-center gap-2">
              <FormControl>
                <input
                  id="isPaid"
                  type="checkbox"
                  class="h-4 w-4 rounded border-input"
                  :checked="Boolean(value)"
                  @change="
                    (event) => onIsPaidChange(event, componentField['onUpdate:modelValue'])
                  "
                >
              </FormControl>
              <FormLabel for="isPaid" class="mb-0">Já paga</FormLabel>
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
