export enum PlanId {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
}

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: PlanId.FREE,
    name: "Gratuito",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Controle de receitas e despesas",
      "Orçamentos por categoria",
      "Metas de economia",
      "Contas a pagar e lembretes",
      "Múltiplas contas/carteiras",
      "Relatórios com IA",
      "Chat com IA sobre suas finanças",
      "Entrada de transações por voz",
    ],
  },
  {
    id: PlanId.PREMIUM,
    name: "Premium",
    priceMonthly: 19.9,
    priceYearly: 199.9,
    highlighted: true,
    features: [
      "Tudo do plano Gratuito",
      "Orçamentos compartilhados em família",
      "Relatórios avançados ilimitados",
      "Suporte prioritário",
    ],
  },
];
