import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSharedBudget,
  getSharedBudgetsForUser,
  deleteSharedBudget,
  removeSharedBudgetMember,
  inviteMemberToSharedBudget,
  getPendingInvitesForEmail,
  acceptSharedBudgetInvite,
  declineSharedBudgetInvite,
  getSharedBudgetCategoryBudgets,
  setSharedBudgetCategoryBudget,
  getSharedBudgetById,
  type SharedBudgetInvite,
} from "~/service/sharedBudgetService";
import { TransactionCategory } from "~/constants/transactions";

const mockDb = { __brand: "mock-db" };

vi.mock("~/lib/firebase.js", () => ({
  db: () => mockDb,
}));

const collectionMock = vi.fn((...args: unknown[]) => ({ __collection: args }));
const collectionGroupMock = vi.fn((...args: unknown[]) => ({ __collectionGroup: args }));
const docMock = vi.fn((...args: unknown[]) => ({ __doc: args }));
const queryMock = vi.fn((...args: unknown[]) => ({ __query: args }));
const whereMock = vi.fn((...args: unknown[]) => ({ __where: args }));
const arrayUnionMock = vi.fn((...args: unknown[]) => ({ __arrayUnion: args }));
const arrayRemoveMock = vi.fn((...args: unknown[]) => ({ __arrayRemove: args }));
const addDocMock = vi.fn();
const setDocMock = vi.fn();
const updateDocMock = vi.fn();
const deleteDocMock = vi.fn();
const getDocMock = vi.fn();
const getDocsMock = vi.fn();

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => collectionMock(...args),
  collectionGroup: (...args: unknown[]) => collectionGroupMock(...args),
  doc: (...args: unknown[]) => docMock(...args),
  query: (...args: unknown[]) => queryMock(...args),
  where: (...args: unknown[]) => whereMock(...args),
  arrayUnion: (...args: unknown[]) => arrayUnionMock(...args),
  arrayRemove: (...args: unknown[]) => arrayRemoveMock(...args),
  addDoc: (...args: unknown[]) => addDocMock(...args),
  setDoc: (...args: unknown[]) => setDocMock(...args),
  updateDoc: (...args: unknown[]) => updateDocMock(...args),
  deleteDoc: (...args: unknown[]) => deleteDocMock(...args),
  getDoc: (...args: unknown[]) => getDocMock(...args),
  getDocs: (...args: unknown[]) => getDocsMock(...args),
  Timestamp: {
    now: () => ({ toDate: () => new Date("2026-01-01T00:00:00Z") }),
  },
}));

