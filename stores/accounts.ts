import { defineStore } from "pinia";
import { ref } from "vue";
import type { Account } from "@/constants/accounts.js";

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref<Account[]>([]);
  const isLoading = ref(false);

  function setAccounts(list: Account[]) {
    accounts.value = list;
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  function addAccount(account: Account) {
    accounts.value = [...accounts.value, account];
  }

  function updateAccount(account: Account) {
    const index = accounts.value.findIndex((a) => a.id === account.id);
    if (index === -1) return;
    accounts.value = [
      ...accounts.value.slice(0, index),
      account,
      ...accounts.value.slice(index + 1),
    ];
  }

  function removeAccount(accountId: string) {
    accounts.value = accounts.value.filter((a) => a.id !== accountId);
  }

  return {
    accounts,
    isLoading,
    setAccounts,
    setLoading,
    addAccount,
    updateAccount,
    removeAccount,
  };
});
