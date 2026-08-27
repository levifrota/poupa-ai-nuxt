import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAccountsStore } from "~/stores/accounts";
import { AccountType, type Account } from "~/constants/accounts";

function buildAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: "acc-1",
    name: "Conta corrente",
    type: AccountType.CHECKING,
    userId: "user-1",
    createdAt: new Date(2026, 0, 1),
    updatedAt: new Date(2026, 0, 1),
    ...overrides,
  };
}

describe("useAccountsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty list and not loading", () => {
    const store = useAccountsStore();
    expect(store.accounts).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it("sets the loading flag", () => {
    const store = useAccountsStore();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it("replaces the list with setAccounts", () => {
    const store = useAccountsStore();
    const accounts = [buildAccount(), buildAccount({ id: "acc-2" })];
    store.setAccounts(accounts);
    expect(store.accounts).toEqual(accounts);
  });

  it("appends a new account with addAccount", () => {
    const store = useAccountsStore();
    store.setAccounts([buildAccount({ id: "acc-1" })]);
    store.addAccount(buildAccount({ id: "acc-2", name: "Nubank" }));
    expect(store.accounts).toHaveLength(2);
    expect(store.accounts[1].name).toBe("Nubank");
  });

  it("updates an existing account with updateAccount", () => {
    const store = useAccountsStore();
    store.setAccounts([buildAccount({ id: "acc-1", name: "Antigo" })]);
    store.updateAccount(buildAccount({ id: "acc-1", name: "Novo nome" }));
    expect(store.accounts[0].name).toBe("Novo nome");
  });

  it("does nothing when updating a non-existent account", () => {
    const store = useAccountsStore();
    store.setAccounts([buildAccount({ id: "acc-1" })]);
    store.updateAccount(buildAccount({ id: "does-not-exist", name: "X" }));
    expect(store.accounts).toHaveLength(1);
    expect(store.accounts[0].id).toBe("acc-1");
  });

  it("removes an account with removeAccount", () => {
    const store = useAccountsStore();
    store.setAccounts([buildAccount({ id: "acc-1" }), buildAccount({ id: "acc-2" })]);
    store.removeAccount("acc-1");
    expect(store.accounts).toHaveLength(1);
    expect(store.accounts[0].id).toBe("acc-2");
  });
});
