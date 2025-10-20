// tests/composables/useThemeStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'

// Mock do useCookie
vi.mock('#app', () => ({
  useCookie: vi.fn((name: string) => ref('dark'))
}))

// Importar após os mocks
const { useThemeStore } = await import('@/composables/useThemeStore')

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default theme', () => {
    const store = useThemeStore()
    expect(['dark', 'light', 'colorblind', 'protanopia', 'deuteranopia', 'tritanopia', 'high-contrast'])
      .toContain(store.theme)
  })

  it('should set theme correctly', () => {
    const store = useThemeStore()
    
    store.setTheme('light')
    expect(store.theme).toBe('light')
    
    store.setTheme('dark')
    expect(store.theme).toBe('dark')
  })

  it('should handle all theme variants', () => {
    const store = useThemeStore()
    const themes = ['dark', 'light', 'colorblind', 'protanopia', 'deuteranopia', 'tritanopia', 'high-contrast'] as const
    
    themes.forEach(theme => {
      store.setTheme(theme)
      expect(store.theme).toBe(theme)
    })
  })
})