import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  RecurrenceFrequency,
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "~/constants/transactions";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getRecurringTransactions,
  confirmRecurringOccurrence,
  skipRecurringOccurrence,
} from "~/service/transactionService";
import type { Transaction } from "~/constants/transactions";

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
const whereMock = vi.fn((...args: unknown[]) => ({ __where: args }));
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
  where: (...args: unknown[]) => whereMock(...args),
  orderBy: (...args: unknown[]) => orderByMock(...args),
  Timestamp: FakeTimestamp,
}));


describe("transactionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addTransaction", () => {
    it("saves a transaction with Timestamp date/createdAt/updatedAt and returns its id", async () => {
      addDocMock.mockResolvedValue({ id: "generated-id" });

      const id = await addTransaction("user-1", {
        name: "Mercado",
        amount: 100,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
        paymentMethod: TransactionPaymentMethod.CASH,
        date: new Date(2026, 0, 1),
        tags: ["mensal"],
      });

      expect(id).toBe("generated-id");
      expect(collectionMock).toHaveBeenCalledWith(mockDb, "users", "user-1", "transactions");

      const [, savedData] = addDocMock.mock.calls[0];
      expect(savedData.name).toBe("Mercado");
      expect(savedData.tags).toEqual(["mensal"]);
      expect(savedData.date).toBeInstanceOf(FakeTimestamp);
      expect(savedData.createdAt).toBeInstanceOf(FakeTimestamp);
      expect(savedData.updatedAt).toBeInstanceOf(FakeTimestamp);
    });

    it("throws a friendly error when Firestore fails", async () => {
      addDocMock.mockRejectedValue(new Error("network error"));

      await expect(
        addTransaction("user-1", {
          name: "Mercado",
          amount: 100,
          type: TransactionType.EXPENSE,
          category: TransactionCategory.FOOD,
          paymentMethod: TransactionPaymentMethod.CASH,
          date: new Date(),
        })
      ).rejects.toThrow("Erro ao salvar transação no Firebase");
    });
  });

  describe("updateTransaction", () => {
    it("updates only the provided fields and refreshes updatedAt", async () => {
      updateDocMock.mockResolvedValue(undefined);

      await updateTransaction("user-1", "tx-1", { name: "Novo nome" });

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "users",
        "user-1",
        "transactions",
        "tx-1"
      );
      const [, updateData] = updateDocMock.mock.calls[0];
      expect(updateData.name).toBe("Novo nome");
      expect(updateData.updatedAt).toBeInstanceOf(FakeTimestamp);
      expect(updateData.date).toBeUndefined();
    });

    it("converts the date field to a Timestamp when provided", async () => {
      updateDocMock.mockResolvedValue(undefined);
      const newDate = new Date(2026, 5, 1);

      await updateTransaction("user-1", "tx-1", { date: newDate });

      const [, updateData] = updateDocMock.mock.calls[0];
      expect(updateData.date).toBeInstanceOf(FakeTimestamp);
      expect(updateData.date.date).toEqual(newDate);
    });

    it("throws a friendly error when Firestore fails", async () => {
      updateDocMock.mockRejectedValue(new Error("network error"));

      await expect(
        updateTransaction("user-1", "tx-1", { name: "x" })
      ).rejects.toThrow("Erro ao atualizar transação no Firebase");
    });
  });

  describe("deleteTransaction", () => {
    it("deletes the transaction document", async () => {
      deleteDocMock.mockResolvedValue(undefined);

      await deleteTransaction("user-1", "tx-1");

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "users",
        "user-1",
        "transactions",
        "tx-1"
      );
      expect(deleteDocMock).toHaveBeenCalled();
    });

    it("throws a friendly error when Firestore fails", async () => {
      deleteDocMock.mockRejectedValue(new Error("network error"));

      await expect(deleteTransaction("user-1", "tx-1")).rejects.toThrow(
        "Erro ao remover transação do Firebase"
      );
    });
  });

  describe("getTransactions", () => {
    it("fetches all transactions ordered by date desc when no range is given", async () => {
      getDocsMock.mockResolvedValue({ docs: [] });

      const transactions = await getTransactions("user-1");

      expect(orderByMock).toHaveBeenCalledWith("date", "desc");
      expect(whereMock).not.toHaveBeenCalled();
      expect(transactions).toEqual([]);
    });

    it("applies date range filters (inclusive of the end date) when provided", async () => {
      getDocsMock.mockResolvedValue({ docs: [] });
      const startDate = new Date(2026, 0, 1);
      const endDate = new Date(2026, 0, 31);

      await getTransactions("user-1", startDate, endDate);

      expect(whereMock).toHaveBeenCalledWith("date", ">=", expect.any(FakeTimestamp));
      expect(whereMock).toHaveBeenCalledWith("date", "<", expect.any(FakeTimestamp));

      const endCall = whereMock.mock.calls.find((call) => call[1] === "<");
      const adjustedEnd: FakeTimestamp = endCall?.[2];
      expect(adjustedEnd.date.getDate()).toBe(1); // 31 Jan + 1 day = 1 Feb
    });

    it("maps Firestore documents into Transaction objects with converted dates", async () => {
      const date = new Date(2026, 0, 15);
      getDocsMock.mockResolvedValue({
        docs: [
          {
            id: "tx-1",
            data: () => ({
              name: "Mercado",
              amount: 50,
              type: TransactionType.EXPENSE,
              category: TransactionCategory.FOOD,
              paymentMethod: TransactionPaymentMethod.CASH,
              date: FakeTimestamp.fromDate(date),
              createdAt: FakeTimestamp.fromDate(date),
              updatedAt: FakeTimestamp.fromDate(date),
              tags: ["mensal"],
            }),
          },
        ],
      });

      const [transaction] = await getTransactions("user-1");

      expect(transaction.id).toBe("tx-1");
      expect(transaction.name).toBe("Mercado");
      expect(transaction.date).toEqual(date);
      expect(transaction.createdAt).toEqual(date);
      expect(transaction.updatedAt).toEqual(date);
      expect(transaction.tags).toEqual(["mensal"]);
    });

    it("falls back to the current date when timestamps are missing", async () => {
      getDocsMock.mockResolvedValue({
        docs: [
          {
            id: "tx-1",
            data: () => ({
              name: "Sem data",
              amount: 10,
              type: TransactionType.EXPENSE,
              category: TransactionCategory.OTHER,
              paymentMethod: TransactionPaymentMethod.OTHER,
            }),
          },
        ],
      });

      const [transaction] = await getTransactions("user-1");

      expect(transaction.date).toBeInstanceOf(Date);
      expect(transaction.createdAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt).toBeInstanceOf(Date);
    });

    it("throws a friendly error when Firestore fails", async () => {
      getDocsMock.mockRejectedValue(new Error("network error"));

      await expect(getTransactions("user-1")).rejects.toThrow(
        "Erro ao buscar transações do Firebase"
      );
    });
  });

  describe("getRecurringTransactions", () => {
    it("queries transactions where isRecurring is true and maps nextOccurrenceDate", async () => {
      const nextOccurrenceDate = new Date(2026, 1, 1);
      const date = new Date(2026, 0, 1);
      getDocsMock.mockResolvedValue({
        docs: [
          {
            id: "tx-1",
            data: () => ({
              name: "Aluguel",
              amount: 1500,
              type: TransactionType.EXPENSE,
              category: TransactionCategory.HOUSING,
              paymentMethod: TransactionPaymentMethod.BANK_TRANSFER,
              date: FakeTimestamp.fromDate(date),
              createdAt: FakeTimestamp.fromDate(date),
              updatedAt: FakeTimestamp.fromDate(date),
              isRecurring: true,
              recurrenceFrequency: RecurrenceFrequency.MONTHLY,
              nextOccurrenceDate: FakeTimestamp.fromDate(nextOccurrenceDate),
            }),
          },
        ],
      });

      const transactions = await getRecurringTransactions("user-1");

      expect(whereMock).toHaveBeenCalledWith("isRecurring", "==", true);
      expect(transactions).toHaveLength(1);
      expect(transactions[0].nextOccurrenceDate).toEqual(nextOccurrenceDate);
      expect(transactions[0].recurrenceFrequency).toBe(RecurrenceFrequency.MONTHLY);
    });

    it("returns an empty array when there are no recurring transactions", async () => {
      getDocsMock.mockResolvedValue({ docs: [] });
      const transactions = await getRecurringTransactions("user-1");
      expect(transactions).toEqual([]);
    });

    it("throws a friendly error when Firestore fails", async () => {
      getDocsMock.mockRejectedValue(new Error("network error"));

      await expect(getRecurringTransactions("user-1")).rejects.toThrow(
        "Erro ao buscar transações recorrentes do Firebase"
      );
    });
  });

  describe("confirmRecurringOccurrence", () => {
    const baseRecurringTransaction: Transaction = {
      id: "tx-1",
      name: "Aluguel",
      amount: 1500,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.HOUSING,
      paymentMethod: TransactionPaymentMethod.BANK_TRANSFER,
      date: new Date(2026, 0, 1),
      userId: "user-1",
      createdAt: new Date(2026, 0, 1),
      updatedAt: new Date(2026, 0, 1),
      isRecurring: true,
      recurrenceFrequency: RecurrenceFrequency.MONTHLY,
      nextOccurrenceDate: new Date(2026, 1, 1),
    };

    it("creates a new non-recurring transaction on the occurrence date and advances nextOccurrenceDate", async () => {
      addDocMock.mockResolvedValue({ id: "new-tx-id" });
      updateDocMock.mockResolvedValue(undefined);

      const newId = await confirmRecurringOccurrence("user-1", baseRecurringTransaction);

      expect(newId).toBe("new-tx-id");

      const [, savedData] = addDocMock.mock.calls[0];
      expect(savedData.name).toBe("Aluguel");
      expect(savedData.date).toEqual(FakeTimestamp.fromDate(new Date(2026, 1, 1)));

      const [, updateData] = updateDocMock.mock.calls[0];
      expect(updateData.nextOccurrenceDate.date).toEqual(new Date(2026, 2, 1));
    });

    it("throws when the recurring transaction is missing recurrence data", async () => {
      await expect(
        confirmRecurringOccurrence("user-1", {
          ...baseRecurringTransaction,
          recurrenceFrequency: undefined,
        })
      ).rejects.toThrow("Transação recorrente inválida");
    });
  });

  describe("skipRecurringOccurrence", () => {
    const baseRecurringTransaction: Transaction = {
      id: "tx-1",
      name: "Aluguel",
      amount: 1500,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.HOUSING,
      paymentMethod: TransactionPaymentMethod.BANK_TRANSFER,
      date: new Date(2026, 0, 1),
      userId: "user-1",
      createdAt: new Date(2026, 0, 1),
      updatedAt: new Date(2026, 0, 1),
      isRecurring: true,
      recurrenceFrequency: RecurrenceFrequency.MONTHLY,
      nextOccurrenceDate: new Date(2026, 1, 1),
    };

    it("advances nextOccurrenceDate without creating a new transaction", async () => {
      updateDocMock.mockResolvedValue(undefined);

      await skipRecurringOccurrence("user-1", baseRecurringTransaction);

      expect(addDocMock).not.toHaveBeenCalled();
      const [, updateData] = updateDocMock.mock.calls[0];
      expect(updateData.nextOccurrenceDate.date).toEqual(new Date(2026, 2, 1));
    });

    it("throws when the recurring transaction is missing recurrence data", async () => {
      await expect(
        skipRecurringOccurrence("user-1", {
          ...baseRecurringTransaction,
          nextOccurrenceDate: undefined,
        })
      ).rejects.toThrow("Transação recorrente inválida");
    });
  });
});
