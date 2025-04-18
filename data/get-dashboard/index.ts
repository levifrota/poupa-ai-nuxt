import { db } from '@/lib/firebase';
// import {} from "firebase/auth";
import { Timestamp } from 'firebase-admin/firestore';
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from '@/constants/transactions';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Transaction {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: Date;
  paymentMethod: TransactionPaymentMethod;
  [key: string]: string | number | Date | undefined;
}

export const getDashboard = async (month: string) => {
  // const userId = await auth.currentUser?.uid;
  const userId = "BNiGb55yRRdoSOGsCVS7B6WRu032";

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const year = 2025;
  const m = parseInt(month);
  const nextMonth = m === 12 ? 1 : m + 1;
  const nextYear = m === 12 ? year + 1 : year;

  const startDate = Timestamp.fromDate(new Date(year, m - 1, 1));
  const endDate = Timestamp.fromDate(new Date(nextYear, nextMonth - 1, 1));

  const transactionsQuery = query(
    collection(db, 'users', userId, 'transactions'),
    where('date', '>=', startDate),
    where('date', '<', endDate)
  );
  const querySnapshot = await getDocs(transactionsQuery);



  const transactions: Transaction[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    console.log('doc', doc);

    return ({
      id: doc.id,
      name: data.name,
      type: data.type,
      amount: Number(data.amount),
      category: data.category,
      paymentMethod: data.paymentMethod,
      date: data.date,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userId: data.userId,
    });
  });

  const depositsTotal = transactions
    .filter((t) => t.type === 'DEPOSIT')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const investmentsTotal = transactions
    .filter((t) => t.type === 'INVESTMENT')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const expensesTotal = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const balance = depositsTotal - investmentsTotal - expensesTotal;
  const transactionsTotal = transactions.reduce(
    (acc, t) => acc + Number(t.amount || 0),
    0
  );

  const calcPercentage = (part: number, total: number) =>
    !total ? 0 : Math.round((part / total) * 100);

  const typesPercentage = {
    DEPOSIT: calcPercentage(depositsTotal, transactionsTotal),
    EXPENSE: calcPercentage(expensesTotal, transactionsTotal),
    INVESTMENT: calcPercentage(investmentsTotal, transactionsTotal),
  };

  const expenseTransactions = transactions.filter((t) => t.type === 'EXPENSE');
  const categoryMap = new Map<string, number>();
  expenseTransactions.forEach((t) => {
    const category = t.category || 'UNKNOWN';
    categoryMap.set(
      category,
      (categoryMap.get(category) || 0) + Number(t.amount || 0)
    );
  });
  const totalExpensePerCategory = Array.from(categoryMap.entries()).map(
    ([category, totalAmount]) => ({
      category,
      totalAmount,
      percentageOfTotal: calcPercentage(totalAmount, expensesTotal),
    })
  );

  const lastTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return {
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    balance,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions,
  };
};
