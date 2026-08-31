import { describe, it, expect, vi, beforeEach } from "vitest";
import { TransactionCategory } from "~/constants/transactions";
import { getBudgets, setBudget, deleteBudget } from "~/service/budgetService";

const mockDb = { __brand: "mock-db" };

vi.mock("~/lib/firebase.js", () => ({
  db: () => mockDb,
}));

const collectionMock = vi.fn((...args: unknown[]) => ({ __collection: args }));
const docMock = vi.fn((...args: unknown[]) => ({ __doc: args }));
const getDocsMock = vi.fn();
const setDocMock = vi.fn();
const deleteDocMock = vi.fn();

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => collectionMock(...args),
  doc: (...args: unknown[]) => docMock(...args),
  getDocs: (...args: unknown[]) => getDocsMock(...args),
  setDoc: (...args: unknown[]) => setDocMock(...args),
  deleteDoc: (...args: unknown[]) => deleteDocMock(...args),
}));

describe("budgetService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBudgets", () => {
    it("maps Firestore documents into CategoryBudget objects", async () => {
      getDocsMock.mockResolvedValue({
        docs: [
          { id: TransactionCategory.FOOD, data: () => ({ monthlyLimit: 500 }) },
          { id: TransactionCategory.HOUSING, data: () => ({ monthlyLimit: 1500 }) },
        ],
      });

      const budgets = await getBudgets("user-1");

      expect(collectionMock).toHaveBeenCalledWith(mockDb, "users", "user-1", "budgets");
      expect(budgets).toEqual([
        { category: TransactionCategory.FOOD, monthlyLimit: 500 },
        { category: TransactionCategory.HOUSING, monthlyLimit: 1500 },
      ]);
    });

    it("returns an empty array when there are no budgets", async () => {
      getDocsMock.mockResolvedValue({ docs: [] });

      const budgets = await getBudgets("user-1");

      expect(budgets).toEqual([]);
    });

    it("throws a friendly error when Firestore fails", async () => {
      getDocsMock.mockRejectedValue(new Error("network error"));

      await expect(getBudgets("user-1")).rejects.toThrow(
        "Erro ao buscar orçamentos do Firebase"
      );
    });
  });

  describe("setBudget", () => {
    it("saves the monthly limit for a category", async () => {
      setDocMock.mockResolvedValue(undefined);

      await setBudget("user-1", TransactionCategory.FOOD, 300);

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "users",
        "user-1",
        "budgets",
        TransactionCategory.FOOD
      );
      expect(setDocMock).toHaveBeenCalledWith(
        { __doc: [mockDb, "users", "user-1", "budgets", TransactionCategory.FOOD] },
        { monthlyLimit: 300 }
      );
    });

    it("throws a friendly error when Firestore fails", async () => {
      setDocMock.mockRejectedValue(new Error("network error"));

      await expect(setBudget("user-1", TransactionCategory.FOOD, 300)).rejects.toThrow(
        "Erro ao salvar orçamento no Firebase"
      );
    });
  });

  describe("deleteBudget", () => {
    it("removes the budget document for a category", async () => {
      deleteDocMock.mockResolvedValue(undefined);

      await deleteBudget("user-1", TransactionCategory.FOOD);

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "users",
        "user-1",
        "budgets",
        TransactionCategory.FOOD
      );
      expect(deleteDocMock).toHaveBeenCalled();
    });

    it("throws a friendly error when Firestore fails", async () => {
      deleteDocMock.mockRejectedValue(new Error("network error"));

      await expect(deleteBudget("user-1", TransactionCategory.FOOD)).rejects.toThrow(
        "Erro ao remover orçamento do Firebase"
      );
    });
  });
});
