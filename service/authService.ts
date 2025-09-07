import { useFirebaseAuth } from 'vuefire'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"

// Helper function to ensure we have auth instance
const getAuth = () => {
  const auth = useFirebaseAuth()
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Make sure you are on the client side.')
  }
  return auth
}

export const signUp = async (email: string, password: string) => {
  try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Erro no cadastro: ", error)
    throw error
  }
}

export const signInWithGoogle = async () => {
  try {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error("Erro no login com Google: ", error)
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const auth = getAuth()
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Erro no login: ", error)
    throw error
  }
}

export const logOut = async () => {
  try {
    const auth = getAuth()
    await signOut(auth)
  } catch (error) {
    console.error("Erro no logout: ", error)
    throw error
  }
}
