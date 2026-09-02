import { useFirestore } from 'vuefire'

export function getDb() {
  return useFirestore()!
}

export const db = getDb
