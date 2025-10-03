import { useFirebaseApp } from 'vuefire'
import {
  getAuth,
  type Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User,
  type AuthError
} from "firebase/auth"

// Helper to ensure client-side execution
const ensureClientSide = (): void => {
  if (import.meta.server) {
    throw new Error('This operation must be performed on the client side')
  }
}

// Get auth instance using Firebase SDK directly
const getAuthInstance = (): Auth => {
  ensureClientSide()
  
  try {
    // Get the Firebase app instance and create auth from it
    const firebaseApp = useFirebaseApp()
    return getAuth(firebaseApp)
  } catch {
    throw new Error('Firebase Auth not initialized. Make sure Firebase is properly configured.')
  }
}

// Wait for auth to be ready
const waitForAuth = (): Promise<Auth> => {
  return new Promise((resolve, reject) => {
    ensureClientSide()

    try {
      const auth = getAuthInstance()
      resolve(auth)
    } catch (error) {
      reject(error)
    }
  })
}

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export const signUp = async ({ email, password, name }: SignUpData): Promise<User> => {
  ensureClientSide()
  
  try {
    const auth = await waitForAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log("Usuário cadastrado:", userCredential?.user);
    
    // Update profile with display name if provided
    if (name) {
      await updateProfile(userCredential.user, {
        displayName: name,
      })
    }
    
    return userCredential.user
  } catch (error) {
    const authError = error as AuthError
    console.error("Erro no cadastro:", authError.code, authError.message)
    throw error
  }
}

export const signInWithGoogle = async (): Promise<User> => {
  ensureClientSide()
  
  try {
    const auth = await waitForAuth()
    const provider = new GoogleAuthProvider()
    
    // Configure Google provider
    provider.addScope('email')
    provider.addScope('profile')
    
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    const authError = error as AuthError
    console.error("Erro no login com Google:", authError)
    throw error
  }
}

export const signIn = async (email: string, password: string): Promise<User> => {
  ensureClientSide()
  
  try {
    const auth = await waitForAuth()
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    const authError = error as AuthError
    console.error("Erro no login:", authError)
    throw error
  }
}

export const logOut = async (): Promise<void> => {
  ensureClientSide()
  
  try {
    const auth = await waitForAuth()
    await signOut(auth)
  } catch (error) {
    const authError = error as AuthError
    console.error("Erro no logout:", authError)
    throw error
  }
}

// Helper function to get user-friendly error messages
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Email inválido.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/popup-closed-by-user': 'Login cancelado pelo usuário.',
    'auth/cancelled-popup-request': 'Login cancelado.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/configuration-not-found': 'Configuração do Firebase não encontrada.',
  }
  
  return errorMessages[errorCode] || 'Erro inesperado. Tente novamente.'
}
