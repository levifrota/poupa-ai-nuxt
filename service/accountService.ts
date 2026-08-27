import { db } from "~/lib/firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import type { Account, AccountType } from "~/constants/accounts.js";

export interface AccountInput {
  name: string;
  type: AccountType;
}

/**
 * Busca as contas (carteiras) do usuário, ordenadas pelo nome
 */
export const getAccounts = async (userId: string): Promise<Account[]> => {
  try {
    const accountsQuery = query(
      collection(db(), "users", userId, "accounts"),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(accountsQuery);

    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Account;
    });
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    throw new Error("Erro ao buscar contas do Firebase");
  }
};

/**
 * Cria uma nova conta (carteira)
 */
export const addAccount = async (
  userId: string,
  accountData: AccountInput
): Promise<string> => {
  try {
    const accountToSave = {
      ...accountData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db(), "users", userId, "accounts"),
      accountToSave
    );

    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar conta:", error);
    throw new Error("Erro ao salvar conta no Firebase");
  }
};

/**
 * Atualiza uma conta existente
 */
export const updateAccount = async (
  userId: string,
  accountId: string,
  accountData: Partial<AccountInput>
): Promise<void> => {
  try {
    const updateData = {
      ...accountData,
      updatedAt: Timestamp.now(),
    };

    const accountRef = doc(db(), "users", userId, "accounts", accountId);
    await updateDoc(accountRef, updateData);
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
    throw new Error("Erro ao atualizar conta no Firebase");
  }
};

/**
 * Remove uma conta
 */
export const deleteAccount = async (
  userId: string,
  accountId: string
): Promise<void> => {
  try {
    const accountRef = doc(db(), "users", userId, "accounts", accountId);
    await deleteDoc(accountRef);
  } catch (error) {
    console.error("Erro ao remover conta:", error);
    throw new Error("Erro ao remover conta do Firebase");
  }
};
