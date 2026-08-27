export enum AccountType {
  CHECKING = "CHECKING",
  CREDIT_CARD = "CREDIT_CARD",
  CASH = "CASH",
  OTHER = "OTHER",
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CHECKING: "Conta corrente",
  CREDIT_CARD: "Cartão de crédito",
  CASH: "Dinheiro",
  OTHER: "Outros",
};

export const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  CHECKING: "bi:bank",
  CREDIT_CARD: "material-symbols:credit-card-outline",
  CASH: "streamline-cyber:bank-note-2",
  OTHER: "flowbite:dots-horizontal-outline",
};

export const ACCOUNT_TYPE_OPTIONS = [
  {
    label: ACCOUNT_TYPE_LABELS["CHECKING"],
    value: "CHECKING" as AccountType,
  },
  {
    label: ACCOUNT_TYPE_LABELS["CREDIT_CARD"],
    value: "CREDIT_CARD" as AccountType,
  },
  {
    label: ACCOUNT_TYPE_LABELS["CASH"],
    value: "CASH" as AccountType,
  },
  {
    label: ACCOUNT_TYPE_LABELS["OTHER"],
    value: "OTHER" as AccountType,
  },
];
