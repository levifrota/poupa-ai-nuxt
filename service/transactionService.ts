import { db } from "~/lib/firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import type { Transaction } from "~/constants/transactions.js";

export interface TransactionInput {
  name: string;
  amount: number;
  type: string;
  category: string;
  paymentMethod: string;
  date: Date;
}

/**
 * Adiciona uma nova transação ao Firestore
 */
export const addTransaction = async (
  userId: string,
  transactionData: TransactionInput
): Promise<string> => {
  try {
    const transactionToSave = {
      ...transactionData,
      date: Timestamp.fromDate(transactionData.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db(), "users", userId, "transactions"),
      transactionToSave
    );

    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
    throw new Error("Erro ao salvar transação no Firebase");
  }
};

/**
 * Atualiza uma transação existente no Firestore
 */
export const updateTransaction = async (
  userId: string,
  transactionId: string,
  transactionData: Partial<TransactionInput>
): Promise<void> => {
  try {
    const updateData: { [key: string]: string | number | Date | Timestamp } = {
      ...transactionData,
      updatedAt: Timestamp.now(),
    };

    // Converter data para Timestamp se fornecida
    if (transactionData.date) {
      updateData.date = Timestamp.fromDate(transactionData.date);
    }

    const transactionRef = doc(
      db(),
      "users",
      userId,
      "transactions",
      transactionId
    );
    
    await updateDoc(transactionRef, updateData);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    throw new Error("Erro ao atualizar transação no Firebase");
  }
};

/**
 * Remove uma transação do Firestore
 */
export const deleteTransaction = async (
  userId: string,
  transactionId: string
): Promise<void> => {
  try {
    const transactionRef = doc(
      db(),
      "users",
      userId,
      "transactions",
      transactionId
    );
    
    await deleteDoc(transactionRef);
  } catch (error) {
    console.error("Erro ao remover transação:", error);
    throw new Error("Erro ao remover transação do Firebase");
  }
};

/**
 * Busca transações do usuário em um intervalo de datas
 */
export const getTransactions = async (
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Transaction[]> => {
  try {
    let transactionsQuery = query(
      collection(db(), "users", userId, "transactions"),
      orderBy("date", "desc")
    );

    // Adicionar filtros de data se fornecidos
    if (startDate && endDate) {
      const endDateAdjusted = new Date(endDate);
      endDateAdjusted.setDate(endDateAdjusted.getDate() + 1); // Incluir o último dia

      transactionsQuery = query(
        collection(db(), "users", userId, "transactions"),
        where("date", ">=", Timestamp.fromDate(startDate)),
        where("date", "<", Timestamp.fromDate(endDateAdjusted)),
        orderBy("date", "desc")
      );
    }

    const querySnapshot = await getDocs(transactionsQuery);

    const transactions: Transaction[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Transaction;
    });

    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw new Error("Erro ao buscar transações do Firebase");
  }
};