// tests/composables/useMoney.test.ts
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useMoney } from '@/composables/useMoney'

describe('useMoney', () => {
  it('should format positive amount correctly', () => {
    const amount = ref(1234.56)
    const { formatted } = useMoney(amount)
    
    // Usar regex para verificar o formato, evitando problemas com espaços especiais
    expect(formatted.value).toMatch(/R\$\s*1\.234,56/)
  })

  it('should format negative amount correctly', () => {
    const amount = ref(-1234.56)
    const { formatted } = useMoney(amount)
    
    expect(formatted.value).toMatch(/-R\$\s*1\.234,56/)
  })

  it('should format zero correctly', () => {
    const amount = ref(0)
    const { formatted } = useMoney(amount)
    
    expect(formatted.value).toMatch(/R\$\s*0,00/)
  })

  it('should react to amount changes', () => {
    const amount = ref(100)
    const { formatted } = useMoney(amount)
    
    expect(formatted.value).toMatch(/R\$\s*100,00/)
    
    amount.value = 200
    expect(formatted.value).toMatch(/R\$\s*200,00/)
  })
})