import type { GenerateAiReportSchema } from "./schema.js";
import { generateAiReportSchema } from "./schema.js";
import { generateText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { useCurrentUser } from "vuefire";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase.js";
import type { Transaction,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_TYPE_OPTIONS,
  type TransactionCategory,
} from "../../../constants/transactions.js";

const generateAiReport = async ({ startDate, endDate }: GenerateAiReportSchema) => {
  const groq = createGroq({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  const validatedData = generateAiReportSchema.parse({ startDate, endDate });

  if (!validatedData.startDate || !validatedData.endDate) {
    throw new Error("Datas de início e fim são obrigatórias");
  }

  const user = useCurrentUser();

  if (!user.value?.uid) {
    throw new Error("Usuário não autenticado");
  }

  const userId = user.value.uid;

  const start = new Date(validatedData.startDate);
  const end = new Date(validatedData.endDate);

  const endDateInclusive = new Date(end);
  endDateInclusive.setDate(endDateInclusive.getDate() + 1);

  try {
    const transactionsQuery = query(
      collection(db(), "users", userId, "transactions"),
      where("date", ">=", start),
      where("date", "<", endDateInclusive),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(transactionsQuery);

    const transactions = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
      } as Transaction;
    });

    const content: string = `Estou gerenciando meu orçamento e quero que você gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. O período analisado é de ${start.toLocaleDateString("pt-BR")} a ${end.toLocaleDateString("pt-BR")}. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{VALOR}-{TIPO}-{CATEGORIA}. São elas:
    ${transactions
      .map(
        (transaction: Transaction) =>
          `${new Date(transaction.date).toLocaleDateString("pt-BR")}-R$${transaction.amount}-${TRANSACTION_TYPE_OPTIONS.find(opt => opt.value === transaction.type)?.label || transaction.type}-${TRANSACTION_CATEGORY_LABELS[transaction.category as TransactionCategory]}`,
      )
      .join(
        ";",
      )}. Se você não tiver dados suficientes, apenas escreva "Não tenho dados suficientes para gerar um relatório. Por favor, forneça mais informações."`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
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
  }
  catch (error) {
    console.error("Erro ao gerar relatório:", error);
    throw new Error("A requisição demorou muito tempo ou falhou.");
  }
};

export default generateAiReport;
