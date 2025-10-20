// tests/composables/useAuth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { signUp, signIn, signInWithGoogle, logOut } from '@/service/authService'

vi.mock('@/service/authService')
vi.mock('vuefire', () => ({
  useCurrentUser: vi.fn(() => ref(null))
}))

vi.mock('#app', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

// Importar após os mocks
const { useAuth } = await import('@/composables/useAuth')

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { loading, error } = useAuth()
    
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('should handle sign up successfully', async () => {
    vi.mocked(signUp).mockResolvedValue(undefined)
    
    const { handleSignUp, error } = useAuth()
    
    await handleSignUp({
      email: 'test@test.com',
      password: 'password123',
      name: 'Test User'
    })
    
    expect(signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
      name: 'Test User'
    })
    expect(error.value).toBe(null)
  })

  it('should handle sign up error', async () => {
    const mockError = { code: 'auth/email-already-in-use' }
    vi.mocked(signUp).mockRejectedValue(mockError)
    
    const { handleSignUp, error } = useAuth()
    
    await handleSignUp({
      email: 'test@test.com',
      password: 'password123',
      name: 'Test User'
    })
    
    // Aguardar processamento assíncrono
    await vi.waitFor(() => {
      expect(error.value).not.toBe(null)
      expect(typeof error.value).toBe('string')
    })
  })

  it('should handle sign in successfully', async () => {
    vi.mocked(signIn).mockResolvedValue(undefined)
    
    const { handleSignIn, error } = useAuth()
    
    await handleSignIn('test@test.com', 'password123')
    
    expect(signIn).toHaveBeenCalledWith('test@test.com', 'password123')
    expect(error.value).toBe(null)
  })

  it('should handle Google authentication', async () => {
    vi.mocked(signInWithGoogle).mockResolvedValue(undefined)
    
    const { handleGoogleAuth } = useAuth()
    
    await handleGoogleAuth()
    
    expect(signInWithGoogle).toHaveBeenCalled()
  })

  it('should handle logout', async () => {
    vi.mocked(logOut).mockResolvedValue(undefined)
    
    const { handleLogOut } = useAuth()
    
    await handleLogOut()
    
    expect(logOut).toHaveBeenCalled()
  })

  it('should clear error', () => {
    const { clearError } = useAuth()
    
    expect(() => clearError()).not.toThrow()
  })
})