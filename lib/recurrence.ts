import { RecurrenceFrequency } from "~/constants/transactions.js";

/**
 * Calcula a próxima data de ocorrência de uma transação recorrente,
 * a partir de uma data base e da frequência escolhida.
 */
export const calculateNextOccurrenceDate = (
  fromDate: Date,
  frequency: RecurrenceFrequency
): Date => {
  const nextDate = new Date(fromDate);

  switch (frequency) {
    case RecurrenceFrequency.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case RecurrenceFrequency.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case RecurrenceFrequency.YEARLY:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
};

/**
 * Verifica se uma ocorrência recorrente já está vencida (pronta para ser
 * confirmada ou pulada pelo usuário), comparando com a data de referência
 * (por padrão, agora).
 */
export const isOccurrenceDue = (
  nextOccurrenceDate: Date,
  referenceDate: Date = new Date()
): boolean => {
  return nextOccurrenceDate.getTime() <= referenceDate.getTime();
};
