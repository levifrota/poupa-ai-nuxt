// tests/composables/useFontStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'

// Mock do useCookie
vi.mock('#app', () => ({
  useCookie: vi.fn((name: string) => {
    if (name === 'fontFamily') return ref('default')
    if (name === 'fontSize') return ref('medium')
    return ref(null)
  })
}))

// Importar após os mocks
const { useFontStore } = await import('@/composables/useFontStore')

describe('useFontStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default font settings', () => {
    const store = useFontStore()
    
    expect(['default', 'open-dyslexic', 'arial']).toContain(store.fontFamily)
    expect(['small', 'medium', 'large']).toContain(store.fontSize)
  })

  it('should set font family', () => {
    const store = useFontStore()
    
    store.setFontFamily('open-dyslexic')
    expect(store.fontFamily).toBe('open-dyslexic')
  })

  it('should set font size', () => {
    const store = useFontStore()
    
    store.setFontSize('large')
    expect(store.fontSize).toBe('large')
  })
})