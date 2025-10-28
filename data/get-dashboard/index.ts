import { db } from "@/lib/firebase.js";
import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@/constants/transactions.js";
import { useCurrentUser } from "vuefire";

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
  userId?: string;
  [key: string]: string | number | Date | undefined;
}

export const getDashboard = async () => {
  const user = useCurrentUser();

  const userId = user.value?.uid;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const transactionsQuery = query(
      collection(db(), "users", userId, "transactions"),
    );

    const querySnapshot = await getDocs(transactionsQuery);

    const transactions: Transaction[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        amount: Number(data.amount),
        category: data.category,
        paymentMethod: data.paymentMethod,
        date: data.date?.toDate?.() || new Date(),
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        userId: data.userId,
      };
    });

    const depositsTotal = transactions
      .filter(t => t.type === "DEPOSIT")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const investmentsTotal = transactions
      .filter(t => t.type === "INVESTMENT")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const expensesTotal = transactions
      .filter(t => t.type === "EXPENSE")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const balance = depositsTotal - investmentsTotal - expensesTotal;

    const transactionsTotal = transactions.reduce(
      (acc, t) => acc + Number(t.amount || 0),
      0,
    );

    const calcPercentage = (part: number, total: number) =>
      !total ? 0 : Math.round((part / total) * 100);

    const typesPercentage = {
      DEPOSIT: calcPercentage(depositsTotal, transactionsTotal),
      EXPENSE: calcPercentage(expensesTotal, transactionsTotal),
      INVESTMENT: calcPercentage(investmentsTotal, transactionsTotal),
    };

    const expenseTransactions = transactions.filter(
      t => t.type === "EXPENSE",
    );

    const categoryMap = new Map<string, number>();

    expenseTransactions.forEach((t) => {
      const category = t.category || "UNKNOWN";
      categoryMap.set(
        category,
        (categoryMap.get(category) || 0) + Number(t.amount || 0),
      );
    });

    const totalExpensePerCategory = Array.from(categoryMap.entries()).map(
      ([category, totalAmount]) => ({
        category,
        totalAmount,
        percentageOfTotal: calcPercentage(totalAmount, expensesTotal),
      }),
    );

    const lastTransactions = transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    const totalTransactions = transactions;

    return {
      depositsTotal,
      investmentsTotal,
      expensesTotal,
      balance,
      typesPercentage,
      totalExpensePerCategory,
      lastTransactions,
      totalTransactions,
    };
  }
  catch (error) {
    console.error("Erro ao buscar transações:", error);
    throw new Error("Erro ao buscar transações");
  }
};
