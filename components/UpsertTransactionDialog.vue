<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { MoneyInput } from '~/components/ui/money-input'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '~/constants/transactions'
import { DatePicker } from '~/components/ui/date-picker'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { watchEffect } from 'vue'
import { useTransactionsStore } from '~/stores/transactions'

const transactionsStore = useTransactionsStore()

const props = defineProps<{
  isOpen: boolean
  defaultValues?: FormSchema
  transactionId?: string
}>()

const emits = defineEmits(['update:isOpen', 'submit'])

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, {
      message: 'O nome é obrigatório.',
    }),
    amount: z
      .number({
        required_error: 'O valor é obrigatório.',
      })
      .positive({
        message: 'O valor deve ser positivo.',
      }),
    type: z.nativeEnum(TransactionType, {
      required_error: 'O tipo é obrigatório.',
    }),
    category: z.nativeEnum(TransactionCategory, {
      required_error: 'A categoria é obrigatória.',
    }),
    paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
      required_error: 'O método de pagamento é obrigatório.',
    }),
    date: z.date({
      required_error: 'A data é obrigatória.',
    }),
  }),
)

type FormSchema = z.infer<typeof formSchema>

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
})

watchEffect(() => {
  if (props.transactionId) {
    const transaction = transactionsStore.transactions.find(
      (t) => t.id === props.transactionId,
    )
    if (transaction) {
      setValues(transaction)
    }
  } else if (props.defaultValues) {
    setValues(props.defaultValues)
  }
})

const onSubmit = handleSubmit((values) => {
  emits('submit', { ...values, id: props.transactionId })
  emits('update:isOpen', false)
  resetForm()
})

const isUpdate = computed(() => !!props.transactionId)
</script>

<template>
  <Dialog :open="props.isOpen" @update:open="(value) => emits('update:isOpen', value)">
    <slot />
    <DialogContent class="h-5/6 w-[80%] pr-0 sm:w-full">
      <ScrollArea class="m-0 h-full rounded-md pr-4">
        <DialogHeader>
          <DialogTitle>
            {{ isUpdate ? 'Editar' : 'Adicionar' }} Transação
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <form @submit="onSubmit" class="space-y-8">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="amount">
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <MoneyInput placeholder="Digite o valor" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="type">
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo da transação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="option in TRANSACTION_TYPE_OPTIONS" :key="option.value" :value="option.value">
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
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria da transação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="option in TRANSACTION_CATEGORY_OPTIONS" :key="option.value" :value="option.value">
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
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um método de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="option in TRANSACTION_PAYMENT_METHOD_OPTIONS" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="date">
            <FormItem>
              <FormLabel>Data</FormLabel>
              <DatePicker v-bind="componentField" />
              <FormMessage />
            </FormItem>
          </FormField>

          <DialogFooter>
            <DialogClose as-child>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button class="mb-3 sm:mb-0" type="submit">
              {{ isUpdate ? 'Atualizar' : 'Adicionar' }}
            </Button>
          </DialogFooter>
        </form>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
