export enum CurrencyCode {
  BRL = "BRL",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export const CURRENCY_OPTIONS: { value: CurrencyCode; label: string; symbol: string }[] = [
  { value: CurrencyCode.BRL, label: "Real brasileiro (R$)", symbol: "R$" },
  { value: CurrencyCode.USD, label: "Dólar americano ($)", symbol: "$" },
  { value: CurrencyCode.EUR, label: "Euro (€)", symbol: "€" },
  { value: CurrencyCode.GBP, label: "Libra esterlina (£)", symbol: "£" },
];

export const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  [CurrencyCode.BRL]: "pt-BR",
  [CurrencyCode.USD]: "en-US",
  [CurrencyCode.EUR]: "de-DE",
  [CurrencyCode.GBP]: "en-GB",
};

interface CurrencyUnitLabels {
  major: { singular: string; plural: string };
  minor: { singular: string; plural: string };
}

// Rótulos em português (idioma da interface) para a descrição por extenso
// usada em leitores de tela, independente da moeda selecionada.
export const CURRENCY_UNIT_LABELS: Record<CurrencyCode, CurrencyUnitLabels> = {
  [CurrencyCode.BRL]: {
    major: { singular: "real", plural: "reais" },
    minor: { singular: "centavo", plural: "centavos" },
  },
  [CurrencyCode.USD]: {
    major: { singular: "dólar", plural: "dólares" },
    minor: { singular: "centavo", plural: "centavos" },
  },
  [CurrencyCode.EUR]: {
    major: { singular: "euro", plural: "euros" },
    minor: { singular: "centavo", plural: "centavos" },
  },
  [CurrencyCode.GBP]: {
    major: { singular: "libra", plural: "libras" },
    minor: { singular: "centavo", plural: "centavos" },
  },
};
