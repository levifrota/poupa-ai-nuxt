import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App | undefined;

/**
 * Lazily initializes (and memoizes) the Firebase Admin app used by
 * server-only routes (e.g. the Telegram webhook). This is intentionally
 * separate from `lib/firebase.ts`, which wraps the CLIENT SDK via vuefire and
 * only works inside a Vue/Nuxt request context.
 *
 * Requires the following server-only env vars (never exposed to the client):
 * `NUXT_FIREBASE_ADMIN_PROJECT_ID`, `NUXT_FIREBASE_ADMIN_CLIENT_EMAIL`,
 * `NUXT_FIREBASE_ADMIN_PRIVATE_KEY` (from a Firebase service account key).
 */
function getAdminApp(): App {
  if (adminApp) return adminApp;

  const existingApp = getApps()[0];
  if (existingApp) {
    adminApp = existingApp;
    return adminApp;
  }

  const config = useRuntimeConfig();
  const projectId = config.firebaseAdminProjectId;
  const clientEmail = config.firebaseAdminClientEmail;
  // Service account private keys are stored as a single-line env var with
  // literal "\n" sequences that must be converted back to real newlines.
  const privateKey = config.firebaseAdminPrivateKey?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Credenciais do Firebase Admin ausentes. Configure NUXT_FIREBASE_ADMIN_PROJECT_ID, " +
        "NUXT_FIREBASE_ADMIN_CLIENT_EMAIL e NUXT_FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  adminApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return adminApp;
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
