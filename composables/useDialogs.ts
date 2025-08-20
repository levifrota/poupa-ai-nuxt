import { ref } from 'vue'
import type { Transaction } from '~/types'

const isUpsertTransactionDialogOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

export const useDialogs = () => {
  const openUpsertTransactionDialog = (transaction: Transaction | null = null) => {
    selectedTransaction.value = transaction
    isUpsertTransactionDialogOpen.value = true
  }

  const closeUpsertTransactionDialog = () => {
    isUpsertTransactionDialogOpen.value = false
    selectedTransaction.value = null
  }

  return {
    isUpsertTransactionDialogOpen,
    selectedTransaction,
    openUpsertTransactionDialog,
    closeUpsertTransactionDialog,
  }
}
