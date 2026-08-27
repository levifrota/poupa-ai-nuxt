export enum TransactionType {
  EXPENSE = "EXPENSE",
  DEPOSIT = "DEPOSIT",
  INVESTMENT = "INVESTMENT",
}

export enum TransactionCategory {
  FOOD = "FOOD",
  HOUSING = "HOUSING",
  TRANSPORTATION = "TRANSPORTATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  HEALTH = "HEALTH",
  EDUCATION = "EDUCATION",
  OTHER = "OTHER",
  SALARY = "SALARY",
  UTILITY = "UTILITY",
}

export enum TransactionPaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PIX = "PIX",
  BANK_TRANSFER = "BANK_TRANSFER",
  FOOD_TICKET = "FOOD_TICKET",
  MEAL_TICKET = "MEAL_TICKET",
  BANK_SLIP = "BANK_SLIP",
  OTHER = "OTHER",
}

export enum RecurrenceFrequency {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isRecurring?: boolean;
  recurrenceFrequency?: RecurrenceFrequency;
  nextOccurrenceDate?: Date;
  isBill?: boolean;
  dueDate?: Date;
  isPaid?: boolean;
}

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> =
  {
    EDUCATION: "Educação",
    FOOD: "Alimentação",
    HOUSING: "Moradia",
    TRANSPORTATION: "Transporte",
    UTILITY: "Utilidades",
    HEALTH: "Saúde",
    ENTERTAINMENT: "Entretenimento",
    OTHER: "Outros",
    SALARY: "Salário",
  };

export const TRANSACTION_PAYMENT_METHOD_ICONS: Record<
  TransactionPaymentMethod,
  string
> = {
  CREDIT_CARD: "material-symbols:credit-card-outline",
  DEBIT_CARD: "mdi:credit-card",
  BANK_TRANSFER: "bi:bank",
  BANK_SLIP: "lsicon:bar-code-filled",
  CASH: "streamline-cyber:bank-note-2",
  PIX: "ic:baseline-pix",
  FOOD_TICKET: "map:grocery-or-supermarket",
  MEAL_TICKET: "fluent:food-24-regular",
  OTHER: "flowbite:dots-horizontal-outline",
};

export const RECURRENCE_FREQUENCY_LABELS: Record<RecurrenceFrequency, string> = {
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  YEARLY: "Anual",
};

export const RECURRENCE_FREQUENCY_OPTIONS = [
  {
    label: RECURRENCE_FREQUENCY_LABELS["WEEKLY"],
    value: "WEEKLY" as RecurrenceFrequency,
  },
  {
    label: RECURRENCE_FREQUENCY_LABELS["MONTHLY"],
    value: "MONTHLY" as RecurrenceFrequency,
  },
  {
    label: RECURRENCE_FREQUENCY_LABELS["YEARLY"],
    value: "YEARLY" as RecurrenceFrequency,
  },
];

export const TRANSACTION_PAYMENT_METHOD_LABELS: Record<
  TransactionPaymentMethod,
  string
> = {
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  CASH: "Dinheiro",
  PIX: "PIX",
  BANK_TRANSFER: "Transferência bancária",
  OTHER: "Outros",
  BANK_SLIP: "Boleto bancário",
  FOOD_TICKET: "Vale alimentação",
  MEAL_TICKET: "Vale refeição",
};

export const TRANSACTION_TYPE_OPTIONS = [
  {
    label: "Despesa",
    value: "EXPENSE" as TransactionType,
  },
  {
    label: "Depósito",
    value: "DEPOSIT" as TransactionType,
  },
  {
    label: "Investimento",
    value: "INVESTMENT" as TransactionType,
  },
];

export const TRANSACTION_PAYMENT_METHOD_OPTIONS = [
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["CASH"],
    value: "CASH" as TransactionPaymentMethod,
  },
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["CREDIT_CARD"],
    value: "CREDIT_CARD" as TransactionPaymentMethod,
  },
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["DEBIT_CARD"],
    value: "DEBIT_CARD" as TransactionPaymentMethod,
  },
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["BANK_TRANSFER"],
    value: "BANK_TRANSFER" as TransactionPaymentMethod,
  },
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["FOOD_TICKET"],
    value: "FOOD_TICKET" as TransactionPaymentMethod,
  },
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["MEAL_TICKET"],
    value: "MEAL_TICKET" as TransactionPaymentMethod,
  },
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["BANK_SLIP"],
    value: "BANK_SLIP" as TransactionPaymentMethod,
  },
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["PIX"],
    value: "PIX" as TransactionPaymentMethod,
  },
  {
    label: TRANSACTION_PAYMENT_METHOD_LABELS["OTHER"],
    value: "OTHER" as TransactionPaymentMethod,
  },
];

export const TRANSACTION_CATEGORY_OPTIONS = [
  {
    label: TRANSACTION_CATEGORY_LABELS["EDUCATION"],
    value: "EDUCATION" as TransactionCategory,
  },
  {
    label: TRANSACTION_CATEGORY_LABELS["ENTERTAINMENT"],
    value: "ENTERTAINMENT" as TransactionCategory,
  },
  {
    label: TRANSACTION_CATEGORY_LABELS["FOOD"],
    value: "FOOD" as TransactionCategory,
  },
  {
    label: TRANSACTION_CATEGORY_LABELS["HEALTH"],
    value: "HEALTH" as TransactionCategory,
  },
  {
    label: TRANSACTION_CATEGORY_LABELS["HOUSING"],
    value: "HOUSING" as TransactionCategory,
  },
  {
    label: TRANSACTION_CATEGORY_LABELS["TRANSPORTATION"],
    value: "TRANSPORTATION" as TransactionCategory,
  },
  {
    label: TRANSACTION_CATEGORY_LABELS["SALARY"],
    value: "SALARY" as TransactionCategory,
  },
  {
    label: TRANSACTION_CATEGORY_LABELS["UTILITY"],
    value: "UTILITY" as TransactionCategory,
  },
  {
    label: TRANSACTION_CATEGORY_LABELS["OTHER"],
    value: "OTHER" as TransactionCategory,
  },
];
