import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useSharedBudgetsStore } from "~/stores/sharedBudgets";
import type {
  SharedBudget,
  SharedBudgetInvite,
} from "~/service/sharedBudgetService";

const makeBudget = (overrides: Partial<SharedBudget> = {}): SharedBudget => ({
  id: "budget-1",
  name: "Família",
  ownerId: "owner-1",
  ownerEmail: "owner@example.com",
  memberUids: ["owner-1"],
  memberEmails: ["owner@example.com"],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeInvite = (overrides: Partial<SharedBudgetInvite> = {}): SharedBudgetInvite => ({
  id: "invite-1",
  sharedBudgetId: "budget-1",
  sharedBudgetName: "Família",
  email: "friend@example.com",
  invitedByUid: "owner-1",
  invitedByEmail: "owner@example.com",
  status: "pending",
  createdAt: new Date(),
  ...overrides,
});

describe("useSharedBudgetsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts empty", () => {
    const store = useSharedBudgetsStore();
    expect(store.sharedBudgets).toEqual([]);
    expect(store.pendingInvites).toEqual([]);
  });

  it("sets and adds shared budgets", () => {
    const store = useSharedBudgetsStore();
    store.setSharedBudgets([makeBudget()]);
    expect(store.sharedBudgets).toHaveLength(1);

    store.addSharedBudget(makeBudget({ id: "budget-2", name: "Viagem" }));
    expect(store.sharedBudgets).toHaveLength(2);
  });

  it("removes a shared budget and its category budgets", () => {
    const store = useSharedBudgetsStore();
    store.setSharedBudgets([makeBudget()]);
    store.setCategoryBudgets("budget-1", [{ category: "FOOD", monthlyLimit: 300 }]);

    store.removeSharedBudget("budget-1");

    expect(store.sharedBudgets).toEqual([]);
    expect(store.getCategoryBudgetsFor("budget-1")).toEqual({});
  });

  it("updates an existing shared budget in place", () => {
    const store = useSharedBudgetsStore();
    store.setSharedBudgets([makeBudget()]);

    store.updateSharedBudget(
      makeBudget({ memberUids: ["owner-1", "user-2"], memberEmails: ["owner@example.com", "user2@example.com"] })
    );

    expect(store.sharedBudgets[0].memberUids).toEqual(["owner-1", "user-2"]);
  });

  it("manages pending invites", () => {
    const store = useSharedBudgetsStore();
    store.setPendingInvites([makeInvite()]);
    expect(store.pendingInvites).toHaveLength(1);

    store.removeInvite("invite-1");
    expect(store.pendingInvites).toEqual([]);
  });

  it("sets category budgets keyed by category, scoped per shared budget", () => {
    const store = useSharedBudgetsStore();
    store.setCategoryBudgets("budget-1", [
      { category: "FOOD", monthlyLimit: 300 },
      { category: "HEALTH", monthlyLimit: 200 },
    ]);

    expect(store.getCategoryBudgetsFor("budget-1")).toEqual({
      FOOD: 300,
      HEALTH: 200,
    });
    expect(store.getCategoryBudgetsFor("budget-2")).toEqual({});
  });

  it("sets a single category budget without affecting other shared budgets", () => {
    const store = useSharedBudgetsStore();
    store.setCategoryBudgets("budget-1", [{ category: "FOOD", monthlyLimit: 300 }]);
    store.setCategoryBudget("budget-2", "FOOD", 500);

    expect(store.getCategoryBudgetsFor("budget-1")).toEqual({ FOOD: 300 });
    expect(store.getCategoryBudgetsFor("budget-2")).toEqual({ FOOD: 500 });
  });
});
