import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSavingsGoals,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
} from "~/service/savingsGoalService";

const mockDb = { __brand: "mock-db" };

vi.mock("~/lib/firebase.js", () => ({
  db: () => mockDb,
}));

const collectionMock = vi.fn((...args: unknown[]) => ({ __collection: args }));
const docMock = vi.fn((...args: unknown[]) => ({ __doc: args }));
const addDocMock = vi.fn();
const updateDocMock = vi.fn();
const deleteDocMock = vi.fn();
const getDocsMock = vi.fn();
const queryMock = vi.fn((...args: unknown[]) => ({ __query: args }));
const orderByMock = vi.fn((...args: unknown[]) => ({ __orderBy: args }));

const { FakeTimestamp } = vi.hoisted(() => {
  class FakeTimestamp {
    date: Date;
    constructor(date: Date) {
      this.date = date;
    }
    static fromDate(date: Date) {
      return new FakeTimestamp(date);
    }
    static now() {
      return new FakeTimestamp(new Date());
    }
    toDate() {
      return this.date;
    }
  }
  return { FakeTimestamp };
});

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => collectionMock(...args),
  doc: (...args: unknown[]) => docMock(...args),
  addDoc: (...args: unknown[]) => addDocMock(...args),
  updateDoc: (...args: unknown[]) => updateDocMock(...args),
  deleteDoc: (...args: unknown[]) => deleteDocMock(...args),
  getDocs: (...args: unknown[]) => getDocsMock(...args),
  query: (...args: unknown[]) => queryMock(...args),
  orderBy: (...args: unknown[]) => orderByMock(...args),
  Timestamp: FakeTimestamp,
}));

describe("savingsGoalService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSavingsGoals", () => {
    it("orders by deadline ascending and maps documents into SavingsGoal objects", async () => {
      const deadline = new Date(2026, 11, 31);
      getDocsMock.mockResolvedValue({
        docs: [
          {
            id: "goal-1",
            data: () => ({
              name: "Viagem",
              targetAmount: 1000,
              currentAmount: 200,
              deadline: FakeTimestamp.fromDate(deadline),
              createdAt: FakeTimestamp.fromDate(deadline),
              updatedAt: FakeTimestamp.fromDate(deadline),
            }),
          },
        ],
      });

      const goals = await getSavingsGoals("user-1");

      expect(orderByMock).toHaveBeenCalledWith("deadline", "asc");
      expect(goals).toHaveLength(1);
      expect(goals[0]).toMatchObject({
        id: "goal-1",
        name: "Viagem",
        targetAmount: 1000,
        currentAmount: 200,
      });
      expect(goals[0].deadline).toEqual(deadline);
    });

    it("returns an empty array when there are no goals", async () => {
      getDocsMock.mockResolvedValue({ docs: [] });
      const goals = await getSavingsGoals("user-1");
      expect(goals).toEqual([]);
    });

    it("falls back to the current date when timestamps are missing", async () => {
      getDocsMock.mockResolvedValue({
        docs: [
          {
            id: "goal-1",
            data: () => ({
              name: "Sem prazo",
              targetAmount: 100,
              currentAmount: 0,
            }),
          },
        ],
      });

      const [goal] = await getSavingsGoals("user-1");

      expect(goal.deadline).toBeInstanceOf(Date);
      expect(goal.createdAt).toBeInstanceOf(Date);
      expect(goal.updatedAt).toBeInstanceOf(Date);
    });

    it("throws a friendly error when Firestore fails", async () => {
      getDocsMock.mockRejectedValue(new Error("network error"));

      await expect(getSavingsGoals("user-1")).rejects.toThrow(
        "Erro ao buscar metas de economia do Firebase"
      );
    });
  });

  describe("addSavingsGoal", () => {
    it("saves a new goal with Timestamp deadline/createdAt/updatedAt and returns its id", async () => {
      addDocMock.mockResolvedValue({ id: "generated-id" });

      const id = await addSavingsGoal("user-1", {
        name: "Viagem",
        targetAmount: 1000,
        currentAmount: 100,
        deadline: new Date(2026, 11, 31),
      });

      expect(id).toBe("generated-id");
      expect(collectionMock).toHaveBeenCalledWith(mockDb, "users", "user-1", "savingsGoals");

      const [, savedData] = addDocMock.mock.calls[0];
      expect(savedData.name).toBe("Viagem");
      expect(savedData.targetAmount).toBe(1000);
      expect(savedData.currentAmount).toBe(100);
      expect(savedData.deadline).toBeInstanceOf(FakeTimestamp);
      expect(savedData.createdAt).toBeInstanceOf(FakeTimestamp);
      expect(savedData.updatedAt).toBeInstanceOf(FakeTimestamp);
    });

    it("defaults currentAmount to 0 when not provided", async () => {
      addDocMock.mockResolvedValue({ id: "generated-id" });

      await addSavingsGoal("user-1", {
        name: "Viagem",
        targetAmount: 1000,
        deadline: new Date(2026, 11, 31),
      });

      const [, savedData] = addDocMock.mock.calls[0];
      expect(savedData.currentAmount).toBe(0);
    });

    it("throws a friendly error when Firestore fails", async () => {
      addDocMock.mockRejectedValue(new Error("network error"));

      await expect(
        addSavingsGoal("user-1", {
          name: "Viagem",
          targetAmount: 1000,
          deadline: new Date(),
        })
      ).rejects.toThrow("Erro ao salvar meta de economia no Firebase");
    });
  });

  describe("updateSavingsGoal", () => {
    it("updates only the provided fields and refreshes updatedAt", async () => {
      updateDocMock.mockResolvedValue(undefined);

      await updateSavingsGoal("user-1", "goal-1", { currentAmount: 500 });

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "users",
        "user-1",
        "savingsGoals",
        "goal-1"
      );
      const [, updateData] = updateDocMock.mock.calls[0];
      expect(updateData.currentAmount).toBe(500);
      expect(updateData.updatedAt).toBeInstanceOf(FakeTimestamp);
      expect(updateData.deadline).toBeUndefined();
    });

    it("converts the deadline field to a Timestamp when provided", async () => {
      updateDocMock.mockResolvedValue(undefined);
      const newDeadline = new Date(2027, 0, 1);

      await updateSavingsGoal("user-1", "goal-1", { deadline: newDeadline });

      const [, updateData] = updateDocMock.mock.calls[0];
      expect(updateData.deadline).toBeInstanceOf(FakeTimestamp);
      expect(updateData.deadline.date).toEqual(newDeadline);
    });

    it("throws a friendly error when Firestore fails", async () => {
      updateDocMock.mockRejectedValue(new Error("network error"));

      await expect(
        updateSavingsGoal("user-1", "goal-1", { currentAmount: 500 })
      ).rejects.toThrow("Erro ao atualizar meta de economia no Firebase");
    });
  });

  describe("deleteSavingsGoal", () => {
    it("deletes the goal document", async () => {
      deleteDocMock.mockResolvedValue(undefined);

      await deleteSavingsGoal("user-1", "goal-1");

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "users",
        "user-1",
        "savingsGoals",
        "goal-1"
      );
      expect(deleteDocMock).toHaveBeenCalled();
    });

    it("throws a friendly error when Firestore fails", async () => {
      deleteDocMock.mockRejectedValue(new Error("network error"));

      await expect(deleteSavingsGoal("user-1", "goal-1")).rejects.toThrow(
        "Erro ao remover meta de economia do Firebase"
      );
    });
  });
});
