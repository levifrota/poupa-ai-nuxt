import { db } from "~/lib/firebase.js";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import type { TransactionCategory } from "~/constants/transactions.js";

export interface CategoryBudget {
  category: TransactionCategory;
  monthlyLimit: number;
}

/**
 * Busca os orçamentos mensais por categoria do usuário
 */
export const getBudgets = async (userId: string): Promise<CategoryBudget[]> => {
  try {
    const snapshot = await getDocs(collection(db(), "users", userId, "budgets"));

    return snapshot.docs.map((docSnapshot) => ({
      category: docSnapshot.id as TransactionCategory,
      monthlyLimit: docSnapshot.data().monthlyLimit as number,
    }));
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error);
    throw new Error("Erro ao buscar orçamentos do Firebase");
  }
};

/**
 * Cria ou atualiza o orçamento mensal de uma categoria
 */
export const setBudget = async (
  userId: string,
  category: TransactionCategory,
  monthlyLimit: number
): Promise<void> => {
  try {
    await setDoc(doc(db(), "users", userId, "budgets", category), { monthlyLimit });
  } catch (error) {
    console.error("Erro ao salvar orçamento:", error);
    throw new Error("Erro ao salvar orçamento no Firebase");
  }
};

/**
 * Remove o orçamento mensal de uma categoria
 */
export const deleteBudget = async (
  userId: string,
  category: TransactionCategory
): Promise<void> => {
  try {
    await deleteDoc(doc(db(), "users", userId, "budgets", category));
  } catch (error) {
    console.error("Erro ao remover orçamento:", error);
    throw new Error("Erro ao remover orçamento do Firebase");
  }
};
