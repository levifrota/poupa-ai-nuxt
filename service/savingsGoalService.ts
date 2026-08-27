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

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingsGoalInput {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: Date;
}

/**
 * Busca as metas de economia do usuário, ordenadas pelo prazo mais próximo
 */
export const getSavingsGoals = async (userId: string): Promise<SavingsGoal[]> => {
  try {
    const goalsQuery = query(
      collection(db(), "users", userId, "savingsGoals"),
      orderBy("deadline", "asc")
    );
    const snapshot = await getDocs(goalsQuery);

    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        ...data,
        deadline: data.deadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as SavingsGoal;
    });
  } catch (error) {
    console.error("Erro ao buscar metas de economia:", error);
    throw new Error("Erro ao buscar metas de economia do Firebase");
  }
};

/**
 * Cria uma nova meta de economia
 */
export const addSavingsGoal = async (
  userId: string,
  goalData: SavingsGoalInput
): Promise<string> => {
  try {
    const goalToSave = {
      name: goalData.name,
      targetAmount: goalData.targetAmount,
      currentAmount: goalData.currentAmount ?? 0,
      deadline: Timestamp.fromDate(goalData.deadline),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db(), "users", userId, "savingsGoals"),
      goalToSave
    );

    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar meta de economia:", error);
    throw new Error("Erro ao salvar meta de economia no Firebase");
  }
};

/**
 * Atualiza uma meta de economia existente (dados ou progresso)
 */
export const updateSavingsGoal = async (
  userId: string,
  goalId: string,
  goalData: Partial<SavingsGoalInput>
): Promise<void> => {
  try {
    const updateData: Record<string, unknown> = {
      ...goalData,
      updatedAt: Timestamp.now(),
    };

    if (goalData.deadline) {
      updateData.deadline = Timestamp.fromDate(goalData.deadline);
    }

    const goalRef = doc(db(), "users", userId, "savingsGoals", goalId);
    await updateDoc(goalRef, updateData);
  } catch (error) {
    console.error("Erro ao atualizar meta de economia:", error);
    throw new Error("Erro ao atualizar meta de economia no Firebase");
  }
};

/**
 * Remove uma meta de economia
 */
export const deleteSavingsGoal = async (
  userId: string,
  goalId: string
): Promise<void> => {
  try {
    const goalRef = doc(db(), "users", userId, "savingsGoals", goalId);
    await deleteDoc(goalRef);
  } catch (error) {
    console.error("Erro ao remover meta de economia:", error);
    throw new Error("Erro ao remover meta de economia do Firebase");
  }
};
