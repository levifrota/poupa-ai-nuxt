import { getDaysUntilDue } from "./billReminders";

export type BudgetAlertLevel = "ok" | "warning" | "exceeded";

/**
 * Percentual de uso do orçamento a partir do qual o usuário deve ser
 * avisado de que está perto de estourar o limite da categoria.
 */
export const BUDGET_WARNING_THRESHOLD_PERCENT = 80;

/**
 * Compara o valor gasto em uma categoria com o limite mensal definido para
 * ela e retorna o nível de alerta correspondente:
 * - "exceeded": o gasto já atingiu ou ultrapassou o limite.
 * - "warning": o gasto está próximo do limite (>= `BUDGET_WARNING_THRESHOLD_PERCENT`%).
 * - "ok": o gasto ainda está confortavelmente dentro do limite (ou não há limite definido).
 */
export function getBudgetAlertLevel(spent: number, limit: number): BudgetAlertLevel {
  if (limit <= 0) {
    return "ok";
  }

  const percentage = (spent / limit) * 100;
  if (percentage >= 100) {
    return "exceeded";
  }
  if (percentage >= BUDGET_WARNING_THRESHOLD_PERCENT) {
    return "warning";
  }
  return "ok";
}

/**
 * Número de dias, por padrão, para considerar que o prazo de uma meta de
 * economia está "se aproximando" e o usuário deve ser avisado.
 */
export const SAVINGS_GOAL_DEADLINE_WARNING_DAYS = 7;

/**
 * Verifica se o prazo de uma meta de economia ainda não concluída está se
 * aproximando (vence hoje ou dentro de `thresholdDays` dias). Metas já
 * concluídas ou com prazo vencido (tratado separadamente como "overdue")
 * retornam `false`.
 */
export function isSavingsGoalNearingDeadline(
  deadline: Date,
  isCompleted: boolean,
  referenceDate: Date = new Date(),
  thresholdDays: number = SAVINGS_GOAL_DEADLINE_WARNING_DAYS
): boolean {
  if (isCompleted) {
    return false;
  }
  const daysUntilDue = getDaysUntilDue(deadline, referenceDate);
  return daysUntilDue >= 0 && daysUntilDue <= thresholdDays;
}
