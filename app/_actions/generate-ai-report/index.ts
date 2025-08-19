import type { GenerateAiReportSchema} from "./schema";
import { generateAiReportSchema } from "./schema";
import { generateText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { getDashboard } from '@/data/get-dashboard';

const generateAiReport = async ({ month }: GenerateAiReportSchema) => {
  const groq = createGroq({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  generateAiReportSchema.parse({ month });

  // const { userId } = await auth();

  // if (!userId) {
  //   throw new Error("Unauthorized");
  // }

  // const user = await clerkClient().users.getUser(userId);

  // const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  // if (!hasPremiumPlan) {
  //   throw new Error(
  //     "Você precisa de um plano premium para gerar relatórios de IA.",
  //   );
  // }

  const { totalTransactions: transactions } = await getDashboard(month);


  const content = `Estou gerenciando meu orçamento e quero que você gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{VALOR}-{TIPO}-{CATEGORIA}. Traduza a categoria para português brasileiro. São elas:
  ${transactions
    .map(
      (transaction) =>
        `${new Date(transaction.date).toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.type}-${transaction.category}`,
    )
    .join(";")}. Se você não tiver dados suficiente, apenas escreva "Não tenho dados suficientes para gerar um relatório. Por favor, forneça mais informações."`;

  try {
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.",
        },
        {
          role: "user",
          content,
        },
      ],
    });

    return text;
  } catch (error) {
    console.error("Erro ao chamar a OpenAI:", error);
    throw new Error("A requisição demorou muito tempo ou falhou.");
  }
};

export default generateAiReport;