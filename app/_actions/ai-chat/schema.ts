import { z } from "zod";

export const aiChatSchema = z.object({
  message: z.string().min(1, "A mensagem não pode estar vazia"),
  history: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })
    )
    .default([]),
});

export type AiChatSchema = z.infer<typeof aiChatSchema>;
