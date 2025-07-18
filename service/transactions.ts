import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Transaction } from '@/constants/transactions';

export async function getAllTransactions(): Promise<Transaction[]> {
  const transactionsCollection = collection(db(), 'transactions');
  const q = query(transactionsCollection);
  const querySnapshot = await getDocs(q);

  const transactions = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date && data.date.toDate ? data.date.toDate() : new Date(data.date),
    } as Transaction;
  });

  return transactions;
}
