import { TransactionType, type Transaction } from "~/constants/transactions.js";
import type { Account } from "~/constants/accounts.js";

export interface AccountBalance {
  accountId: string;
  name: string;
  type: Account["type"];
  balance: number;
}

/**
 * Calcula o valor de uma transação já com o sinal correto para o saldo:
 * depósitos aumentam o saldo, despesas e investimentos o reduzem — mesma
 * convenção usada em `stores/transactions.ts`.
 */
const signedAmount = (transaction: Transaction): number => {
  return transaction.type === TransactionType.DEPOSIT
    ? transaction.amount
    : -transaction.amount;
};

/**
 * Calcula o saldo de cada conta, somando apenas as transações associadas a
 * ela (via `accountId`). Contas sem nenhuma transação aparecem com saldo 0.
 */
export const calculateAccountBalances = (
  transactions: Transaction[],
  accounts: Account[]
): AccountBalance[] => {
  return accounts.map((account) => {
    const balance = transactions
      .filter((transaction) => transaction.accountId === account.id)
      .reduce((total, transaction) => total + signedAmount(transaction), 0);

    return {
      accountId: account.id,
      name: account.name,
      type: account.type,
      balance,
    };
  });
};

/**
 * Soma o saldo de todas as transações que não estão associadas a nenhuma
 * conta específica.
 */
export const calculateUnassignedBalance = (transactions: Transaction[]): number => {
  return transactions
    .filter((transaction) => !transaction.accountId)
    .reduce((total, transaction) => total + signedAmount(transaction), 0);
};
