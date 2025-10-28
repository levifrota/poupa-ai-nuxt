import { useFirebaseAuth, useFirestore } from "vuefire";

export function getAuth() {
  return useFirebaseAuth()!;
}

export function getDb() {
  return useFirestore()!;
}

export const db = getDb;
