import { getAuth as firebaseGetAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { useFirebaseApp } from "vuefire";

/**
 * Returns a Firebase Auth instance using the app initialized by nuxt-vuefire
 */
export function getAuth() {
  const app = useFirebaseApp();
  return firebaseGetAuth(app);
}

/**
 * Returns a Firestore instance using the app initialized by nuxt-vuefire
 */
export function getDb() {
  const app = useFirebaseApp();
  return getFirestore(app);
}

// Lazy-loaded Firestore instance
let _db: ReturnType<typeof getFirestore> | null = null;
export function db() {
  if (!_db) {
    _db = getDb();
  }
  return _db;
}

// You can add other Firebase service helpers here as needed
// For example:
// export function getStorage() {
//   const app = useFirebaseApp();
//   return getStorage(app);
// }
