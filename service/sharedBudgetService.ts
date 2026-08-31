import { db } from "~/lib/firebase.js";
import {
  collection,
  collectionGroup,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import type { TransactionCategory } from "~/constants/transactions.js";

/**
 * Requer as seguintes regras de segurança no Firestore (não versionadas neste
 * repositório):
 *
 * match /sharedBudgets/{sharedBudgetId} {
 *   allow read: if request.auth.uid in resource.data.memberUids;
 *   allow create: if request.auth.uid == request.resource.data.ownerId;
 *   allow update, delete: if request.auth.uid == resource.data.ownerId;
 *
 *   match /categoryBudgets/{category} {
 *     allow read, write: if request.auth.uid in
 *       get(/databases/$(database)/documents/sharedBudgets/$(sharedBudgetId)).data.memberUids;
 *   }
 *
 *   match /invites/{inviteId} {
 *     allow create: if request.auth.uid ==
 *       get(/databases/$(database)/documents/sharedBudgets/$(sharedBudgetId)).data.ownerId;
 *     allow read, update: if request.auth.token.email == resource.data.email;
 *   }
 * }
 */

export type SharedBudgetInviteStatus = "pending" | "accepted" | "declined";

export interface SharedBudget {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail: string;
  memberUids: string[];
  memberEmails: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SharedBudgetInvite {
  id: string;
  sharedBudgetId: string;
  sharedBudgetName: string;
  email: string;
  invitedByUid: string;
  invitedByEmail: string;
  status: SharedBudgetInviteStatus;
  createdAt: Date;
}

export interface SharedBudgetCategoryBudget {
  category: TransactionCategory;
  monthlyLimit: number;
}

/**
 * Cria um novo orçamento compartilhado, com o criador como único membro inicial
 */
export const createSharedBudget = async (
  ownerId: string,
  ownerEmail: string,
  name: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db(), "sharedBudgets"), {
      name,
      ownerId,
      ownerEmail,
      memberUids: [ownerId],
      memberEmails: [ownerEmail.toLowerCase()],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar orçamento compartilhado:", error);
    throw new Error("Erro ao criar orçamento compartilhado no Firebase");
  }
};

/**
 * Busca os orçamentos compartilhados dos quais o usuário faz parte
 */
export const getSharedBudgetsForUser = async (
  userId: string
): Promise<SharedBudget[]> => {
  try {
    const sharedBudgetsQuery = query(
      collection(db(), "sharedBudgets"),
      where("memberUids", "array-contains", userId)
    );
    const snapshot = await getDocs(sharedBudgetsQuery);

    const budgets = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        name: data.name,
        ownerId: data.ownerId,
        ownerEmail: data.ownerEmail,
        memberUids: data.memberUids ?? [],
        memberEmails: data.memberEmails ?? [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as SharedBudget;
    });

    return budgets.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch (error) {
    console.error("Erro ao buscar orçamentos compartilhados:", error);
    throw new Error("Erro ao buscar orçamentos compartilhados do Firebase");
  }
};

/**
 * Remove um orçamento compartilhado (apenas o dono deve chamar esta função)
 */
export const deleteSharedBudget = async (sharedBudgetId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db(), "sharedBudgets", sharedBudgetId));
  } catch (error) {
    console.error("Erro ao remover orçamento compartilhado:", error);
    throw new Error("Erro ao remover orçamento compartilhado no Firebase");
  }
};

/**
 * Remove um membro (ou o próprio usuário, para sair do orçamento compartilhado)
 */
export const removeSharedBudgetMember = async (
  sharedBudgetId: string,
  memberUid: string,
  memberEmail: string
): Promise<void> => {
  try {
    await updateDoc(doc(db(), "sharedBudgets", sharedBudgetId), {
      memberUids: arrayRemove(memberUid),
      memberEmails: arrayRemove(memberEmail.toLowerCase()),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erro ao remover membro do orçamento compartilhado:", error);
    throw new Error("Erro ao remover membro do orçamento compartilhado no Firebase");
  }
};

/**
 * Convida um usuário (por e-mail) para um orçamento compartilhado
 */
export const inviteMemberToSharedBudget = async (
  sharedBudgetId: string,
  sharedBudgetName: string,
  invitedByUid: string,
  invitedByEmail: string,
  inviteeEmail: string
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db(), "sharedBudgets", sharedBudgetId, "invites"),
      {
        sharedBudgetId,
        sharedBudgetName,
        email: inviteeEmail.toLowerCase(),
        invitedByUid,
        invitedByEmail,
        status: "pending" as SharedBudgetInviteStatus,
        createdAt: Timestamp.now(),
      }
    );

    return docRef.id;
  } catch (error) {
    console.error("Erro ao convidar membro:", error);
    throw new Error("Erro ao enviar convite no Firebase");
  }
};

