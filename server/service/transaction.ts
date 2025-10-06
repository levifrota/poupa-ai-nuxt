import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

export interface TransactionInput {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  date: Date;
}

/**
 * Adds a new transaction to Firestore for a given user.
 */
export const addTransaction = async (userId: string, transactionData: TransactionInput): Promise<string> => {
  const transactionToSave = {
    ...transactionData,
    date: Timestamp.fromDate(transactionData.date),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await db.collection('users').doc(userId).collection('transactions').add(transactionToSave);
  return docRef.id;
};

/**
 * Deletes a transaction from Firestore.
 */
export const deleteTransaction = async (userId: string, transactionId: string): Promise<void> => {
  const transactionRef = db.collection('users').doc(userId).collection('transactions').doc(transactionId);
  await transactionRef.delete();
};

/**
 * Finds the most recent transaction for a user by its name.
 */
export const findTransactionByName = async (userId: string, transactionName: string): Promise<{ id: string } | null> => {
  const querySnapshot = await db.collection('users').doc(userId).collection('transactions')
    .where('name', '==', transactionName)
    .orderBy('date', 'desc')
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};