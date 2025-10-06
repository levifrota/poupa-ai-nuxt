import { defineEventHandler, readBody } from 'h3';
import { findOrCreateUserByPhone } from '~/server/service/auth';
import { addTransaction, deleteTransaction, findTransactionByName } from '~/server/service/transaction';
import { extractTransactionInfo } from '~/server/service/ai';
import type { TransactionInput } from '~/server/service/transaction';

// A mock function to simulate sending a reply to WhatsApp
const sendWhatsAppReply = (to: string, message: string) => {
  console.log(`Sending reply to ${to}: "${message}"`);
  // In a real application, you would integrate with a WhatsApp API provider like Twilio here.
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const userPhoneNumber = body.from;
  const userMessage = body.message;

  if (!userPhoneNumber || !userMessage) {
    return { status: 'error', message: 'Missing phone number or message' };
  }

  try {
    const userId = await findOrCreateUserByPhone(userPhoneNumber);
    const transactionInfo = await extractTransactionInfo(userMessage);

    if (transactionInfo.action === 'add' && transactionInfo.name && transactionInfo.amount && transactionInfo.type) {
      const transactionData: TransactionInput = {
        name: transactionInfo.name,
        amount: transactionInfo.amount,
        type: transactionInfo.type,
        category: transactionInfo.category || 'Outros',
        paymentMethod: transactionInfo.paymentMethod || 'WhatsApp',
        date: new Date(),
      };
      await addTransaction(userId, transactionData);
      sendWhatsAppReply(userPhoneNumber, `Transação "${transactionInfo.name}" adicionada com sucesso!`);
    } else if (transactionInfo.action === 'delete' && transactionInfo.name) {
      const transactionToDelete = await findTransactionByName(userId, transactionInfo.name);
      if (transactionToDelete) {
        await deleteTransaction(userId, transactionToDelete.id);
        sendWhatsAppReply(userPhoneNumber, `Transação "${transactionInfo.name}" excluída com sucesso!`);
      } else {
        sendWhatsAppReply(userPhoneNumber, `Não encontrei uma transação com o nome "${transactionInfo.name}".`);
      }
    } else {
      sendWhatsAppReply(userPhoneNumber, "Não entendi o que você quis dizer. Tente algo como: 'adicionar despesa de 25 reais em almoço' ou 'excluir almoço'.");
    }

    return { status: 'ok' };
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    sendWhatsAppReply(userPhoneNumber, "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
    return { status: 'error', message: 'Internal server error' };
  }
});