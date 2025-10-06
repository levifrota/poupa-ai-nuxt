import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Define the schema for the transaction information
const transactionSchema = z.object({
  action: z.enum(['add', 'delete', 'unknown']),
  name: z.string().optional(),
  amount: z.number().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export type ExtractedTransactionInfo = z.infer<typeof transactionSchema>;

/**
 * Extracts transaction information from a user's message using AI.
 */
export const extractTransactionInfo = async (message: string): Promise<ExtractedTransactionInfo> => {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    schema: transactionSchema,
    prompt: `Analyze the following message and extract the transaction details.
    - The action is 'add' for new transactions and 'delete' for removing them.
    - The type must be 'income' or 'expense'.
    - If crucial information is missing, set the action to 'unknown'.
    - For deletions, the 'name' of the transaction to be deleted is the most important field.
    Message: "${message}"`,
  });

  return object;
};