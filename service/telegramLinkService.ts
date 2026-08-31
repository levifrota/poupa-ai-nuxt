import { db } from "~/lib/firebase.js";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  buildLinkCodeFromBytes,
  TELEGRAM_LINK_CODE_LENGTH,
  TELEGRAM_LINK_CODE_TTL_MS,
} from "~/lib/telegramTransaction.js";

/**
 * Requer as seguintes regras de segurança no Firestore (não versionadas neste
 * repositório):
 *
 * match /telegramLinkCodes/{code} {
 *   allow create: if request.auth.uid == request.resource.data.uid;
 *   allow read: if request.auth.uid == resource.data.uid;
 *   allow delete: if false; // apenas o servidor (Admin SDK) apaga os códigos
 * }
 *
 * match /telegramLinks/{chatId} {
 *   allow read, delete: if request.auth.uid == resource.data.uid;
 *   allow create, update: if false; // apenas o servidor (Admin SDK) cria vínculos
 * }
 */

export interface TelegramLinkStatus {
  linked: boolean;
  chatId?: string;
}

/**
 * Generates a random, single-use linking code and stores it in Firestore for
 * the Telegram webhook to redeem via `/start <code>`. Expires after
 * `TELEGRAM_LINK_CODE_TTL_MS`.
 */
export async function createTelegramLinkCode(uid: string): Promise<string> {
  const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(TELEGRAM_LINK_CODE_LENGTH)));
  const code = buildLinkCodeFromBytes(randomBytes);
  const now = Timestamp.now();

  await setDoc(doc(db(), "telegramLinkCodes", code), {
    uid,
    createdAt: now,
    expiresAt: Timestamp.fromMillis(now.toMillis() + TELEGRAM_LINK_CODE_TTL_MS),
  });

  return code;
}

/**
 * Checks whether the given user already has a linked Telegram chat.
 */
export async function getTelegramLinkStatus(uid: string): Promise<TelegramLinkStatus> {
  const linksQuery = query(collection(db(), "telegramLinks"), where("uid", "==", uid));
  const snapshot = await getDocs(linksQuery);

  if (snapshot.empty) {
    return { linked: false };
  }

  return { linked: true, chatId: snapshot.docs[0].id };
}

/**
 * Unlinks the given Telegram chat from the current account.
 */
export async function unlinkTelegramChat(chatId: string): Promise<void> {
  await deleteDoc(doc(db(), "telegramLinks", chatId));
}
