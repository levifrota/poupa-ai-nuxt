import { defineStore } from 'pinia';
import { ref, watch, onMounted, useCookie } from '#imports';

export type Theme = 'dark' | 'light' | 'colorblind' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast';

export const useThemeStore = defineStore('theme', () => {
  // Função para validar o valor de Theme
  const isValidTheme = (value: string | null): value is Theme => {
    return value === 'dark' || value === 'light' || value === 'colorblind' ||
           value === 'protanopia' || value === 'deuteranopia' || value === 'tritanopia' || 
           value === 'high-contrast';
  };

  // Obter e validar o valor de theme do cookie
  const getSavedTheme = (): Theme => {
    const themeCookie = useCookie<string>('theme');
    const saved = themeCookie.value;
    return isValidTheme(saved) ? saved : 'dark';
  };

  const theme = ref<Theme>(getSavedTheme());

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    document.documentElement.classList.remove('dark', 'light', 'colorblind', 'protanopia', 'deuteranopia', 'tritanopia', 'high-contrast');
    
    document.documentElement.classList.add(newTheme);
    
    // Salvar no cookie com expiração de 365 dias
    const themeCookie = useCookie<string>('theme', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/'
    });
    themeCookie.value = newTheme;
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    applyTheme(newTheme);
  };

  // Aplicar as configurações após a hidratação do componente
  const initializeThemeSettings = () => {
    if (typeof window === 'undefined') return;
    
    // Revalidar os valores ao inicializar
    theme.value = getSavedTheme();
    
    // Aplicar as configurações
    applyTheme(theme.value);
  };

  // No lado do cliente, inicializar após a montagem do componente
  if (import.meta.client) {
    // Inicialização imediata para SSR
    initializeThemeSettings();
    
    // Também inicializar após a montagem para garantir a hidratação completa
    onMounted(() => {
      initializeThemeSettings();
    });
  }

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    theme,
    setTheme
  };
});