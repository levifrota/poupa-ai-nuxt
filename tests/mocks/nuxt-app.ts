// tests/mocks/nuxt-app.ts
import { vi } from 'vitest'

export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}))

export const useRoute = vi.fn(() => ({
  path: '/',
  query: {},
}))

export const navigateTo = vi.fn()

export const useCookie = vi.fn((name: string) => ({
  value: name === 'theme' ? 'dark' : name === 'fontFamily' ? 'default' : 'medium'
}))