/**
 * Busca os convites pendentes endereçados a um e-mail (usa collectionGroup,
 * pois os convites ficam em subcoleções de cada orçamento compartilhado)
 */
export const getPendingInvitesForEmail = async (
  email: string
): Promise<SharedBudgetInvite[]> => {
  try {
    const invitesQuery = query(
      collectionGroup(db(), "invites"),
      where("email", "==", email.toLowerCase()),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(invitesQuery);

    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        sharedBudgetId: data.sharedBudgetId,
        sharedBudgetName: data.sharedBudgetName,
        email: data.email,
        invitedByUid: data.invitedByUid,
        invitedByEmail: data.invitedByEmail,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as SharedBudgetInvite;
    });
  } catch (error) {
    console.error("Erro ao buscar convites pendentes:", error);
    throw new Error("Erro ao buscar convites pendentes do Firebase");
  }
};

/**
 * Aceita um convite: adiciona o usuário como membro e marca o convite como aceito
 */
export const acceptSharedBudgetInvite = async (
  invite: SharedBudgetInvite,
  userId: string,
  userEmail: string
): Promise<void> => {
  try {
    await updateDoc(doc(db(), "sharedBudgets", invite.sharedBudgetId), {
      memberUids: arrayUnion(userId),
      memberEmails: arrayUnion(userEmail.toLowerCase()),
      updatedAt: Timestamp.now(),
    });

    await updateDoc(
      doc(db(), "sharedBudgets", invite.sharedBudgetId, "invites", invite.id),
      { status: "accepted" as SharedBudgetInviteStatus }
    );
  } catch (error) {
    console.error("Erro ao aceitar convite:", error);
    throw new Error("Erro ao aceitar convite no Firebase");
  }
};

/**
 * Recusa um convite pendente
 */
export const declineSharedBudgetInvite = async (
  sharedBudgetId: string,
  inviteId: string
): Promise<void> => {
  try {
    await updateDoc(doc(db(), "sharedBudgets", sharedBudgetId, "invites", inviteId), {
      status: "declined" as SharedBudgetInviteStatus,
    });
  } catch (error) {
    console.error("Erro ao recusar convite:", error);
    throw new Error("Erro ao recusar convite no Firebase");
  }
};

/**
 * Busca os orçamentos mensais por categoria de um orçamento compartilhado
 */
export const getSharedBudgetCategoryBudgets = async (
  sharedBudgetId: string
): Promise<SharedBudgetCategoryBudget[]> => {
  try {
    const snapshot = await getDocs(
      collection(db(), "sharedBudgets", sharedBudgetId, "categoryBudgets")
    );

    return snapshot.docs.map((docSnapshot) => ({
      category: docSnapshot.id as TransactionCategory,
      monthlyLimit: docSnapshot.data().monthlyLimit as number,
    }));
  } catch (error) {
    console.error("Erro ao buscar orçamentos da categoria compartilhada:", error);
    throw new Error("Erro ao buscar orçamentos compartilhados do Firebase");
  }
};

/**
 * Cria ou atualiza o orçamento mensal de uma categoria em um orçamento compartilhado
 */
export const setSharedBudgetCategoryBudget = async (
  sharedBudgetId: string,
  category: TransactionCategory,
  monthlyLimit: number
): Promise<void> => {
  try {
    await setDoc(
      doc(db(), "sharedBudgets", sharedBudgetId, "categoryBudgets", category),
      { monthlyLimit }
    );
  } catch (error) {
    console.error("Erro ao salvar orçamento da categoria compartilhada:", error);
    throw new Error("Erro ao salvar orçamento compartilhado no Firebase");
  }
};

/**
 * Busca um único orçamento compartilhado pelo id (usado após aceitar um convite)
 */
export const getSharedBudgetById = async (
  sharedBudgetId: string
): Promise<SharedBudget | null> => {
  try {
    const snapshot = await getDoc(doc(db(), "sharedBudgets", sharedBudgetId));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      ownerId: data.ownerId,
      ownerEmail: data.ownerEmail,
      memberUids: data.memberUids ?? [],
      memberEmails: data.memberEmails ?? [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as SharedBudget;
  } catch (error) {
    console.error("Erro ao buscar orçamento compartilhado:", error);
    throw new Error("Erro ao buscar orçamento compartilhado do Firebase");
  }
};
