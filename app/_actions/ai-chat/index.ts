import type { AiChatSchema } from "./schema.ts";
import { aiChatSchema } from "./schema.js";
import { useCurrentUser } from "vuefire";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction } from "~/constants/transactions.js";
import { buildTransactionsContext, buildChatMessages } from "~/lib/aiChat.js";
import { buildGeminiRequestBody, callGemini, extractGeminiText } from "~/lib/gemini.js";

const MAX_TRANSACTIONS_FOR_CONTEXT = 200;

const askAiChat = async ({ message, history }: AiChatSchema): Promise<string> => {
  const validatedData = aiChatSchema.parse({ message, history });

  const user = useCurrentUser();

  if (!user.value?.uid) {
    throw new Error("Usuário não autenticado");
  }

  const userId = user.value.uid;

  try {
    const transactionsQuery = query(
      collection(db(), "users", userId, "transactions"),
      orderBy("date", "desc"),
      limit(MAX_TRANSACTIONS_FOR_CONTEXT)
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

    const transactionsContext = buildTransactionsContext(transactions);
    const messages = buildChatMessages(
      validatedData.history,
      validatedData.message,
      transactionsContext
    );

    const requestBody = buildGeminiRequestBody(messages);
    const response = await callGemini(import.meta.env.VITE_GEMINI_API_KEY, requestBody);

    return extractGeminiText(response);
  } catch (error) {
    console.error("Erro ao responder pergunta do chat:", error);
    throw new Error("A requisição demorou muito tempo ou falhou.");
  }
};

export default askAiChat;
