import { defineStore } from 'pinia';

export type FontFamily = 'default' | 'open-dyslexic' | 'arial';
export type FontSize = 'small' | 'medium' | 'large';

export const useFontStore = defineStore('font', () => {
  // Função para validar o valor de FontFamily
  const isValidFontFamily = (value: string | null): value is FontFamily => {
    return value === 'default' || value === 'open-dyslexic' || value === 'arial';
  };

  // Função para validar o valor de FontSize
  const isValidFontSize = (value: string | null): value is FontSize => {
    return value === 'small' || value === 'medium' || value === 'large';
  };

  // Obter e validar o valor de fontFamily do cookie
  const getSavedFontFamily = (): FontFamily => {
    const fontFamilyCookie = useCookie<string>('fontFamily');
    const saved = fontFamilyCookie.value;
    return isValidFontFamily(saved) ? saved : 'default';
  };

  // Obter e validar o valor de fontSize do cookie
  const getSavedFontSize = (): FontSize => {
    const fontSizeCookie = useCookie<string>('fontSize');
    const saved = fontSizeCookie.value;
    return isValidFontSize(saved) ? saved : 'medium';
  };

  const fontFamily = ref<FontFamily>(getSavedFontFamily());
  const fontSize = ref<FontSize>(getSavedFontSize());

  const applyFontFamily = (newFontFamily: FontFamily) => {
    if (typeof window === 'undefined') return;
    
    document.documentElement.classList.remove('font-default', 'font-open-dyslexic');
    document.documentElement.classList.add(`font-${newFontFamily}`);
    
    // Salvar no cookie com expiração de 365 dias
    const fontFamilyCookie = useCookie<string>('fontFamily', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/'
    });
    fontFamilyCookie.value = newFontFamily;
  };

  const applyFontSize = (newFontSize: FontSize) => {
    if (typeof window === 'undefined') return;
    
    document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
    document.documentElement.classList.add(`text-${newFontSize}`);
    
    // Salvar no cookie com expiração de 365 dias
    const fontSizeCookie = useCookie<string>('fontSize', {
      maxAge: 60 * 60 * 24 * 365,
      path: '/'
    });
    fontSizeCookie.value = newFontSize;
  };

  const setFontFamily = (newFontFamily: FontFamily) => {
    fontFamily.value = newFontFamily;
    applyFontFamily(newFontFamily);
  };

  const setFontSize = (newFontSize: FontSize) => {
    fontSize.value = newFontSize;
    applyFontSize(newFontSize);
  };

  // Aplicar as configurações após a hidratação do componente
  const initializeFontSettings = () => {
    if (typeof window === 'undefined') return;
    
    // Revalidar os valores ao inicializar
    fontFamily.value = getSavedFontFamily();
    fontSize.value = getSavedFontSize();
    
    // Aplicar as configurações
    applyFontFamily(fontFamily.value);
    applyFontSize(fontSize.value);
  };

  // No lado do cliente, inicializar após a montagem do componente
  if (import.meta.client) {
    // Inicialização imediata para SSR
    initializeFontSettings();
    
    // Também inicializar após a montagem para garantir a hidratação completa
    onMounted(() => {
      initializeFontSettings();
    });
  }

  watch(fontFamily, (newFontFamily) => {
    applyFontFamily(newFontFamily);
  });

  watch(fontSize, (newFontSize) => {
    applyFontSize(newFontSize);
  });

  return {
    fontFamily,
    fontSize,
    setFontFamily,
    setFontSize
  };
});