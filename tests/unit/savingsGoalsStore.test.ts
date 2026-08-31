import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useSavingsGoalsStore } from "~/stores/savingsGoals";
import type { SavingsGoal } from "~/service/savingsGoalService";

function buildGoal(overrides: Partial<SavingsGoal> = {}): SavingsGoal {
  return {
    id: "goal-1",
    name: "Viagem",
    targetAmount: 1000,
    currentAmount: 200,
    deadline: new Date(2026, 11, 31),
    userId: "user-1",
    createdAt: new Date(2026, 0, 1),
    updatedAt: new Date(2026, 0, 1),
    ...overrides,
  };
}

describe("useSavingsGoalsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty goals list and not loading", () => {
    const store = useSavingsGoalsStore();
    expect(store.goals).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it("sets the loading flag", () => {
    const store = useSavingsGoalsStore();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it("replaces the goals list with setGoals", () => {
    const store = useSavingsGoalsStore();
    const goals = [buildGoal(), buildGoal({ id: "goal-2", name: "Carro" })];
    store.setGoals(goals);
    expect(store.goals).toEqual(goals);
  });

  it("appends a goal with addGoal", () => {
    const store = useSavingsGoalsStore();
    store.setGoals([buildGoal({ id: "goal-1" })]);
    store.addGoal(buildGoal({ id: "goal-2", name: "Carro" }));

    expect(store.goals).toHaveLength(2);
    expect(store.goals[1].name).toBe("Carro");
  });

  it("updates an existing goal by id", () => {
    const store = useSavingsGoalsStore();
    store.setGoals([buildGoal({ id: "goal-1", currentAmount: 200 })]);

    store.updateGoal(buildGoal({ id: "goal-1", currentAmount: 500 }));

    expect(store.goals).toHaveLength(1);
    expect(store.goals[0].currentAmount).toBe(500);
  });

  it("does nothing when updating a goal id that does not exist", () => {
    const store = useSavingsGoalsStore();
    store.setGoals([buildGoal({ id: "goal-1" })]);

    store.updateGoal(buildGoal({ id: "non-existent", name: "Não deveria aparecer" }));

    expect(store.goals).toHaveLength(1);
    expect(store.goals[0].id).toBe("goal-1");
  });

  it("removes a goal by id", () => {
    const store = useSavingsGoalsStore();
    store.setGoals([buildGoal({ id: "goal-1" }), buildGoal({ id: "goal-2" })]);

    store.removeGoal("goal-1");

    expect(store.goals).toHaveLength(1);
    expect(store.goals[0].id).toBe("goal-2");
  });

  it("does nothing when removing a non-existent goal id", () => {
    const store = useSavingsGoalsStore();
    store.setGoals([buildGoal({ id: "goal-1" })]);

    store.removeGoal("non-existent");

    expect(store.goals).toHaveLength(1);
  });
});
