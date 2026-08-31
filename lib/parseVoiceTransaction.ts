import { TransactionCategory, TransactionType } from "~/constants/transactions";

export interface ParsedVoiceTransaction {
  name?: string;
  amount?: number;
  type?: TransactionType;
  category?: TransactionCategory;
}

const EXPENSE_KEYWORDS = ["gastei", "paguei", "comprei", "gasto"];
const DEPOSIT_KEYWORDS = ["recebi", "ganhei", "depositei", "entrou"];
const INVESTMENT_KEYWORDS = ["investi", "apliquei", "aplicação"];

export const CATEGORY_KEYWORDS: Record<TransactionCategory, string[]> = {
  [TransactionCategory.FOOD]: [
    "mercado",
    "supermercado",
    "comida",
    "restaurante",
    "almoço",
    "jantar",
    "lanche",
    "padaria",
  ],
  [TransactionCategory.HOUSING]: ["aluguel", "condomínio", "condominio", "moradia"],
  [TransactionCategory.TRANSPORTATION]: [
    "uber",
    "gasolina",
    "transporte",
    "ônibus",
    "onibus",
    "combustível",
    "combustivel",
    "táxi",
    "taxi",
  ],
  [TransactionCategory.ENTERTAINMENT]: ["cinema", "lazer", "show", "jogo", "netflix", "streaming"],
  [TransactionCategory.HEALTH]: ["remédio", "remedio", "farmácia", "farmacia", "médico", "medico", "saúde", "saude", "consulta"],
  [TransactionCategory.EDUCATION]: ["curso", "escola", "faculdade", "livro", "educação", "educacao"],
  [TransactionCategory.UTILITY]: ["luz", "água", "agua", "internet", "telefone", "energia"],
  [TransactionCategory.SALARY]: ["salário", "salario"],
  [TransactionCategory.OTHER]: [],
};

function detectType(normalized: string): TransactionType | undefined {
  if (EXPENSE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return TransactionType.EXPENSE;
  }
  if (DEPOSIT_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return TransactionType.DEPOSIT;
  }
  if (INVESTMENT_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return TransactionType.INVESTMENT;
  }
  return undefined;
}

export function detectCategory(normalized: string): TransactionCategory | undefined {
  const entries = Object.entries(CATEGORY_KEYWORDS) as [TransactionCategory, string[]][];
  for (const [category, keywords] of entries) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }
  return undefined;
}

export function detectAmount(normalized: string): number | undefined {
  const match = normalized.match(/(\d+(?:[.,]\d{1,2})?)/);
  if (!match) {
    return undefined;
  }
  const value = parseFloat(match[1].replace(",", "."));
  return Number.isNaN(value) ? undefined : value;
}

function detectName(normalized: string): string | undefined {
  const match = normalized.match(/\bem\s+([a-zà-úA-ZÀ-Ú\s]+)$/);
  if (!match) {
    return undefined;
  }
  const captured = match[1].trim();
  if (!captured) {
    return undefined;
  }
  return captured.charAt(0).toUpperCase() + captured.slice(1);
}

/**
 * Interpreta uma frase transcrita por voz (ex: "gastei 50 reais em mercado")
 * e extrai os campos possíveis de uma transação. Campos não identificados
 * ficam undefined e devem ser preenchidos manualmente pelo usuário.
 */
export function parseVoiceTransaction(transcript: string): ParsedVoiceTransaction {
  const normalized = transcript.trim().toLowerCase();

  return {
    type: detectType(normalized),
    category: detectCategory(normalized),
    amount: detectAmount(normalized),
    name: detectName(normalized),
  };
}
