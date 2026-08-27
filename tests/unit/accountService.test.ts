import { describe, it, expect, vi, beforeEach } from "vitest";
import { AccountType } from "~/constants/accounts";
import {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
} from "~/service/accountService";

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

describe("accountService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAccounts", () => {
    it("orders by name ascending and maps documents into Account objects", async () => {
      const date = new Date(2026, 0, 1);
      getDocsMock.mockResolvedValue({
        docs: [
          {
            id: "acc-1",
            data: () => ({
              name: "Conta corrente",
              type: AccountType.CHECKING,
              createdAt: FakeTimestamp.fromDate(date),
              updatedAt: FakeTimestamp.fromDate(date),
            }),
          },
        ],
      });

      const accounts = await getAccounts("user-1");

      expect(orderByMock).toHaveBeenCalledWith("name", "asc");
      expect(accounts).toHaveLength(1);
      expect(accounts[0]).toMatchObject({
        id: "acc-1",
        name: "Conta corrente",
        type: AccountType.CHECKING,
      });
      expect(accounts[0].createdAt).toEqual(date);
    });

    it("returns an empty array when there are no accounts", async () => {
      getDocsMock.mockResolvedValue({ docs: [] });
      const accounts = await getAccounts("user-1");
      expect(accounts).toEqual([]);
    });

    it("throws a friendly error when Firestore fails", async () => {
      getDocsMock.mockRejectedValue(new Error("network error"));

      await expect(getAccounts("user-1")).rejects.toThrow(
        "Erro ao buscar contas do Firebase"
      );
    });
  });

  describe("addAccount", () => {
    it("saves an account with createdAt/updatedAt timestamps and returns its id", async () => {
      addDocMock.mockResolvedValue({ id: "generated-id" });

      const id = await addAccount("user-1", {
        name: "Nubank",
        type: AccountType.CREDIT_CARD,
      });

      expect(id).toBe("generated-id");
      expect(collectionMock).toHaveBeenCalledWith(mockDb, "users", "user-1", "accounts");

      const [, savedData] = addDocMock.mock.calls[0];
      expect(savedData.name).toBe("Nubank");
      expect(savedData.type).toBe(AccountType.CREDIT_CARD);
      expect(savedData.createdAt).toBeInstanceOf(FakeTimestamp);
      expect(savedData.updatedAt).toBeInstanceOf(FakeTimestamp);
    });

    it("throws a friendly error when Firestore fails", async () => {
      addDocMock.mockRejectedValue(new Error("network error"));

      await expect(
        addAccount("user-1", { name: "Nubank", type: AccountType.CREDIT_CARD })
      ).rejects.toThrow("Erro ao salvar conta no Firebase");
    });
  });

  describe("updateAccount", () => {
    it("updates only the provided fields and refreshes updatedAt", async () => {
      updateDocMock.mockResolvedValue(undefined);

      await updateAccount("user-1", "acc-1", { name: "Novo nome" });

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "users",
        "user-1",
        "accounts",
        "acc-1"
      );
      const [, updateData] = updateDocMock.mock.calls[0];
      expect(updateData.name).toBe("Novo nome");
      expect(updateData.updatedAt).toBeInstanceOf(FakeTimestamp);
    });

    it("throws a friendly error when Firestore fails", async () => {
      updateDocMock.mockRejectedValue(new Error("network error"));

      await expect(
        updateAccount("user-1", "acc-1", { name: "Novo nome" })
      ).rejects.toThrow("Erro ao atualizar conta no Firebase");
    });
  });

  describe("deleteAccount", () => {
    it("deletes the account document", async () => {
      deleteDocMock.mockResolvedValue(undefined);

      await deleteAccount("user-1", "acc-1");

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "users",
        "user-1",
        "accounts",
        "acc-1"
      );
      expect(deleteDocMock).toHaveBeenCalled();
    });

    it("throws a friendly error when Firestore fails", async () => {
      deleteDocMock.mockRejectedValue(new Error("network error"));

      await expect(deleteAccount("user-1", "acc-1")).rejects.toThrow(
        "Erro ao remover conta do Firebase"
      );
    });
  });
});
