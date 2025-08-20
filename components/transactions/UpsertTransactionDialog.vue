<script setup lang="ts">
import { z } from 'zod'
import { computed, reactive, watch, ref } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import {
  TransactionType,
  TransactionCategory,
  TransactionPaymentMethod,
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
} from '~/constants/transactions'
import { useTransactionsStore } from '~/stores/transactions'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { ScrollArea } from '~/components/ui/scroll-area'
import MoneyInput from '~/components/MoneyInput.vue'
import type { Transaction } from '~/types'

const props = defineProps<{
  modelValue: boolean
  transaction?: Transaction | null
}>()

const emit = defineEmits(['update:modelValue', 'saved'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

watch(() => props.modelValue, (value) => {
  if (!value) {
    resetForm()
  }
})

const isUpdate = computed(() => !!props.transaction)

const formSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  date: z.string().refine(v => v, { message: 'A data é obrigatória.' }),
})

type FormSchema = z.infer<typeof formSchema>

const state = reactive<Partial<FormSchema>>({})
const form = ref()

function setForm(transaction: Transaction | null | undefined) {
  if (transaction) {
    state.name = transaction.name
    state.amount = transaction.amount
    state.type = transaction.type
    state.category = transaction.category
    state.paymentMethod = transaction.paymentMethod
    state.date = new Date(transaction.date).toISOString().split('T')[0]
  }
  else {
    resetForm()
  }
}

watch(() => props.transaction, (newTransaction) => {
  setForm(newTransaction)
}, { immediate: true })

function resetForm() {
  state.name = undefined
  state.amount = undefined
  state.type = TransactionType.EXPENSE
  state.category = TransactionCategory.OTHER
  state.paymentMethod = TransactionPaymentMethod.CASH
  state.date = new Date().toISOString().split('T')[0]
  form.value?.clear()
}

const transactionsStore = useTransactionsStore()

async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  try {
    const data = {
      ...event.data,
      date: new Date(event.data.date).toISOString(),
    }

    if (isUpdate.value && props.transaction) {
      await transactionsStore.updateTransaction({ ...props.transaction, ...data })
    }
    else {
      await transactionsStore.addTransaction({
        ...data,
        createdAt: new Date().toISOString(),
      })
    }
    isOpen.value = false
    emit('saved')
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent class="h-5/6 w-[80%] pr-0 sm:w-full">
      <ScrollArea class="m-0 h-full rounded-md pr-4">
        <DialogHeader>
          <DialogTitle>
            {{ isUpdate ? "Editar" : "Adicionar" }} Transação
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <UForm ref="form" :schema="formSchema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Nome" name="name">
            <UInput v-model="state.name" placeholder="Digite o nome" />
          </UFormGroup>

          <UFormGroup label="Valor" name="amount">
            <MoneyInput v-model="state.amount" />
          </UFormGroup>

          <UFormGroup label="Tipo" name="type">
            <USelect
              v-model="state.type"
              :options="TRANSACTION_TYPE_OPTIONS"
              placeholder="Selecione o tipo da transação"
            />
          </UFormGroup>

          <UFormGroup label="Categoria" name="category">
            <USelect
              v-model="state.category"
              :options="TRANSACTION_CATEGORY_OPTIONS"
              placeholder="Selecione a categoria da transação"
            />
          </UFormGroup>

          <UFormGroup label="Método de Pagamento" name="paymentMethod">
            <USelect
              v-model="state.paymentMethod"
              :options="TRANSACTION_PAYMENT_METHOD_OPTIONS"
              placeholder="Selecione um método de pagamento"
            />
          </UFormGroup>

          <UFormGroup label="Data" name="date">
            <!-- TODO: Replace with a custom DatePicker component for better UX -->
            <UInput v-model="state.date" type="date" />
          </UFormGroup>

          <DialogFooter class="pt-4">
            <DialogClose as-child>
              <UButton type="button" variant="outline">
                Cancelar
              </UButton>
            </DialogClose>
            <UButton class="mb-3 sm:mb-0" type="submit">
              {{ isUpdate ? "Atualizar" : "Adicionar" }}
            </UButton>
          </DialogFooter>
        </UForm>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