describe("sharedBudgetService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSharedBudget", () => {
    it("creates a shared budget with the owner as the only member", async () => {
      addDocMock.mockResolvedValue({ id: "budget-1" });

      const id = await createSharedBudget("owner-1", "Owner@Example.com", "Família");

      expect(id).toBe("budget-1");
      expect(addDocMock).toHaveBeenCalledWith(
        { __collection: [mockDb, "sharedBudgets"] },
        expect.objectContaining({
          name: "Família",
          ownerId: "owner-1",
          ownerEmail: "Owner@Example.com",
          memberUids: ["owner-1"],
          memberEmails: ["owner@example.com"],
        })
      );
    });

    it("throws a friendly error when Firestore fails", async () => {
      addDocMock.mockRejectedValue(new Error("network error"));

      await expect(createSharedBudget("owner-1", "a@b.com", "Família")).rejects.toThrow(
        "Erro ao criar orçamento compartilhado no Firebase"
      );
    });
  });

  describe("getSharedBudgetsForUser", () => {
    it("maps and sorts budgets by creation date", async () => {
      const olderDate = { toDate: () => new Date("2025-01-01") };
      const newerDate = { toDate: () => new Date("2026-01-01") };
      getDocsMock.mockResolvedValue({
        docs: [
          {
            id: "budget-2",
            data: () => ({
              name: "Newer",
              ownerId: "owner-1",
              ownerEmail: "owner@example.com",
              memberUids: ["owner-1"],
              memberEmails: ["owner@example.com"],
              createdAt: newerDate,
              updatedAt: newerDate,
            }),
          },
          {
            id: "budget-1",
            data: () => ({
              name: "Older",
              ownerId: "owner-1",
              ownerEmail: "owner@example.com",
              memberUids: ["owner-1"],
              memberEmails: ["owner@example.com"],
              createdAt: olderDate,
              updatedAt: olderDate,
            }),
          },
        ],
      });

      const budgets = await getSharedBudgetsForUser("owner-1");

      expect(whereMock).toHaveBeenCalledWith("memberUids", "array-contains", "owner-1");
      expect(budgets.map((b) => b.name)).toEqual(["Older", "Newer"]);
    });

    it("throws a friendly error when Firestore fails", async () => {
      getDocsMock.mockRejectedValue(new Error("network error"));

      await expect(getSharedBudgetsForUser("owner-1")).rejects.toThrow(
        "Erro ao buscar orçamentos compartilhados do Firebase"
      );
    });
  });

  describe("deleteSharedBudget", () => {
    it("deletes the shared budget document", async () => {
      deleteDocMock.mockResolvedValue(undefined);

      await deleteSharedBudget("budget-1");

      expect(docMock).toHaveBeenCalledWith(mockDb, "sharedBudgets", "budget-1");
      expect(deleteDocMock).toHaveBeenCalled();
    });
  });

  describe("removeSharedBudgetMember", () => {
    it("removes the member's uid and email via arrayRemove", async () => {
      updateDocMock.mockResolvedValue(undefined);

      await removeSharedBudgetMember("budget-1", "user-2", "User2@Example.com");

      expect(arrayRemoveMock).toHaveBeenCalledWith("user-2");
      expect(arrayRemoveMock).toHaveBeenCalledWith("user2@example.com");
    });
  });

  describe("inviteMemberToSharedBudget", () => {
    it("creates a pending invite in the invites subcollection", async () => {
      addDocMock.mockResolvedValue({ id: "invite-1" });

      const id = await inviteMemberToSharedBudget(
        "budget-1",
        "Família",
        "owner-1",
        "owner@example.com",
        "Friend@Example.com"
      );

      expect(id).toBe("invite-1");
      expect(collectionMock).toHaveBeenCalledWith(
        mockDb,
        "sharedBudgets",
        "budget-1",
        "invites"
      );
      expect(addDocMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          sharedBudgetId: "budget-1",
          sharedBudgetName: "Família",
          email: "friend@example.com",
          invitedByUid: "owner-1",
          invitedByEmail: "owner@example.com",
          status: "pending",
        })
      );
    });
  });

  describe("getPendingInvitesForEmail", () => {
    it("queries the invites collection group filtered by email and status", async () => {
      getDocsMock.mockResolvedValue({
        docs: [
          {
            id: "invite-1",
            data: () => ({
              sharedBudgetId: "budget-1",
              sharedBudgetName: "Família",
              email: "friend@example.com",
              invitedByUid: "owner-1",
              invitedByEmail: "owner@example.com",
              status: "pending",
              createdAt: { toDate: () => new Date("2026-01-01") },
            }),
          },
        ],
      });

      const invites = await getPendingInvitesForEmail("Friend@Example.com");

      expect(collectionGroupMock).toHaveBeenCalledWith(mockDb, "invites");
      expect(whereMock).toHaveBeenCalledWith("email", "==", "friend@example.com");
      expect(whereMock).toHaveBeenCalledWith("status", "==", "pending");
      expect(invites).toHaveLength(1);
      expect(invites[0].id).toBe("invite-1");
    });
  });

  describe("acceptSharedBudgetInvite", () => {
    it("adds the user as a member and marks the invite as accepted", async () => {
      updateDocMock.mockResolvedValue(undefined);
      const invite: SharedBudgetInvite = {
        id: "invite-1",
        sharedBudgetId: "budget-1",
        sharedBudgetName: "Família",
        email: "friend@example.com",
        invitedByUid: "owner-1",
        invitedByEmail: "owner@example.com",
        status: "pending",
        createdAt: new Date(),
      };

      await acceptSharedBudgetInvite(invite, "user-2", "Friend@Example.com");

      expect(arrayUnionMock).toHaveBeenCalledWith("user-2");
      expect(arrayUnionMock).toHaveBeenCalledWith("friend@example.com");
      expect(updateDocMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ status: "accepted" })
      );
    });
  });

  describe("declineSharedBudgetInvite", () => {
    it("marks the invite as declined", async () => {
      updateDocMock.mockResolvedValue(undefined);

      await declineSharedBudgetInvite("budget-1", "invite-1");

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "sharedBudgets",
        "budget-1",
        "invites",
        "invite-1"
      );
      expect(updateDocMock).toHaveBeenCalledWith(expect.anything(), {
        status: "declined",
      });
    });
  });

  describe("getSharedBudgetCategoryBudgets", () => {
    it("maps Firestore documents into category budgets", async () => {
      getDocsMock.mockResolvedValue({
        docs: [
          { id: TransactionCategory.FOOD, data: () => ({ monthlyLimit: 400 }) },
        ],
      });

      const budgets = await getSharedBudgetCategoryBudgets("budget-1");

      expect(budgets).toEqual([
        { category: TransactionCategory.FOOD, monthlyLimit: 400 },
      ]);
    });
  });

  describe("setSharedBudgetCategoryBudget", () => {
    it("saves the monthly limit for a category", async () => {
      setDocMock.mockResolvedValue(undefined);

      await setSharedBudgetCategoryBudget("budget-1", TransactionCategory.FOOD, 350);

      expect(docMock).toHaveBeenCalledWith(
        mockDb,
        "sharedBudgets",
        "budget-1",
        "categoryBudgets",
        TransactionCategory.FOOD
      );
      expect(setDocMock).toHaveBeenCalledWith(expect.anything(), { monthlyLimit: 350 });
    });
  });

  describe("getSharedBudgetById", () => {
    it("returns null when the document doesn't exist", async () => {
      getDocMock.mockResolvedValue({ exists: () => false });

      const result = await getSharedBudgetById("budget-1");

      expect(result).toBeNull();
    });

    it("maps the document data when it exists", async () => {
      getDocMock.mockResolvedValue({
        exists: () => true,
        id: "budget-1",
        data: () => ({
          name: "Família",
          ownerId: "owner-1",
          ownerEmail: "owner@example.com",
          memberUids: ["owner-1"],
          memberEmails: ["owner@example.com"],
          createdAt: { toDate: () => new Date("2026-01-01") },
          updatedAt: { toDate: () => new Date("2026-01-01") },
        }),
      });

      const result = await getSharedBudgetById("budget-1");

      expect(result?.name).toBe("Família");
    });
  });
});
