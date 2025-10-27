import { ref, readonly } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from 'vuefire'
import type { AuthError } from 'firebase/auth'
import { signUp, signIn, signInWithGoogle, logOut, getAuthErrorMessage, type SignUpData } from '~/service/authService'

export const useAuth = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const handleSignUp = async (data: SignUpData): Promise<void> => {
    // Ensure we're on client side
    if (import.meta.server) return
    
    loading.value = true
    error.value = null
    
    try {
      await signUp(data)
      await router.push('/')
    } catch (err) {
      const authError = err as AuthError
      error.value = getAuthErrorMessage(authError.code)
    } finally {
      loading.value = false
    }
  }

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    // Ensure we're on client side
    if (import.meta.server) return
    
    loading.value = true
    error.value = null
    
    try {
      await signIn(email, password)
      await router.push('/')
    } catch (err) {
      const authError = err as AuthError
      error.value = getAuthErrorMessage(authError.code)
    } finally {
      loading.value = false
    }
  }

  const handleGoogleAuth = async (): Promise<void> => {
    // Ensure we're on client side
    if (import.meta.server) return
    
    loading.value = true
    error.value = null
    
    try {
      await signInWithGoogle()
      await router.push('/')
    } catch (err) {
      const authError = err as AuthError
      error.value = getAuthErrorMessage(authError.code)
    } finally {
      loading.value = false
    }
  }

  const handleLogOut = async (): Promise<void> => {
    // Ensure we're on client side
    if (import.meta.server) return
    
    loading.value = true
    error.value = null
    
    try {
      await logOut()
      await router.push('/login')
    } catch {
      error.value = 'Erro ao fazer logout. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    user,
    loading: readonly(loading),
    error: readonly(error),
    handleSignUp,
    handleSignIn,
    handleGoogleAuth,
    handleLogOut,
    clearError
  }
}