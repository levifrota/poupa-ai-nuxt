/**
 * Número de dias, por padrão, para considerar que uma conta a pagar está
 * "próxima do vencimento" e deve aparecer nos lembretes.
 */
export const DEFAULT_DUE_SOON_THRESHOLD_DAYS = 3;

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Calcula quantos dias faltam para o vencimento de uma conta, comparando
 * apenas as datas (ignorando o horário). Retorna um número negativo quando a
 * conta já está vencida.
 */
export const getDaysUntilDue = (
  dueDate: Date,
  referenceDate: Date = new Date()
): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = startOfDay(dueDate).getTime() - startOfDay(referenceDate).getTime();
  return Math.round(diff / msPerDay);
};

/**
 * Verifica se uma conta já está vencida em relação à data de referência.
 */
export const isBillOverdue = (
  dueDate: Date,
  referenceDate: Date = new Date()
): boolean => {
  return getDaysUntilDue(dueDate, referenceDate) < 0;
};

/**
 * Verifica se uma conta vence hoje, já está vencida, ou vence dentro do
 * número de dias informado (por padrão, `DEFAULT_DUE_SOON_THRESHOLD_DAYS`).
 */
export const isBillDueSoon = (
  dueDate: Date,
  referenceDate: Date = new Date(),
  thresholdDays: number = DEFAULT_DUE_SOON_THRESHOLD_DAYS
): boolean => {
  return getDaysUntilDue(dueDate, referenceDate) <= thresholdDays;
};
